const formats = {
  mp4: "MP4",
  webm: "WebM",
  m4v: "M4V",
  mov: "MOV",
  ogv: "Ogg",
  mkv: "MKV",
  avi: "AVI",
  mpg: "MPEG",
  mpeg: "MPEG",
  "3gp": "3GP",
  m3u8: "HLS",
  mpd: "DASH"
};

const mimeExtensions = {
  "video/mp4": "mp4",
  "video/webm": "webm",
  "video/x-m4v": "m4v",
  "video/quicktime": "mov",
  "video/ogg": "ogv",
  "video/x-matroska": "mkv",
  "video/x-msvideo": "avi",
  "video/mpeg": "mpeg",
  "video/3gpp": "3gp",
  "application/vnd.apple.mpegurl": "m3u8",
  "application/mpegurl": "m3u8",
  "application/x-mpegurl": "m3u8",
  "audio/vnd.apple.mpegurl": "m3u8",
  "audio/mpegurl": "m3u8",
  "audio/x-mpegurl": "m3u8",
  "application/dash+xml": "mpd"
};

function decode(value) {
  try {
    return decodeURIComponent(value);
  } catch {
    return value;
  }
}

function extensionOf(name) {
  return /\.([a-z0-9]+)$/i.exec(name)?.[1].toLowerCase();
}

function headerFilename(disposition) {
  const encoded = /(?:^|;)\s*filename\*=UTF-8'[^']*'([^;]+)/i.exec(disposition);
  if (encoded) return decode(encoded[1].trim());
  const plain = /(?:^|;)\s*filename\s*=\s*(?:"([^"]+)"|([^;]+))/i.exec(disposition);
  return (plain?.[1] ?? plain?.[2] ?? "").trim();
}

export function httpUrl(value, base) {
  try {
    const url = new URL(value, base);
    if (["http:", "https:"].includes(url.protocol) && !url.username && !url.password) {
      url.hash = "";
      return url;
    }
  } catch {
    // An empty or malformed source is not a media URL.
  }
  return null;
}

export async function readContentSize(url, signal, origin = new URL(url).origin) {
  try {
    const response = await fetch(url, {
      method: "HEAD",
      credentials: new URL(url).origin === origin ? "include" : "omit",
      signal: AbortSignal.any([signal, AbortSignal.timeout(3500)])
    });
    const encoding = response.headers.get("content-encoding");
    const mime = response.headers.get("content-type") ?? "";
    const size = Number(response.headers.get("content-length"));
    if (response.status === 200 && (!encoding || encoding === "identity") &&
        !/^(?:text\/html|application\/json)/i.test(mime) && Number.isSafeInteger(size) && size > 0) {
      return size;
    }
  } catch {
    // Some video servers do not implement HEAD.
  }
  return 0;
}

export function safeFilename(name, extension = "") {
  let stem = name
    .replace(/[<>:"/\\|?*\u0000-\u001f\u007f\u202a-\u202e\u2066-\u2069]/g, "_")
    .replace(/\.[a-z0-9]{1,8}$/i, "")
    .replace(/^[.\s]+|[.\s]+$/g, "")
    .slice(0, 110)
    .replace(/[.\s]+$/g, "") || "video";
  if (/^(?:con|prn|aux|nul|com[1-9¹²³]|lpt[1-9¹²³])(?:\.|$)/i.test(stem)) stem = `_${stem}`;
  return extension ? `${stem}.${extension}` : stem;
}

export function mediaFrom(value, { contentType = "", disposition = "", size = 0, player = false } = {}) {
  const url = httpUrl(value);
  if (!url || url.href.length > 5000) return null;
  const pathName = decode(url.pathname.split("/").pop());
  const name = headerFilename(disposition) || pathName;
  const pathExtension = extensionOf(pathName);
  const extension = extensionOf(name);
  const mime = contentType.split(";")[0].trim().toLowerCase();
  if (/^(?:ts|m4s|cmfv|cmfa|m4a)$/.test(pathExtension) ||
      /^video\/(?:mp2t|iso\.segment)$/.test(mime)) return null;

  const knownMime = Object.hasOwn(mimeExtensions, mime) ? mimeExtensions[mime] : "";
  const knownExtension = [extension, pathExtension].find(candidate => Object.hasOwn(formats, candidate));
  if (!knownMime && mime && !mime.startsWith("video/") && mime !== "application/octet-stream") {
    const textPlaylist = knownExtension === "m3u8" && mime === "text/plain";
    if (!textPlaylist) return null;
  }

  const detected = knownMime || knownExtension;
  if (!detected && !mime.startsWith("video/") && !player) return null;
  const kind = detected === "m3u8" ? "hls" : detected === "mpd" ? "dash" : "file";
  return {
    url: url.href,
    host: url.host,
    name: name.slice(0, 160) || "Vidéo",
    format: formats[detected] || "Vidéo",
    filename: safeFilename(name, detected || "video"),
    kind,
    size
  };
}
