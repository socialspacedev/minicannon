---
_schema: default
title: Crocus
description: A minimal, reliable DJ deck for radio that's free and open source.
type: website
layout: page.liquid
keyword: crocus
tags: pages
permalink: '{{ title | slugify }}.html'
eleventyNavigation:
  key: '{{ title | slugify }}'
  title: Crocus
  order: 4
software_app:
  operating_system: macOS 14 or later
  category: MultimediaApplication
  download_url: https://github.com/socialspacedev/crocus/releases/latest
  source_url: https://github.com/socialspacedev/crocus
  screenshot: /img/crocus-on-air.png
---
Crocus is a minimal DJ deck for radio, for macOS. I built it to run [Certain Sound](/tags/certain-sound/) on Otago Access Radio, and it's now set up so anyone can use it for their own show. It's free, and the source is on [GitHub](https://github.com/socialspacedev/crocus).

It's designed to be a much better alternative to a clunky streaming app or a complex DJ app. No browsing, no clutter, no network mid-show. Just local audio files, played cleanly.

{% screenshot "/img/crocus-on-air.png" "The Crocus console on air: now playing with artwork and a 7:07 countdown, the song's waveform, the library, and a rundown of song groups above the transport controls." "On air. The countdown shows exactly when the music will stop." %}

## How it works

Crocus plays short **groups** of two or three songs. They crossfade into each other and then the music stops, which is your cue to back-announce. You build a rundown of groups for the episode, then trigger them one at a time.

A big countdown shows exactly when the music will stop, and turns red for the last ten seconds.

It plays files from your Mac: **MP3, AAC/M4A (including Apple Lossless), WAV, AIFF, FLAC and CAF**. Drop in single songs or whole folders.

## What else it does

* **Fade to Talk** ducks the music to a bed level and holds it there while you talk
* **Fade Out** (the O key) takes a song out early when it runs long
* **Loudness matching** across the whole show, plus an output fader with the level meter built into the fader itself
* **A waveform with trim markers**, so you can drag to cut a long intro or outro
* **A second screen** a co-host can open on their phone
* **Exports**: a running order for the station, detailed notes, and a Markdown episode page from a template you control (the Certain Sound posts on this site are made this way)
* **Keeps the display awake** for the whole show, including while you're back-announcing

{% screenshot "/img/crocus-talk.png" "Crocus with music ducked: the status reads 'Talk, music ducked', the countdown is labelled 'Bed ends in', and the Fade to Talk button has become 'Music Up'." "Fade to Talk. The music drops to a bed under your voice until you bring it back up." %}

## Install

Crocus needs **macOS 14 (Sonoma) or newer**. It's a native Mac app, so there's no Windows or Linux version.

It's free, and there's no paid Apple Developer certificate behind it, so it isn't signed or notarised by Apple. That makes building it yourself the easier way in.

### Build it yourself (recommended)

Paste this into Terminal:

```bash
git clone https://github.com/socialspacedev/crocus.git
cd crocus
./install.sh
```

It needs the Xcode Command Line Tools, a free Apple download. If they're missing, the script tells you how to get them. It takes a minute or two and installs Crocus to your Applications folder.

Why this is the easy option: macOS only quarantines software that's downloaded through a browser. An app compiled on your own Mac isn't quarantined, so it opens with a double-click and no warnings.

To update later, run `git pull` and then `./install.sh` again in the same folder. Your library, shows and settings aren't touched.

### Download the app

Get the DMG from [the latest release](https://github.com/socialspacedev/crocus/releases/latest) and drag Crocus to Applications.

Because it's a download and isn't notarised, macOS refuses it the first time with "Apple could not verify Crocus is free of malware". To allow it (you only need to do this once):

1. Try to open Crocus, and let it be refused
2. Open **System Settings ▸ Privacy & Security**
3. Scroll to the bottom and click **Open Anyway** next to Crocus
4. Authenticate, then confirm

It opens normally from then on.

## Where the name comes from

Crocus is named after the song of the same name by the [Victor Dimisich Band](https://thebigcity.co.nz/artists/v/victor-dimisich-band/). The most recent version is on [An Afternoon With Victor Dimisich](/blog/an-afternoon-with-victor-dimisich.html), the collection of 1981 demos that Siltbreeze released this year.

{% bandcamp "https://siltbreeze.bandcamp.com/track/crocus" %}

## Give it a crack

If you like community radio and good music, give it a crack. I made Crocus for my own radio show and thought others might be interested too, so it comes with no guarantees.

If you find any problems, add them to [Issues on GitHub](https://github.com/socialspacedev/crocus/issues).