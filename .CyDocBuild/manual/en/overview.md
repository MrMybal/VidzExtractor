---
id: overview
title: Vidz Extracteur
description: Save a video from the current Chrome or Firefox tab and choose the right workflow.
section: Start here
order: 0
previous:
next: installation
revision: 1
---
Vidz Extracteur 1.2.0 is a Chrome and Firefox extension for saving videos detected in the current tab. It supports direct video files and compatible HLS videos on demand. The extension's buttons are in French; this manual explains their labels in English.

## Start with your goal {#getting-started}

- **First use:** [install the extension](doc:installation), then [save your first video](doc:quickstart).
- **A video card is visible:** [read the card and download a file](doc:downloads), or [export an HLS video](doc:hls-export).
- **Something is missing or fails:** [find the symptom](doc:troubleshooting).
- **Check support or privacy:** read the [formats, permissions and limits](doc:reference).

## How saving works {#how-it-works}

Start playback on the original page before opening the extension. Detection uses the tab's media requests and players. A direct file goes to the browser's download manager. An HLS stream opens a separate export tab that assembles its original segments.

```diagram
{"type":"flow","title":"Choose a saving workflow","description":"After starting playback, open the extension. A direct file downloads through the browser. HLS needs one more action in its export tab.","nodes":[{"id":"detect","label":"Play video → open extension","x":20,"y":100},{"id":"direct","label":"Direct file: Télécharger","x":330,"y":20,"link":"doc:downloads#direct-file"},{"id":"hls","label":"HLS: choose Qualité","x":330,"y":180,"link":"doc:hls-export#choose-quality"},{"id":"save","label":"Export: Enregistrer la vidéo","x":640,"y":180,"link":"doc:hls-export#save"}],"edges":[{"from":"detect","to":"direct"},{"from":"detect","to":"hls"},{"from":"hls","to":"save"}]}
```

The detection list belongs to the browser session. A full page navigation or closing the tab clears that tab's detections. The extension sends no telemetry. See [permissions and data](doc:reference#privacy) for what access is used.

## What can be saved? {#supported-media}

Direct files include MP4 and WebM. HLS export requires an unencrypted video on demand with combined audio/video tracks and whole media segments. Live streams, encrypted HLS, separate tracks and DASH export are outside this release's supported workflow. Detection alone does not establish that a stream can be saved.

The output retains the source's format and codecs; renaming a file does not convert it. See the [compatibility table](doc:reference#formats) and [version notes](doc:release-notes).
