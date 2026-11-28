---
id: installation
title: Install or update
description: Load the Chrome ZIP or the unsigned Firefox XPI and refresh existing video tabs.
section: Start here
parent: overview
order: 10
previous: overview
next: quickstart
revision: 2
---
Choose the edition for your desktop browser. No companion app or third-party runtime library is required. The downloads below are for Vidz Extracteur **1.2.0**.

## Chrome {#chrome}

```steps
{"items":[{"title":"Extract the download","body":"[Download the Chrome ZIP](https://github.com/MrMybal/VidzExtractor/releases/download/v1.2.0/VidzExtractor-Chrome-1.2.0.zip) and extract it to a folder you will keep.","result":"The extracted folder contains manifest.json."},{"title":"Load the extension","body":"Open `chrome://extensions` in the address bar. Turn on **Developer mode**, choose **Load unpacked**, and select the folder containing manifest.json.","result":"The Vidz Extracteur card appears in the extensions list.","troubleshooting":"Select the extracted folder itself, rather than the ZIP or its parent folder."},{"title":"Pin and refresh","body":"Pin **Vidz Extracteur** using Chrome's extensions menu. Reload any video page that was open during installation, then start playback.","result":"The extension opens from the toolbar and can inspect the video tab."}]}
```

To update an unpacked installation, replace its files with the new extracted edition, click **Reload** on its card in `chrome://extensions`, and reload the video page. Keep the installation folder in place while using the extension.

## Firefox 140 or later {#firefox}

```steps
{"items":[{"title":"Get the Firefox edition","body":"[Download the Firefox XPI](https://github.com/MrMybal/VidzExtractor/releases/download/v1.2.0/VidzExtractor-Firefox-1.2.0.xpi).","result":"The XPI is saved locally."},{"title":"Load it temporarily","body":"Open `about:debugging#/runtime/this-firefox`. Choose **Load Temporary Add-on…** and select the XPI.","result":"Vidz Extracteur appears among temporary extensions.","troubleshooting":"If the picker requires a manifest, extract the XPI as a ZIP and select manifest.json in the extracted folder."},{"title":"Open a video tab","body":"Reload an existing video page, start playback, then open Vidz Extracteur from the extensions menu.","result":"The current tab's detected videos appear in the popup."}]}
```

```callout
{"type":"note","title":"Temporary installation","body":"The XPI is unsigned. Firefox removes a temporary add-on when it restarts; load it again for the next session. Permanent installation on Firefox Release requires a Mozilla signature."}
```

To update the temporary edition, remove it from `about:debugging`, load the replacement XPI and reload the video page. Firefox uses its normal download location preferences; HLS also needs temporary browser storage.

## Open the manual {#help}

In a source checkout or a newly built package containing this manual, **Aide** opens the relevant topic from the popup or HLS export tab. You can also open **Documentation/Documentation.html** directly from the extracted folder. Keep the complete **Documentation** folder together to retain images, diagrams, search and both languages offline.

The refreshed 1.2.0 Chrome and Firefox packages include this manual and the **Aide** links. If your copy has no help link, download the package again and [update the extension](doc:installation) using the instructions for your browser. The [separate documentation ZIP](https://github.com/MrMybal/VidzExtractor/releases/download/v1.2.0/VidzExtractor-Documentation-1.2.0.zip) contains the same manual; extract it and open **Documentation/Documentation.html**.
