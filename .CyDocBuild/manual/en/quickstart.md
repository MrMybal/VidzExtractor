---
id: quickstart
title: Save your first video
description: Follow playback, detection and saving, with a visible result at each step.
section: Start here
parent: overview
order: 20
previous: installation
next: downloads
revision: 1
---
**Goal:** save one detected video and find the completed file. Have the [extension installed](doc:installation) and a normal HTTP or HTTPS page with a direct video file or [compatible HLS stream](doc:reference#formats).

## From playback to a file {#first-video}

```steps
{"items":[{"title":"Start playback","body":"Open the video page and press its play button. Leave that tab active, then open Vidz Extracteur from the toolbar or extensions menu.","result":"The popup shows video cards for this tab.","troubleshooting":"If the list is empty, reload the page, play the video again and click **Actualiser** (Refresh). See [no video detected](doc:troubleshooting#no-video)."},{"title":"Choose the video","body":"Read the preview, duration and available details. **Renommer** (Rename) changes the proposed filename; confirm with **OK**. If an HLS card offers **Qualité** (Quality), select a supported option.","result":"The card shows the name and, when offered, the quality you want.","troubleshooting":"A missing preview or unknown size does not by itself prevent saving. [Read the card](doc:downloads#read-card) for details."},{"title":"Start saving","body":"Click **Télécharger** (Download). A direct file goes to the browser's downloads. For HLS, wait for the export tab to be ready, click **Enregistrer la vidéo** (Save video), and keep the tab open.","result":"The browser starts a direct download, or the HLS tab shows segment progress.","troubleshooting":"If saving is blocked or fails, match the message in [troubleshooting](doc:troubleshooting#export-errors)."},{"title":"Confirm completion","body":"For a direct file, check the browser's download list. For HLS, wait for **Vidéo enregistrée sous…** (Video saved as…) and check the saved file.","result":"A completed video file is available at the selected location or in the browser's download folder.","troubleshooting":"A progress bar reaching its end can precede the browser's final save. Wait for the completion message. See [file playback](doc:troubleshooting#playback) if the file will not open."}]}
```

## Choose your next task {#next-task}

Use [download controls](doc:downloads) to understand names, previews and estimates. Read the [HLS tutorial](doc:hls-export) for quality selection, storage, cancellation and output formats.
