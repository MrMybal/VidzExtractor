import { extension } from "./api.js";
import { httpUrl, mediaFrom, readContentSize, safeFilename } from "./media.js";
import { HlsPlaylistError, loadPlaylist, measurePlaylist, readPlaylist } from "./hls.js";
import { playerForStream, scanPlayers } from "./players.js";

const scanButton = document.querySelector("#scan");
const list = document.querySelector("#videos");
const empty = document.querySelector("#empty");
const status = document.querySelector("#status");
const template = document.querySelector("#video-card");
const numberFormat = new Intl.NumberFormat("fr-FR", { maximumFractionDigits: 1 });
const manifests = new Map();
const renditions = new Map();
const sizes = new Map();
const selectedQualities = new Map();
const names = new Map();
const cards = new Map();
const queue = [];

let tab;
let storageKey;
let networkItems = [];
let players = [];
let scanning = false;
let busy = false;
let downloadId;
let blocked = false;
let requestController = new AbortController();
let activeRequests = 0;

function startRequests() {
  while (activeRequests < 4 && queue.length) {
    const { signal, run } = queue.shift();
    if (signal.aborted) continue;
    activeRequests += 1;
    run().finally(() => {
      activeRequests -= 1;
      startRequests();
    });
  }
}

function inspect(cache, key, task) {
  if (cache.has(key)) return cache.get(key);
  const { signal } = requestController;
  const loading = { loading: true };
  cache.set(key, loading);
  queue.push({
    signal,
    async run() {
      let result;
      try {
        result = { data: await task(signal) };
      } catch (error) {
        result = { error };
      }
      if (!signal.aborted) {
        cache.set(key, result);
        render();
      }
    }
  });
  startRequests();
  return loading;
}

function resetInspections() {
  requestController.abort();
  requestController = new AbortController();
  queue.length = 0;
  manifests.clear();
  renditions.clear();
  sizes.clear();
}

function statusMessage(message, error = false) {
  status.hidden = !message;
  status.textContent = message;
  status.classList.toggle("error", error);
}

function sizeLabel({ bytes, estimated }) {
  if (!Number.isFinite(bytes) || bytes <= 0) return "Taille inconnue";
  if (bytes < 1024) return `${estimated ? "≈ " : ""}${bytes} o`;
  const power = Math.min(Math.floor(Math.log2(bytes) / 10), 3);
  return `${estimated ? "≈ " : ""}${numberFormat.format(bytes / 1024 ** power)} ${["o", "Ko", "Mo", "Go"][power]}`;
}

function durationLabel(seconds) {
  if (!Number.isFinite(seconds) || seconds <= 0) return "";
  const total = Math.round(seconds);
  const minutes = Math.floor(total / 60);
  const pair = number => String(number).padStart(2, "0");
  return minutes < 60 ? `${minutes}:${pair(total % 60)}`
    : `${Math.floor(minutes / 60)}:${pair(minutes % 60)}:${pair(total % 60)}`;
}

function resolution({ width, height } = {}) {
  if (!width || !height) return "";
  return width >= height ? `${height}p` : `${width} × ${height}`;
}

function variantLabel(variant, options) {
  const quality = resolution(variant);
  const distinguish = !quality || options.some(option => option !== variant && resolution(option) === quality);
  const rate = variant.bandwidth && `${numberFormat.format(variant.bandwidth / 1_000_000)} Mbit/s`;
  return [quality, distinguish && rate, variant.unsupported].filter(Boolean).join(" · ") || "Source originale";
}

function previewUrl(value) {
  if (!value || value.length > 240_000) return "";
  return /^data:image\/(?:jpeg|png|webp|avif|gif);base64,/i.test(value) ? value : httpUrl(value)?.href ?? "";
}

function streamDetails(item, player, manifest, variant, inspection) {
  const child = manifests.get(variant?.url)?.data;
  const selected = variant && !variant.unsupported;
  const key = selected ? `${item.url}\n${variant.url}` : item.url;
  const rendition = selected && !(child?.parts) ? inspect(renditions, key, signal =>
    loadPlaylist(item.url, signal, { selectedUrl: variant.url, timeout: 5000 })
  ) : null;
  const playlist = selected ? (child?.parts ? { ...child, origin: manifest.origin } : rendition?.data)
    : manifest?.parts ? manifest : null;
  const measurement = playlist ? inspect(sizes, key, signal => measurePlaylist(playlist, variant, signal)) : null;
  const error = inspection.error ?? rendition?.error;
  const message = error instanceof HlsPlaylistError ? error.message : error ? "Métadonnées du flux indisponibles" : "";
  const unsupported = manifest?.variants && !variant ? "Pistes intégrées indisponibles pour ce flux" : "";
  let size = "Taille en cours de calcul…";
  if (measurement?.data) size = sizeLabel(measurement.data);
  else if (error || unsupported) size = "Taille inconnue";
  return {
    duration: playlist?.duration || player?.duration,
    details: [playlist && (playlist.extension === "mp4" ? "MP4" : "MPEG-TS"),
      !manifest?.variants && resolution(player ?? undefined), message || unsupported || size],
    blocked: Boolean(unsupported) || error instanceof HlsPlaylistError,
    loading: Boolean(inspection.loading),
    partUrls: playlist?.parts ?? []
  };
}

function render() {
  const items = new Map(networkItems.map(item => [item.url, item]));
  const exactPlayers = new Map();
  for (const player of players) {
    for (const source of player.sources) {
      const item = mediaFrom(source.url, { contentType: source.mime, player: true });
      if (!item) continue;
      const playerName = player.title || player.pageTitle;
      if (item.format === "Vidéo" && playerName) {
        item.name = playerName.slice(0, 160);
        item.filename = safeFilename(item.name, "video");
      }
      if (!items.has(item.url)) items.set(item.url, { ...item, frameId: player.frameId });
      if (!exactPlayers.get(item.url)?.playing) exactPlayers.set(item.url, player);
    }
  }

  const streams = [...items.values()].filter(item => item.kind === "hls");
  const childUrls = new Set();
  const partUrls = new Set();
  for (const item of streams) {
    const { data } = inspect(manifests, item.url, signal => readPlaylist(item.url, signal, { timeout: 5000 }));
    for (const url of data?.relatedUrls ?? []) {
      if (url !== item.url && url !== data.resolvedUrl) childUrls.add(url);
    }
    for (const url of data?.parts ?? []) partUrls.add(url);
  }
  const rootStreams = streams.filter(item => !childUrls.has(item.url) &&
    !childUrls.has(manifests.get(item.url)?.data?.resolvedUrl));
  const roots = rootStreams.length ? rootStreams : streams;
  const rootUrls = new Set(roots.map(item => item.url));
  const rows = [];
  for (const item of items.values()) {
    let player = exactPlayers.get(item.url);
    let options;
    let variant;
    let summary;
    if (item.kind === "hls") {
      if (!rootUrls.has(item.url)) continue;
      const inspection = manifests.get(item.url);
      const manifest = inspection.data;
      options = manifest?.variants ?? [];
      variant = options.find(option => option.url === selectedQualities.get(item.url) && !option.unsupported)
        ?? options.find(option => !option.unsupported);
      const relatedUrls = manifest?.relatedUrls ? new Set(manifest.relatedUrls) : null;
      player ??= playerForStream(item, roots, players, relatedUrls, manifest?.duration);
      summary = streamDetails(item, player, manifest, variant, inspection);
      for (const url of summary.partUrls) partUrls.add(url);
    } else if (item.kind === "file") {
      if (partUrls.has(item.url) && !player) continue;
      const size = item.size ? { data: item.size } : inspect(sizes, item.url, signal => readContentSize(item.url, signal));
      summary = {
        duration: player?.duration,
        details: [resolution(player ?? undefined), size.loading ? "Lecture de la taille…" : sizeLabel({ bytes: size.data })]
      };
    } else {
      summary = { duration: player?.duration, details: ["Export indisponible"], blocked: true };
    }

    const streamTitle = player?.title || (roots.length === 1 && tab.title) || player?.pageTitle;
    const defaultName = item.kind === "hls" && streamTitle || item.name;
    rows.push({
      ...item, summary, options, variant,
      label: names.get(item.url) ?? defaultName.slice(0, 160),
      defaultName: defaultName.slice(0, 160),
      playing: player?.playing,
      preview: previewUrl(player?.preview)
    });
  }
  const visible = rows.filter(item => item.kind !== "file" || !partUrls.has(item.url) || exactPlayers.has(item.url))
    .sort((a, b) => Number(Boolean(b.playing)) - Number(Boolean(a.playing)));
  const keys = new Set(visible.map(item => item.url));
  for (const [key, card] of cards) {
    if (!keys.has(key)) {
      card.row.remove();
      cards.delete(key);
    }
  }
  for (const [index, item] of visible.entries()) {
    const card = cards.get(item.url) ?? createCard(item.url);
    updateCard(card, item);
    if (list.children[index] !== card.row) list.insertBefore(card.row, list.children[index] ?? null);
  }
  empty.hidden = visible.length > 0;
  list.hidden = !visible.length;
  empty.textContent = scanning ? "Recherche de vidéos…" : blocked
    ? "Ouvre une page web pour détecter ses vidéos."
    : "Aucune vidéo détectée. Lance la lecture, puis actualise cette liste.";
  scanButton.disabled = scanning || blocked;
}

function createCard(url) {
  const row = template.content.firstElementChild.cloneNode(true);
  const input = row.querySelector("input");
  const form = row.querySelector("form");
  const select = row.querySelector("select");
  const rename = row.querySelector(".rename");
  const download = row.querySelector(".download");
  const preview = row.querySelector("img");
  const fallback = row.querySelector(".preview-empty");
  const card = { row, input, form, select, rename, download, preview, fallback };
  cards.set(url, card);

  select.addEventListener("change", () => {
    selectedQualities.set(url, select.value);
    render();
  });
  const finishEditing = () => {
    form.hidden = true;
    rename.setAttribute("aria-expanded", "false");
    rename.focus();
  };
  rename.setAttribute("aria-expanded", "false");
  rename.addEventListener("click", () => {
    if (!form.hidden) {
      finishEditing();
      return;
    }
    form.hidden = false;
    rename.setAttribute("aria-expanded", "true");
    input.value = card.item.label;
    input.select();
  });
  form.addEventListener("submit", event => {
    event.preventDefault();
    const name = input.value.trim();
    if (name) names.set(url, name);
    finishEditing();
    render();
  });
  input.addEventListener("keydown", event => {
    if (event.key === "Escape") {
      event.preventDefault();
      finishEditing();
    }
  });
  preview.addEventListener("load", () => {
    preview.hidden = false;
    fallback.hidden = true;
  });
  preview.addEventListener("error", () => {
    preview.hidden = true;
    fallback.hidden = false;
  });
  download.addEventListener("click", () => save(card.item));
  return card;
}

function updateCard(card, item) {
  card.item = item;
  const name = card.row.querySelector(".video-name");
  const details = card.row.querySelector(".video-details");
  const duration = card.row.querySelector(".duration");
  name.textContent = item.label;
  name.title = item.label;
  card.row.querySelector(".video-format").textContent = item.format;
  details.textContent = [...item.summary.details, item.playing && "En lecture", item.host].filter(Boolean).join(" · ");
  details.title = details.textContent;
  duration.textContent = durationLabel(item.summary.duration);
  duration.hidden = !duration.textContent;
  if (card.preview.getAttribute("src") !== (item.preview || null)) {
    card.preview.hidden = true;
    card.fallback.hidden = false;
    if (item.preview) card.preview.src = item.preview;
    else card.preview.removeAttribute("src");
  }

  const options = item.options ?? [];
  const signature = JSON.stringify(options);
  if (card.options !== signature) {
    card.select.replaceChildren(...options.map(variant => {
      const option = new Option(variantLabel(variant, options), variant.url);
      option.disabled = Boolean(variant.unsupported);
      return option;
    }));
    card.options = signature;
  }
  card.select.closest("label").hidden = !options.length;
  card.select.disabled = !item.variant;
  if (item.variant) {
    card.select.value = item.variant.url;
    card.select.title = variantLabel(item.variant, options);
  }
  card.download.hidden = item.kind === "dash";
  card.download.disabled = busy || Boolean(item.summary.blocked || item.summary.loading);
  card.download.setAttribute("aria-label", `Télécharger ${item.label}`);
}

async function refresh() {
  scanning = true;
  resetInspections();
  statusMessage("");
  render();
  try {
    const inject = allFrames => extension.scripting.executeScript({
      target: { tabId: tab.id, allFrames },
      func: scanPlayers
    });
    const frames = await inject(true).catch(() => inject(false)).catch(() => []);
    players = frames.flatMap(frame => (frame.result ?? []).map(player => ({
      ...player, frameId: frame.frameId,
      urls: player.sources.map(source => httpUrl(source.url)?.href).filter(Boolean),
      adaptive: !player.sources.length || player.sources.some(source => /^blob:/i.test(source.url))
    }))).sort((a, b) => Number(b.playing) - Number(a.playing));
    networkItems = (await extension.storage.session.get(storageKey))[storageKey]?.items ?? [];
  } catch {
    statusMessage("La détection a échoué. Recharge la page de la vidéo et réessaie.", true);
  } finally {
    scanning = false;
    render();
  }
}

async function save(item) {
  if (busy || item.summary.blocked) return;
  busy = true;
  downloadId = undefined;
  statusMessage("");
  render();
  let exportKey;
  try {
    if (item.kind === "hls") {
      const token = crypto.randomUUID();
      exportKey = `export:${token}`;
      await extension.storage.session.set({
        [exportKey]: {
          url: item.url, name: item.label, variantUrl: item.variant?.url,
          quality: item.variant && variantLabel(item.variant, item.options)
        }
      });
      await extension.tabs.create({ url: extension.runtime.getURL(`export.html#${token}`) });
      return;
    }
    const suffix = item.filename.split(".").at(-1);
    downloadId = await extension.downloads.download({
      url: item.url,
      filename: item.label === item.defaultName ? item.filename : safeFilename(item.label, suffix),
      conflictAction: "uniquify"
    });
    const [download] = await extension.downloads.search({ id: downloadId });
    showDownloadState(download?.state);
  } catch {
    if (exportKey) await extension.storage.session.remove(exportKey).catch(console.error);
    statusMessage("Impossible de lancer le téléchargement.", true);
  } finally {
    busy = false;
    render();
  }
}

function showDownloadState(state) {
  if (state === "interrupted") statusMessage("Le téléchargement a été interrompu.", true);
  else if (state === "complete") statusMessage("Vidéo téléchargée.");
  else statusMessage("Téléchargement lancé dans le navigateur.");
}

extension.downloads.onChanged.addListener(delta => {
  if (delta.id === downloadId && delta.state) showDownloadState(delta.state.current);
});

extension.storage.onChanged.addListener((changes, area) => {
  if (area !== "session" || !changes[storageKey]) return;
  const { oldValue, newValue } = changes[storageKey];
  if (oldValue && oldValue.since !== newValue?.since) {
    players = [];
    resetInspections();
    selectedQualities.clear();
    names.clear();
  }
  networkItems = newValue?.items ?? [];
  render();
});

scanButton.addEventListener("click", refresh);
[tab] = await extension.tabs.query({ active: true, currentWindow: true });
blocked = !Number.isInteger(tab?.id) || !/^https?:\/\//i.test(tab.url ?? "");
if (blocked) {
  render();
} else {
  storageKey = `tab:${tab.id}`;
  await refresh();
}
