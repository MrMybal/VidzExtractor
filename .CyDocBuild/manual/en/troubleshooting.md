---
id: troubleshooting
title: Resolve a problem
description: Start from an empty list, an export message or an unreadable file and find the next check.
section: Help and reference
order: 50
previous: hls-export
next: reference
revision: 1
---
## No video is detected {#no-video}

**Symptom:** an empty list, or detection fails. Check that the active tab is a normal HTTP or HTTPS video page; browser settings pages and local files are outside detection. Start playback, reopen the extension and click **Actualiser**. If the page was open when you installed or reloaded the extension, reload that page and start the video again.

**Success:** a video card appears. Navigating to a new page or closing the original tab clears its detection list. Some players do not expose a usable source; a visible player does not guarantee a downloadable video.

## Preview, duration or size is missing {#missing-details}

Check whether a card and **Télécharger** remain available. The player and server determine which details can be read. **Aperçu indisponible** and **Taille inconnue** describe missing metadata; `≈` denotes an estimate. Try saving a supported stream and confirm the result through the browser or export tab. See [card details](doc:downloads#read-card).

## Match an export message {#export-errors}

| Message in the extension | Check and next action | Success or limit |
| --- | --- | --- |
| **Rouvre le flux depuis le menu de Vidz Extracteur.** | Open a new export from the video's card; avoid reloading or bookmarking the old export tab. | The new tab reads the playlist and becomes ready. |
| **Ce flux HLS est chiffré.** | This stream uses encryption. | Encrypted HLS export is unsupported. |
| **L’export HLS est réservé aux vidéos à la demande.** | Check whether the stream is live or lacks a completed playlist. | Only a compatible completed video on demand can be exported. |
| **Piste audio séparée**, **Piste vidéo séparée** or no integrated tracks | Try another available quality with combined tracks. | If no compatible variant exists, this stream is unsupported. |
| **Cette structure de flux HLS n’est pas prise en charge.** | Read the [HLS limits](doc:reference#hls-limits). | Renaming or repeated retries cannot change an unsupported structure. |
| Server timeout, HTTP error, incomplete response or inaccessible server | Confirm playback still works on the original page. Reload it if needed, then detect again and open a fresh export. | A new export becomes ready and its segments progress. The server may still refuse access. |
| **L’espace de stockage temporaire est insuffisant.** | Free storage and retry, or choose a smaller available quality. Firefox needs temporary space in addition to the final destination. | Assembly finishes, followed by the browser save. |
| **Le navigateur a refusé l’accès au stockage vidéo.** | Review the browser's storage restrictions and use the supported browser edition. | The browser permits the temporary write. |
| **Ce navigateur ne permet pas d’enregistrer un export HLS.** | Use the documented browser edition; check [installation](doc:installation). | The export's save control becomes available on a supported browser. |
| **Enregistrement annulé.** or interrupted download | Restart intentionally from the card after checking the destination and browser downloads. | The new save reaches its completion message. |

## Find the right check {#diagnostic-map}

Select a node for its explanation and a link to the relevant section. The graph starts in reading mode so the page still scrolls normally. **Explore graph** enables pan and zoom; Escape leaves exploration. Its text view lists the same checks and connections without requiring canvas navigation.

```graph
{"id":"diagnostic-map","title":"From symptom to next action","controls":"minimal","nodes":[{"id":"symptom","title":"Where does it fail?","description":"Choose detection, export or file playback to narrow the check.","x":0,"y":150,"outputs":[{"id":"detect","label":"No card","type":"exec"},{"id":"export","label":"Save fails","type":"exec"},{"id":"file","label":"File exists","type":"exec"}]},{"id":"detect","title":"Check the video tab","description":"Use an HTTP/HTTPS page, start playback and refresh detection.","x":340,"y":0,"inputs":[{"id":"in","label":"Empty list","type":"exec"}],"outputs":[{"id":"next","label":"Then retry","type":"exec"}],"link":"doc:troubleshooting#no-video"},{"id":"export","title":"Read the export message","description":"Separate unsupported streams from server and storage errors.","x":340,"y":200,"inputs":[{"id":"in","label":"Export error","type":"exec"}],"outputs":[{"id":"next","label":"Check format","type":"exec"}],"link":"doc:troubleshooting#export-errors"},{"id":"file","title":"Check format and playback","description":"Confirm the save finished and use a player compatible with the source codecs.","x":340,"y":400,"inputs":[{"id":"in","label":"Saved file","type":"exec"}],"link":"doc:troubleshooting#playback"},{"id":"support","title":"Confirm supported media","description":"Direct files and compatible unencrypted HLS videos on demand are supported.","x":680,"y":100,"inputs":[{"id":"retry","label":"Fresh detection","type":"exec"},{"id":"format","label":"Stream structure","type":"exec"}],"link":"doc:reference#formats"}],"links":[{"from":["symptom","detect"],"to":["detect","in"]},{"from":["symptom","export"],"to":["export","in"]},{"from":["symptom","file"],"to":["file","in"]},{"from":["detect","next"],"to":["support","retry"]},{"from":["export","next"],"to":["support","format"]}]}
```

## The file will not play {#playback}

First confirm the browser download completed or the HLS tab displayed **Vidéo enregistrée sous…**. Then check the actual format: an HLS output can be MPEG-TS or fragmented MP4. Use a player that supports that container and the original codecs. Changing the filename extension does not convert the video or combine separate audio tracks. If the file is incomplete, retry from a fresh detection and wait for final completion.

## Firefox removed the extension {#firefox-restart}

An unsigned temporary add-on is removed when Firefox restarts. [Load it again](doc:installation#firefox), then reload your video page. This is the installation mode described for this release.

## Report a repeatable problem {#report}

[Open an issue](https://github.com/MrMybal/VidzExtractor/issues) with your browser/version, extension version, the steps you followed, the exact message and whether the source is a direct file or HLS. Share a public reproducible page when possible; omit private video links and session information.
