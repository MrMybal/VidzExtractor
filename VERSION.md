# Vidz Extracteur version notes

[Back to README](README.md) · [Français](VERSION.fr.md)

## Version 1.2.0

- Add a Firefox edition alongside the Chrome extension.
- Save HLS videos in Firefox through its download manager after assembling the original segments in temporary browser storage.
- Build the Chrome ZIP and Firefox XPI from the shared source.

[Release notes and downloads](https://github.com/MrMybal/VidzExtractor/releases/tag/v1.2.0)

## Version 1.1.0

- Group HLS playlists and their variants into a single video card.
- Display a preview, duration, resolution and file size when the information is available. Estimated sizes use the `≈` symbol.
- Select a quality offered by the HLS stream and export that variant.
- Edit the suggested filename before downloading.

[Release notes and download](https://github.com/MrMybal/VidzExtractor/releases/tag/v1.1.0)

## Known limitations

- HLS export supports unencrypted, on-demand playlists with combined tracks and media segments available as complete files.
- File output follows the media source. HLS exports are MPEG-TS or fragmented MP4.
- Preview, duration and size availability depend on the player and the server. Some servers provide data that can only be used to estimate file size.
- The extension can detect DASH manifests. Video export is available for direct files and compatible HLS streams.
- Firefox needs enough temporary browser storage for the assembled HLS video. The unsigned Firefox XPI is available through temporary installation.

[Current reports and bug tracker](https://github.com/MrMybal/VidzExtractor/issues)
