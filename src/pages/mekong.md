---
_schema: default
title: mekong
description: Real-time visuals for projecting behind live guitar over drones.
  Free and open source, for macOS.
type: website
layout: page.liquid
keyword: mekong
tags: pages
permalink: '{{ title | slugify }}.html'
eleventyNavigation:
  key: mekong
  title: mekong
  order: 2
  parent: apps
thumbnail: /img/mekong-icon.png
heading: true
icon: /img/mekong-icon.png
software_app:
  operating_system: macOS 14 or later
  category: MultimediaApplication
  download_url: https://github.com/socialspacedev/mekong/releases/latest
  source_url: https://github.com/socialspacedev/mekong
  screenshot: /img/mekong-barcode.png
---
mekong makes real-time visuals for projecting behind improvised guitar, noise, and drones. They're abstract and data-driven, kinda based originally on Ryoji Ikeda. It's free, and the source is on [GitHub](https://github.com/socialspacedev/mekong).

Plug in your instrument and put the visuals on a projector. They follow what you play: the drone shapes them slowly, and each picked note sets something off.

{% screenshot "/img/mekong-barcode.png" "The Barcode scene: strata of black and white data lines of varying widths." "Barcode. Attacks re-scramble the code." %}

## What it does

* **Six scenes** built in, from monochrome data lines to coloured ribbons of light. Switch with the number keys, or let mekong move on by itself
* **Your own scenes** from pictures or Metal shader files, which load live
* **Any audio input**, including one channel of a multi-channel interface, plus a test signal for trying it without an instrument
* **One key to present** on the projector, one to stop and one to black out. If the projector drops out, the visuals come back when it does

{% screenshot "/img/mekong-ribbons.png" "The Ribbons scene: vertical ribbons of coloured light in orange, blue, pink and teal on black." "Ribbons. Attacks send a surge through." %}

## Install

mekong needs **macOS 14 (Sonoma) or newer**. It asks for microphone access the first time; audio is analysed live and never recorded.

### Build it yourself (recommended)

Paste this into Terminal:

```bash
git clone https://github.com/socialspacedev/mekong.git
cd mekong
./install.sh
```

It needs the Xcode Command Line Tools; the script tells you how to get them if they're missing. Built this way, mekong opens without any warnings.

### Download the app

Get the DMG from [the latest release](https://github.com/socialspacedev/mekong/releases/latest) and drag mekong to Applications.

It isn't notarised by Apple, so macOS refuses it the first time. Open **System Settings ▸ Privacy & Security**, scroll down and click **Open Anyway** next to mekong. You only need to do this once.

## Give it a crack

If you play over drones and want something on the wall behind you, give it a crack. It comes with no guarantees.

Found a problem? Add it to [Issues on GitHub](https://github.com/socialspacedev/mekong/issues).