---
_schema: default
title: Site
description: Tech used to build this website
date: 2024-01-11T11:37:02+13:00
type: website
layout: page.liquid
keyword: website
tags: pages
permalink: '{{ title | slugify }}.html'
eleventyNavigation:
  key: '{{ title | slugify }}'
  title: Site
  order: 3
---

I'm using this small website to better understand the full potential of the [CloudCannon](https://cloudcannon.com) Git-based content management system (CMS). Since I work there it's sensible thing to do and it's fun! The site is built using the speedy [11ty](https://www.11ty.dev/) static site generator (SSG) based on an elegant [minimalism](https://github.com/MarcoMicale/Minimalism) theme by [Marco Micale](https://github.com/MarcoMicale). It has been reconfigured for CloudCannon for visual editing and favours SSG chaining.

The aim of the site is to be minimal, elegant and performant. I'm not a developer as such but it's primarily built through the CloudCannon UI with local dev used when required. If you're interested, here's the [repo](https://github.com/socialspacedev/minicannon).

## Features

* Light/dark mode
* Visual editing
* 404 and offline pages
* Optimised SEO
* 100 Lighthouse scores (WIP!)
* Social media links
* RSS feed
* Sitemap
* Static search
* Optimised images
* Pagination
* Minified

## Tech

* [CloudCannon](https://cloudcannon.com/ "CloudCannon git-bases CMS")
  * [Pagefind](https://github.com/CloudCannon/pagefind)
* [Eleventy](https://github.com/11ty/eleventy)
  * [eleventy-img](https://github.com/11ty/eleventy-img)
  * [eleventy-plugin-rss](https://github.com/11ty/eleventy-plugin-rss)
  * [eleventy-navigation](https://github.com/11ty/eleventy-navigation)
  * [eleventy-plugin-time-to-read](https://github.com/JKC-Codes/eleventy-plugin-time-to-read)
  * [eleventy-plugin-youtube-embed](https://github.com/gfscott/eleventy-plugin-youtube-embed "Visit youtube plugin repo")
* [Tailwindcss](https://github.com/tailwindlabs/tailwindcss)
  * [Tailwindcss typography](https://github.com/tailwindlabs/tailwindcss-typography)
* [Luxon](https://github.com/moment/luxon)
* [html minifier](https://github.com/kangax/html-minifier)
* [npm-run-all](https://github.com/mysticatea/npm-run-all)
* [rimraf](https://github.com/isaacs/rimraf)
* [Tabler Icon](https://github.com/tabler/tabler-icons)
* [Jampack](https://jampack.divriots.com/ "Visit the website for Jampack.")

## Some challenges

Adapting this template as been difficult at times and a real learning experience. Consequently I've been able to learn how powerful CloudCannon, Git and 11ty are.

Here's some hurdles I've had to overcome:

* Converting NJKs template files to Liquid in order to use live editing on CloudCannon.
* Stripping out all PWA related code.
* Getting a yaml data file to work in place of the JS file.
* Implementing image optimisation.
* Getting the original template to build using the CloudCannon native 11ty compiler.
* Translating Italian comments and variables.
* Removing CLS and performance hits due to Google fonts.
