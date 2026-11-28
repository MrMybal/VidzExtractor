---
id: hls-export
title: Export an HLS video
description: Select a supported quality, assemble the segments and wait for the final save.
section: Using Vidz Extracteur
parent: downloads
order: 40
previous: downloads
next: troubleshooting
revision: 1
---
**Goal:** save one complete HLS video on demand. Before starting, confirm that the video plays on its original page, the stream is [supported](doc:reference#formats), and you have space for the output. Firefox also assembles the video in temporary browser storage before downloading it.

## Choose quality {#choose-quality}

Open the HLS card's **Qualité** selector when offered. Choose a supported variant before clicking **Télécharger**. Separate audio or video tracks can appear as unavailable options. If all variants require separate tracks, this release cannot export that stream.

A higher declared bitrate usually means more data to download; the size marked `≈` remains an estimate. The extension selects an available variant when none has been chosen. Opening an export tab carries the chosen quality into that export.

## Save and verify {#save}

```steps
{"items":[{"title":"Open the export tab","body":"Click **Télécharger** on the HLS card. Wait while the new **Export HLS** tab reads the playlist.","result":"**Prêt à enregistrer…** (Ready to save…) appears with the output format and the quality when known.","troubleshooting":"If you see **Rouvre le flux depuis le menu de Vidz Extracteur**, close this export tab and open a new one from the card. Its launch information is consumed on first opening."},{"title":"Save the original segments","body":"Click **Enregistrer la vidéo**. In Chrome, choose a file location if the browser opens a save picker. Keep the export tab open while segments download.","result":"The tab shows **Téléchargement des segments…** and a segment count.","troubleshooting":"If an access, timeout or storage error appears, use [export errors](doc:troubleshooting#export-errors)."},{"title":"Wait for the final save","body":"In Firefox, wait through **Enregistrement de la vidéo par le navigateur…** after assembly. In both editions, wait for **Vidéo enregistrée sous…** before closing the tab.","result":"The completed file is saved. Firefox follows your download-location preferences.","troubleshooting":"Do not treat the last segment as final completion: the browser may still be saving the assembled file."}]}
```

## Why there are two saving stages {#saving-stages}

```diagram
{"type":"sequence","title":"HLS export in Firefox","description":"Firefox assembles segments in temporary browser storage, then its download manager saves the resulting file. Leave the export tab open through both stages.","actors":[{"id":"you","label":"You"},{"id":"export","label":"Export tab"},{"id":"browser","label":"Browser"}],"messages":[{"from":"you","to":"export","label":"Enregistrer la vidéo"},{"from":"export","to":"browser","label":"Assemble segments in temporary storage"},{"from":"browser","to":"export","label":"Assembled file ready","reply":true},{"from":"export","to":"browser","label":"Save through download manager"},{"from":"browser","to":"export","label":"Save completed","reply":true},{"from":"export","to":"you","label":"Vidéo enregistrée sous…","reply":true}]}
```

Chrome can write directly to the location selected in its save picker. The extension does not transcode: MPEG-TS segments produce `.ts`; a supported fragmented MP4 stream produces `.mp4`. Codec compatibility still depends on your playback application.

## Cancel or restart {#cancel}

**Annuler** cancels an active save. Wait for **Enregistrement annulé.** before retrying. Closing the export tab interrupts its work. Reloading an already opened export tab does not restore its original launch information: return to the video card and open a fresh export.

If the video page has navigated, start playback again and refresh detection before retrying. See [supported HLS structures](doc:reference#hls-limits) if the same stream is consistently rejected.
