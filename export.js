import { extension } from "./api.js";
import { loadPlaylist } from "./hls.js";
import { safeFilename } from "./media.js";
import { canSaveVideo, saveVideo } from "./output.js";

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
  if (error.name === "QuotaExceededError") return "L’espace de stockage temporaire est insuffisant.";
  if (error.name === "SecurityError") return "Le navigateur a refusé l’accès au stockage vidéo.";
  if (error instanceof TypeError) return "Impossible d’accéder au serveur vidéo.";
  return error.message || "L’export a échoué.";
}

cancel.addEventListener("click", () => controller?.abort());

save.addEventListener("click", async () => {
  if (!playlist || controller) return;
  save.disabled = true;
  const exportController = new AbortController();
  controller = exportController;
  progress.hidden = true;
  try {
    const filename = safeFilename(item.name, playlist.extension);
    const saved = await saveVideo(playlist, filename, exportController.signal, (current, total) => {
      progress.hidden = false;
      cancel.hidden = false;
      progress.max = total;
      progress.value = current;
      show(`Téléchargement des segments… ${current} / ${total}`);
    }, () => show("Enregistrement de la vidéo par le navigateur…"));
    show(`Vidéo enregistrée sous « ${saved} ».`);
  } catch (error) {
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
    item = (await extension.storage.session.get(key))[key];
    await extension.storage.session.remove(key);
  }
  if (!item) throw new Error("Rouvre le flux depuis le menu de Vidz Extracteur.");
  title.textContent = item.name;
  if (!canSaveVideo()) throw new Error("Ce navigateur ne permet pas d’enregistrer un export HLS.");
  playlist = await loadPlaylist(item.url, new AbortController().signal, { selectedUrl: item.variantUrl });
  save.disabled = false;
  const format = playlist.extension === "ts" ? "MPEG-TS" : "MP4";
  show(`Prêt à enregistrer en ${format}${item.quality ? ` · ${item.quality}` : ""}.`);
} catch (error) {
  show(errorMessage(error), true);
}
