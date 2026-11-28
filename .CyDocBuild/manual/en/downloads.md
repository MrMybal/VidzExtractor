---
id: downloads
title: Read a card and download
description: Understand previews and size estimates, rename a video and save a direct file.
section: Using Vidz Extracteur
order: 30
previous: quickstart
next: hls-export
revision: 1
---
## Read the video card {#read-card}

```image
{"id":"video-card","src":"assets/vidz-extracteur-hls.png","alt":"Vidz Extracteur popup with one HLS card, an eight-second preview, an estimated size and 360p quality selected.","title":"Example HLS video card","controls":"minimal"}
```

This real capture shows an HLS card. **Actualiser** refreshes detection. **Qualité** selects a stream variant; **Renommer** edits the name; **Télécharger** starts the appropriate saving workflow. Direct files do not need an HLS quality selector. The screenshot's sample title, duration and size describe that example, not a required setting.

| Detail | Meaning |
| --- | --- |
| Preview or poster | Available when the browser can access a player image; **Aperçu indisponible** means no preview was available. |
| Duration and resolution | Shown when known; a missing value is not proof of an invalid video. |
| Size with `≈` | An estimate from the declared bitrate or sampled segments. The final size can differ. |
| Unknown size | The server or player did not supply enough information; saving may still work. |
| One HLS card | Groups a playlist and its variants instead of listing every quality as a separate video. |

## Rename before saving {#rename}

Choose **Renommer**, enter a meaningful name and confirm with **OK**. The extension makes the name suitable for a file; the output extension follows the source format. If a filename already exists, the browser can choose a unique name. Changing `.ts` to `.mp4` manually does not convert its contents.

## Download a direct file {#direct-file}

1. Start the video on its page and open the extension.
2. Choose the direct-file card, optionally rename it, then click **Télécharger**.
3. Check the browser's download list and wait for completion.

**Expected result:** a file saved through the browser's normal download manager. Its location follows your browser preferences. The popup's launch message confirms that downloading started; the browser's completed status confirms the final save.

If the card is HLS, **Télécharger** opens an export tab instead. Continue with [export an HLS video](doc:hls-export#save). If a server stops responding, return to the original page, confirm playback still works and [retry with a fresh detection](doc:troubleshooting#export-errors).
