---
id: reference
title: Formats, permissions and limits
description: Check supported media, output formats, session data and the application's license.
section: Help and reference
order: 60
previous: troubleshooting
next: release-notes
revision: 1
---
## Supported formats {#formats}

| Source | Detection and saving in 1.2.0 | Output |
| --- | --- | --- |
| Direct video, such as MP4 or WebM | Download through the browser when the source is accessible. | Original file format. |
| Compatible HLS video on demand | Choose an offered quality, then use the export tab. | MPEG-TS (`.ts`) or fragmented MP4 (`.mp4`), according to the segments. |
| DASH manifest | Can be detected; DASH video export is unavailable. | No DASH export. |
| Live or encrypted HLS; separate tracks | Unsupported for export. | No supported export workflow. |

The extension does not convert containers, transcode codecs or merge separate audio/video tracks. Playback support depends on the saved source and your player.

## HLS structure limits {#hls-limits}

The playlist must finish with `#EXT-X-ENDLIST`, be unencrypted, use combined tracks and expose whole media segments. Byte ranges, discontinuities, gaps, I-frame-only playlists and skipped-segment structures are rejected. Repeated initialization maps or initialization byte ranges are also unsupported. Nested variant playlists have a limited depth. A server must return complete accessible playlist and segment responses; a detected URL alone is insufficient.

## Permissions and data {#privacy}

| Access | Purpose |
| --- | --- |
| HTTP/HTTPS sites and media requests | Detect candidate video URLs in the current tab and access media for saving. |
| Page scripting | Inspect video players in the tab and accessible frames. |
| Navigation and session storage | Keep detections per tab and clear them on full navigation or tab closure; transfer an HLS export's launch information. |
| Downloads | Start direct downloads and save assembled HLS files through the browser when needed. |

The extension sends no telemetry. It contacts the media servers needed to inspect and save the chosen video. Firefox HLS assembly uses temporary browser storage; the temporary file is cleaned up after saving or cancellation. Interrupted leftovers can be cleaned up by a later export. Your completed download remains in the chosen destination.

## Terms used in this manual {#glossary}

- **Direct file:** a single media URL downloaded by the browser.
- **HLS playlist:** a list of media segments, sometimes with several quality variants.
- **Variant:** one available quality of an HLS stream.
- **Combined tracks:** audio and video carried together rather than separate streams to merge.
- **Container and codec:** the file's packaging and its audio/video encoding. Changing the name changes neither.

## License and project links {#license}

Vidz Extracteur is licensed under **GPL-3.0-only**. The repository includes the full [application license](https://github.com/MrMybal/VidzExtractor/blob/main/LICENSE). The offline reader uses CyDoc, licensed under MIT; its dependency notices are shipped with the documentation. CyDoc's license does not replace the application's license.

[Repository](https://github.com/MrMybal/VidzExtractor) · [Releases](https://github.com/MrMybal/VidzExtractor/releases) · [Issue tracker](https://github.com/MrMybal/VidzExtractor/issues)
