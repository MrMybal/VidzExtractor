import { httpUrl, readContentSize } from "./media.js";

export class HlsPlaylistError extends Error {}

function attributes(line) {
  const values = line.slice(line.indexOf(":") + 1);
  return Object.fromEntries(
    [...values.matchAll(/(?:^|,)\s*([A-Z0-9-]+)\s*=\s*(?:"([^"]*)"|([^,]*))/g)]
      .map(([, key, quoted, bare]) => [key, quoted ?? bare.trim()])
  );
}

function playlistUrl(value, base) {
  const url = value && !value.includes("{$") && httpUrl(value, base);
  if (!url) throw new HlsPlaylistError("Une adresse du flux HLS est invalide.");
  return url.href;
}

function positiveInteger(value) {
  const number = Number(value);
  return Number.isSafeInteger(number) && number > 0 ? number : 0;
}

function masterPlaylist(lines, base) {
  const tracks = lines.filter(line => /^#EXT-X-(?:MEDIA|I-FRAME-STREAM-INF):/.test(line)).map(attributes);
  const relatedUrls = new Set(tracks.map(track => httpUrl(track.URI || "", base)?.href)
    .filter(url => url && url !== base));
  const variants = [];
  for (const [index, line] of lines.entries()) {
    if (!line.startsWith("#EXT-X-STREAM-INF:")) continue;
    const variant = attributes(line);
    const uri = lines[index + 1];
    if (!uri || uri.startsWith("#")) continue;
    const url = playlistUrl(uri, base);
    relatedUrls.add(url);
    const codecs = variant.CODECS?.split(",") ?? [];
    if (!variant.RESOLUTION && codecs.length && codecs.every(codec =>
      /^(?:mp4a|ac-3|ec-3|opus|flac|alac)(?:\.|$)/i.test(codec.trim())
    )) continue;
    const tracksRequired = ["AUDIO", "VIDEO"].filter(type => {
      const group = tracks.filter(track => variant[type] && track.TYPE === type && track["GROUP-ID"] === variant[type]);
      return group.length && group.every(track => track.URI);
    });
    const unsupported = tracksRequired.includes("VIDEO") ? "Piste vidéo séparée"
      : tracksRequired.includes("AUDIO") ? "Piste audio séparée" : "";
    const [, width, height] = /^(\d+)x(\d+)$/i.exec(variant.RESOLUTION ?? "") ?? [];
    if (!variants.some(entry => entry.url === url)) variants.push({
      url, width: positiveInteger(width), height: positiveInteger(height),
      bandwidth: positiveInteger(variant.BANDWIDTH),
      averageBandwidth: positiveInteger(variant["AVERAGE-BANDWIDTH"]),
      unsupported
    });
  }
  variants.sort((a, b) => b.height - a.height || b.bandwidth - a.bandwidth);
  return { variants, relatedUrls: [...relatedUrls] };
}

export function parsePlaylist(text, base) {
  const lines = text.split(/\r?\n/).map(line => line.trim()).filter(Boolean);
  if (lines[0] !== "#EXTM3U") throw new HlsPlaylistError("Le serveur n’a pas fourni de liste HLS valide.");
  if (lines.some(line => /^#EXT-X-(?:KEY|SESSION-KEY):/.test(line) && attributes(line).METHOD !== "NONE")) {
    throw new HlsPlaylistError("Ce flux HLS est chiffré.");
  }
  if (lines.some(line => line.startsWith("#EXT-X-STREAM-INF:"))) {
    return masterPlaylist(lines, base);
  }
  if (!lines.includes("#EXT-X-ENDLIST")) throw new HlsPlaylistError("L’export HLS est réservé aux vidéos à la demande.");
  if (lines.some(line => /^#EXT-X-(?:BYTERANGE|DISCONTINUITY|GAP|I-FRAMES-ONLY|SKIP)(?::|$)/.test(line))) {
    throw new HlsPlaylistError("Cette structure de flux HLS n’est pas prise en charge.");
  }

  const maps = lines.filter(line => line.startsWith("#EXT-X-MAP:")).map(attributes);
  if (maps.length > 1 || maps.some(map => map.BYTERANGE)) {
    throw new HlsPlaylistError("Cette structure de flux HLS n’est pas prise en charge.");
  }
  const parts = [];
  const durations = [];
  let duration = null;
  for (const line of lines) {
    if (line.startsWith("#EXTINF:") && duration === null) {
      const seconds = Number(line.slice(8).split(",")[0]);
      duration = Number.isFinite(seconds) && seconds > 0 ? seconds : 0;
    } else if (!line.startsWith("#") && duration !== null) {
      parts.push(playlistUrl(line, base));
      durations.push(duration);
      duration = null;
    } else if (!line.startsWith("#") || line.startsWith("#EXTINF:")) {
      throw new HlsPlaylistError("La liste HLS contient des segments invalides.");
    }
  }
  if (!parts.length || duration !== null) throw new HlsPlaylistError("La liste HLS contient des segments invalides.");
  if (maps.length) {
    parts.unshift(playlistUrl(maps[0].URI, base));
    durations.unshift(0);
  }
  return {
    parts, durations, duration: durations.reduce((sum, seconds) => sum + seconds, 0),
    extension: maps.length ? "mp4" : "ts"
  };
}

async function fetchFile(url, origin, signal, timeout = 60_000) {
  const credentials = new URL(url).origin === origin ? "include" : "omit";
  const response = await fetch(url, {
    credentials,
    signal: AbortSignal.any([signal, AbortSignal.timeout(timeout)])
  });
  if (!response.ok || response.status === 206 || !response.body) {
    throw new Error(`Le serveur vidéo a renvoyé une réponse incomplète ou une erreur (HTTP ${response.status}).`);
  }
  return response;
}

export async function readPlaylist(url, signal, { origin = new URL(url).origin, timeout } = {}) {
  const response = await fetchFile(url, origin, signal, timeout);
  let text = "";
  for await (const chunk of response.body.pipeThrough(new TextDecoderStream())) {
    text += chunk;
    if (text.length > 2_000_000) throw new Error("La liste HLS est trop volumineuse.");
  }
  return { ...parsePlaylist(text, response.url || url), origin, resolvedUrl: response.url || url };
}

export async function loadPlaylist(root, signal, { selectedUrl, timeout } = {}) {
  const origin = new URL(root).origin;
  let url = playlistUrl(selectedUrl || root, root);
  for (let level = 0; level < 3; level += 1) {
    const playlist = await readPlaylist(url, signal, { origin, timeout });
    if (!playlist.variants) return playlist;
    const selected = playlist.variants.filter(variant => !variant.unsupported)
      .reduce((best, variant) => !best || variant.bandwidth > best.bandwidth ? variant : best, null);
    if (!selected) throw new HlsPlaylistError("Aucune variante avec des pistes intégrées n’a été trouvée.");
    url = selected.url;
  }
  throw new HlsPlaylistError("Les variantes de ce flux HLS sont imbriquées trop profondément.");
}

export async function measurePlaylist(playlist, variant, signal) {
  const { parts, durations, duration, extension, origin } = playlist;
  const bitrateSize = Math.round(duration * (variant?.averageBandwidth || variant?.bandwidth || 0) / 8);
  const firstSegment = Number(extension === "mp4");
  const segmentCount = parts.length - firstSegment;
  const sampleCount = Math.min(segmentCount, 3);
  if (segmentCount > sampleCount && variant?.averageBandwidth && bitrateSize) {
    return { bytes: bitrateSize, estimated: true };
  }

  const indexes = Array.from({ length: sampleCount }, (_, index) => firstSegment +
    (sampleCount === 1 ? 0 : Math.round(index * (segmentCount - 1) / (sampleCount - 1))));
  if (firstSegment) indexes.unshift(0);
  const sizes = await Promise.all(indexes.map(index => readContentSize(parts[index], signal, origin)));
  if (indexes.length === parts.length && sizes.every(Boolean)) {
    return { bytes: sizes.reduce((total, size) => total + size, 0), estimated: false };
  }
  let sampleBytes = 0;
  let sampleDuration = 0;
  for (const [position, index] of indexes.entries()) {
    if (sizes[position] && durations[index]) {
      sampleBytes += sizes[position];
      sampleDuration += durations[index];
    }
  }
  const estimate = sampleDuration && duration
    ? Math.round(duration * (sampleBytes / sampleDuration) + (firstSegment ? sizes[0] : 0))
    : bitrateSize;
  return { bytes: estimate, estimated: Boolean(estimate) };
}

function validateSegment(extension, initialization) {
  const header = new Uint8Array(8);
  let length = 0;
  return new TransformStream({
    transform(chunk, controller) {
      if (length < header.length) {
        const missing = header.length - length;
        const copied = Math.min(missing, chunk.length);
        header.set(chunk.subarray(0, copied), length);
        length += copied;
        if (length < header.length) return;
        const box = String.fromCharCode(...header.subarray(4));
        const valid = extension === "ts" ? header[0] === 0x47
          : initialization ? box === "ftyp"
          : ["styp", "sidx", "moof", "emsg", "prft"].includes(box);
        if (!valid) throw new Error("Le serveur a fourni un segment vidéo dans un format non pris en charge.");
        controller.enqueue(header);
        chunk = chunk.subarray(copied);
      }
      if (chunk.length) controller.enqueue(chunk);
    },
    flush() {
      if (length < header.length) throw new Error("Le serveur a fourni un segment vidéo incomplet.");
    }
  });
}

export async function writePlaylist(playlist, writable, signal, progress) {
  const { parts, extension, origin } = playlist;
  for (const [index, url] of parts.entries()) {
    const response = await fetchFile(url, origin, signal);
    const segment = response.body.pipeThrough(validateSegment(extension, index === 0), { signal });
    await segment.pipeTo(writable, { preventClose: true, preventAbort: true, signal });
    progress(index + 1, parts.length);
  }
  signal.throwIfAborted();
  await writable.close();
}
