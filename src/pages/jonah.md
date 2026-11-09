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

Jonah is a small Mac app for managing the music on a classic iPod, made with the 3rd-generation touch-wheel model in mind. Plug the iPod in, and Jonah copies the songs you choose off it, with proper names in tidy folders. It can also play songs, add and delete them, clear out duplicates and edit playlists, all without iTunes. It's free, and the source is on [GitHub](https://github.com/socialspacedev/jonah).

## Why

Old iPods don't store songs the way you'd expect. Every track sits in a hidden folder under a random four-letter name like `KXQZ.mp3`. The titles, artists and albums live separately, in a database that modern macOS no longer reads. Finder shows you a pile of gibberish files, and there's no built-in way to copy songs off the iPod.

Jonah reads that database directly, so you see your library as it was and can pick out the songs you want. It also writes the database the way the iPod expects, so it can manage your music now that iTunes can't.

## What it does

* **Finds the iPod by itself** when it's plugged in, and lists your whole library: title, artist, album, track number, length and format, sortable and searchable
* **Plays songs** straight off the iPod, so you can hear one before deciding to keep it
* **Tick what you want**, one at a time or a run at once with Shift-click
* **Exports neatly** into `Artist / Album / 03 Title.mp3`, or all in one folder, and never overwrites anything. It remembers what you've already exported, so you can carry on where you left off
* **Adds songs** by drag and drop. MP3, AAC, WAV, AIFF and Apple Lossless go on as they are. Anything else macOS can read (FLAC, for example) is converted to 256 kbps AAC, keeping its tags
* **Deletes songs** from the iPod and every playlist
* **Finds duplicates**: the same artist and title at about the same length, with one click to tick every copy except the best one
* **Edits playlists**: make new ones, drag songs in, drag them into order, rename and delete. Smart playlists from iTunes are shown, but their songs can't be changed
* **Keeps the iPod mounted.** Modern macOS tends to eject old iPods seconds after they appear. While Jonah is open, it stops that

## Changing the iPod safely

Get the iPod's song database wrong and it shows no music, so Jonah is careful:

* It only edits a database it can re-save exactly, byte for byte. If it can't, editing is switched off and exporting still works
* It backs up the song list before every change, and can put a backup back
* It writes the new database beside the old one, checks it, then swaps it in, so a failure partway through leaves the iPod as it was

Deleting is permanent for the song files themselves, so export anything you want to keep first.

## Which iPods

| iPod | Export and play | Add, delete, playlists |
|---|---|---|
| 1st–5th generation | ✓ | ✓ |
| mini, nano 1st and 2nd generation | ✓ | Should work, untested |
| classic (2007 on), nano 3rd generation on | ✓ | ✗ |
| shuffle | ✓ | ✗ |
| touch, iPhone | ✗ | ✗ |

The iPod classic and later nanos lock their database with a signature only iTunes can make, so Jonah won't change them. It's been tested on a 3rd-generation 15 GB iPod.

**Getting an old iPod to show up:** it needs to appear in Finder like any other drive. If it doesn't, put it in disk mode: hold **Menu + Play/Pause** until the Apple logo shows, then straight away hold **Previous + Next** until "Do not disconnect" appears. The 1st to 3rd generations charge over FireWire, so let a flat one charge for a while first.

## Install

Jonah needs **macOS 14 (Sonoma) or newer**, on an Apple silicon or Intel Mac.

It's free, and there's no paid Apple Developer certificate behind it, so it isn't notarised by Apple. That makes building it yourself the easier way in.

### Build it yourself (recommended)

Paste this into Terminal:

```bash
git clone https://github.com/socialspacedev/jonah.git
cd jonah
./install.sh
```

It needs the Xcode Command Line Tools, a free Apple download. If they're missing, the script tells you how to get them. It takes a minute or two and installs Jonah to your Applications folder.

An app compiled on your own Mac isn't quarantined, so it opens with a double-click and no warnings. To update later, run `git pull` and then `./install.sh` again in the same folder.

### Download the app

Get the zip from [the latest release](https://github.com/socialspacedev/jonah/releases/latest), unzip it and drag Jonah to Applications.

Because it's a download and isn't notarised, macOS refuses it the first time. To allow it (you only need to do this once):

1. Try to open Jonah, and let it be refused
2. Open **System Settings ▸ Privacy & Security**
3. Scroll to the bottom and click **Open Anyway** next to Jonah
4. Authenticate, then confirm

It opens normally from then on.

## Give it a crack

If you've got an old iPod in a drawer with music on it you can't get at, give it a crack. Jonah comes with no guarantees, so export what matters before you delete anything.

If you find any problems, add them to [Issues on GitHub](https://github.com/socialspacedev/jonah/issues). The name comes from a Victor Dimisich Band song, like all [my apps](/apps.html).
