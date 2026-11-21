import { extension } from "./api.js";
import { writePlaylist } from "./hls.js";

const temporaryFiles = "hls-exports";
const lockName = name => `vidz-export:${name}`;

export function canSaveVideo() {
  return typeof window.showSaveFilePicker === "function" || Boolean(
    navigator.storage?.getDirectory && navigator.locks && globalThis.FileSystemFileHandle?.prototype.createWritable
  );
}

async function writeVideo(handle, playlist, signal, progress) {
  signal.throwIfAborted();
  const writable = await handle.createWritable();
  try {
    progress(0, playlist.parts.length);
    await writePlaylist(playlist, writable, signal, progress);
  } catch (error) {
    await writable.abort().catch(() => {});
    throw error;
  }
}

function waitForDownload(id, signal) {
  return new Promise((resolve, reject) => {
    function finish(callback, value) {
      extension.downloads.onChanged.removeListener(changed);
      signal.removeEventListener("abort", aborted);
      callback(value);
    }
    function aborted() {
      finish(reject, signal.reason);
    }
    async function check() {
      try {
        const [download] = await extension.downloads.search({ id });
        if (download?.state === "complete") finish(resolve, download.filename);
        else if (download?.error === "USER_CANCELED") finish(reject, new DOMException("Annulé", "AbortError"));
        else if (!download || download.state === "interrupted") {
          finish(reject, new Error("Le navigateur a interrompu l’enregistrement de la vidéo."));
        }
      } catch (error) {
        finish(reject, error);
      }
    }
    function changed(delta) {
      if (delta.id === id && (delta.state || delta.error)) void check();
    }
    extension.downloads.onChanged.addListener(changed);
    signal.addEventListener("abort", aborted, { once: true });
    if (signal.aborted) aborted();
    else void check();
  });
}

async function downloadFile(file, filename, signal) {
  const url = URL.createObjectURL(file);
  let id;
  try {
    signal.throwIfAborted();
    id = await extension.downloads.download({ url, filename, conflictAction: "uniquify" });
    const savedPath = await waitForDownload(id, signal);
    return savedPath.split(/[\\/]/).pop();
  } catch (error) {
    if (signal.aborted && id !== undefined) await extension.downloads.cancel(id).catch(() => {});
    if (signal.aborted || /cancel(?:led|ed)|annul/i.test(error.message)) {
      throw new DOMException("Annulé", "AbortError");
    }
    throw error;
  } finally {
    URL.revokeObjectURL(url);
  }
}

async function clearAbandonedFiles(directory) {
  for await (const [name, handle] of directory.entries()) {
    if (handle.kind === "file" && /^[0-9a-f-]{36}\.(?:mp4|ts)$/i.test(name)) {
      // An export holds its lock until its download completes or is cancelled.
      await navigator.locks.request(lockName(name), { ifAvailable: true }, async lock => {
        if (lock) await directory.removeEntry(name).catch(() => {});
      });
    }
  }
}

export async function saveVideo(playlist, filename, signal, progress, saving) {
  if (typeof window.showSaveFilePicker === "function") {
    const ts = playlist.extension === "ts";
    const handle = await window.showSaveFilePicker({
      suggestedName: filename,
      types: [{
        description: ts ? "Vidéo MPEG-TS" : "Vidéo MP4",
        accept: ts ? { "video/mp2t": [".ts"] } : { "video/mp4": [".mp4"] }
      }]
    });
    await writeVideo(handle, playlist, signal, progress);
    return handle.name;
  }

  const root = await navigator.storage.getDirectory();
  const directory = await root.getDirectoryHandle(temporaryFiles, { create: true });
  await clearAbandonedFiles(directory);
  const tempName = `${crypto.randomUUID()}.${playlist.extension}`;
  return navigator.locks.request(lockName(tempName), { signal }, async () => {
    try {
      const handle = await directory.getFileHandle(tempName, { create: true });
      await writeVideo(handle, playlist, signal, progress);
      saving();
      return await downloadFile(await handle.getFile(), filename, signal);
    } finally {
      await directory.removeEntry(tempName).catch(() => {});
    }
  });
}
