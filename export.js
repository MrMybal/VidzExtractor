import { loadPlaylist, writePlaylist } from "./hls.js";
import { safeFilename } from "./media.js";

const title = document.querySelector("#title");
const status = document.querySelector("#status");
const progress = document.querySelector("#progress");
const save = document.querySelector("#save");
const cancel = document.querySelector("#cancel");
const token = location.hash.slice(1);
let item;
let playlist;
let controller;

function show(message, error = false) {
  status.textContent = message;
  status.classList.toggle("error", error);
}

function errorMessage(error) {
  if (error.name === "TimeoutError") return "Le serveur vidéo a mis trop de temps à répondre.";
  if (error instanceof TypeError) return "Impossible d’accéder au serveur vidéo.";
  return error.message || "L’export a échoué.";
}

cancel.addEventListener("click", () => controller?.abort());

save.addEventListener("click", async () => {
  if (!playlist || controller) return;
  save.disabled = true;
  let writable;
  const exportController = new AbortController();
  controller = exportController;
  progress.hidden = true;
  try {
    const file = await window.showSaveFilePicker({
      suggestedName: safeFilename(item.name, playlist.extension),
      types: [{
        description: playlist.extension === "ts" ? "Vidéo MPEG-TS" : "Vidéo MP4",
        accept: playlist.extension === "ts" ? { "video/mp2t": [".ts"] } : { "video/mp4": [".mp4"] }
      }]
    });
    writable = await file.createWritable();
    progress.max = playlist.parts.length;
    progress.value = 0;
    progress.hidden = false;
    cancel.hidden = false;
    show("Téléchargement des segments…");
    await writePlaylist(playlist, writable, exportController.signal, (current, total) => {
      progress.value = current;
      show(`Téléchargement des segments… ${current} / ${total}`);
    });
    show(`Vidéo enregistrée sous « ${file.name} ».`);
  } catch (error) {
    if (writable) await writable.abort().catch(() => {});
    progress.hidden = true;
    show(error.name === "AbortError" ? "Enregistrement annulé." : errorMessage(error), error.name !== "AbortError");
  } finally {
    controller = null;
    save.disabled = false;
    cancel.hidden = true;
  }
});

try {
  if (/^[0-9a-f-]{36}$/i.test(token)) {
    const key = `export:${token}`;
    item = (await chrome.storage.session.get(key))[key];
    await chrome.storage.session.remove(key);
  }
  if (!item) throw new Error("Rouvre le flux depuis le menu de Vidz Extracteur.");
  title.textContent = item.name;
  if (!window.showSaveFilePicker) throw new Error("Ce navigateur ne permet pas d’enregistrer un export HLS.");
  playlist = await loadPlaylist(item.url, new AbortController().signal, { selectedUrl: item.variantUrl });
  save.disabled = false;
  const format = playlist.extension === "ts" ? "MPEG-TS" : "MP4";
  show(`Prêt à enregistrer en ${format}${item.quality ? ` · ${item.quality}` : ""}.`);
} catch (error) {
  show(errorMessage(error), true);
}
