---
_schema: default
title: Jonah
description: Get your songs back out of an old iPod, and put new ones on. Free and open source, for macOS.
type: website
layout: page.liquid
keyword: jonah
tags: pages
permalink: '{{ title | slugify }}.html'
eleventyNavigation:
  key: jonah
  parent: apps
  title: Jonah
software_app:
  operating_system: macOS 14 or later
  category: MultimediaApplication
  download_url: https://github.com/socialspacedev/jonah/releases/latest
  source_url: https://github.com/socialspacedev/jonah
  screenshot: /img/jonah-icon.png
---
<img class="app-icon" src="/img/jonah-icon.png" alt="The Jonah app icon: a simplified amber 3rd-generation iPod" width="128" height="128">

Jonah gets your songs back out of an old iPod, and puts new ones on, without iTunes. It's free, and the source is on [GitHub](https://github.com/socialspacedev/jonah).

Old iPods hide your music under random file names, so you can't just copy it off in Finder. Jonah reads the iPod's own song list, so you see your library as it was.

## What it does

* **Exports** the songs you tick into tidy `Artist / Album` folders
* **Plays** songs straight off the iPod
* **Adds** songs by drag and drop, converting formats the iPod can't play
* **Deletes** songs, and finds duplicates
* **Edits playlists**

It backs up the iPod's song list before every change.

## Which iPods

| iPod | Export and play | Add, delete, playlists |
|---|---|---|
| 1st–5th generation (scroll wheel, touch wheel, click wheel, video) | ✓ | ✓ |
| mini, nano 1st and 2nd generation | ✓ | ✓ (should work, untested) |
| classic (6th/7th generation), nano 3rd generation and later | ✓ if `iTunesDB` is present | ✗ signed database |
| shuffle | ✓ (from the files' own tags) | ✗ |
| touch, iPhone | ✗ no disk mode | ✗ |

## Install

Jonah needs **macOS 14 (Sonoma) or newer**.

### Build it yourself (recommended)

Paste this into Terminal:

```bash
git clone https://github.com/socialspacedev/jonah.git
cd jonah
./install.sh
```

It needs the Xcode Command Line Tools; the script tells you how to get them if they're missing. Built this way, Jonah opens without any warnings.

### Download the app

Get the zip from [the latest release](https://github.com/socialspacedev/jonah/releases/latest), unzip it and drag Jonah to Applications.

It isn't notarised by Apple, so macOS refuses it the first time. Open **System Settings ▸ Privacy & Security**, scroll down and click **Open Anyway** next to Jonah. You only need to do this once.

## Give it a crack

If you've got an old iPod with music on it you can't get at, give it a crack. It comes with no guarantees, so export what matters before deleting anything.

Found a problem? Add it to [Issues on GitHub](https://github.com/socialspacedev/jonah/issues).
