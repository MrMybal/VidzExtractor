---
id: release-notes
title: Version notes
description: Changes in Vidz Extracteur 1.2.0 and 1.1.0, with release and issue links.
section: Help and reference
parent: reference
order: 70
previous: reference
next:
revision: 1
---
## Version 1.2.0 {#version-120}

- Adds a Firefox edition alongside the Chrome extension.
- Saves HLS videos in Firefox through its download manager after assembling the original segments in temporary browser storage.
- Builds the Chrome ZIP and Firefox XPI from the shared source.

[Release notes and downloads](https://github.com/MrMybal/VidzExtractor/releases/tag/v1.2.0)

## Version 1.1.0 {#version-110}

- Groups HLS playlists and their variants into a single video card.
- Displays a preview, duration, resolution and file size when available. Estimated sizes use `≈`.
- Selects an offered HLS quality and exports that variant.
- Edits the suggested filename before downloading.

[Release notes and download](https://github.com/MrMybal/VidzExtractor/releases/tag/v1.1.0)

## Known limitations {#known-limitations}

Read the [supported media and HLS limits](doc:reference#formats) before exporting. Firefox's unsigned XPI uses temporary installation and its HLS export needs temporary storage. Preview, duration and size availability depend on the player and server.

For a failure, use [troubleshooting](doc:troubleshooting). The repository's version notes do not provide a separate bug-by-bug list; consult [current reports](https://github.com/MrMybal/VidzExtractor/issues).
