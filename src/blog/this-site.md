---
_schema: default
title: Building this site
description: How and why I built this website using CloudCannon, Eleventy, and Tailwind CSS
tags:
  - post
date: 2022-11-01T00:00:00+13:00
published: true
type: article
layout: article.liquid
permalink: blog/{{ title | slugify }}.html
---
I built this site partly as a way to better understand [CloudCannon](https://cloudcannon.com), the Git-based content management system I was working at at the time. The site is built on [Eleventy](https://www.11ty.dev/) (11ty), a fast static site generator, using an elegant minimalist theme by [Marco Micale](https://github.com/MarcoMicale) as a starting point. The [repo is public](https://github.com/socialspacedev/minicannon) if you're curious.

I'm not a developer — most editing happens through the CloudCannon UI with local dev only when needed — but getting here has been a genuine learning experience. The site has grown considerably since this was first written.

## Features

* Light/dark mode
* Visual editing via CloudCannon
* 404 and offline pages
* Optimised SEO
* 100 Lighthouse scores
* Social media links
* RSS feed
* Sitemap
* Static search via Pagefind
* Optimised images
* Pagination
* Tags and filtered tag pages
* Photo gallery with lightbox

## Tech stack

* [CloudCannon](https://cloudcannon.com/) — CMS
  * [Pagefind](https://github.com/CloudCannon/pagefind) — static search
* [Eleventy](https://github.com/11ty/eleventy) — static site generator
  * [eleventy-img](https://github.com/11ty/eleventy-img) — image optimisation
  * [eleventy-plugin-rss](https://github.com/11ty/eleventy-plugin-rss) — RSS feed
  * [eleventy-navigation](https://github.com/11ty/eleventy-navigation) — site navigation
  * [eleventy-plugin-time-to-read](https://github.com/JKC-Codes/eleventy-plugin-time-to-read) — read time estimates
  * [eleventy-plugin-youtube-embed](https://github.com/gfscott/eleventy-plugin-youtube-embed) — YouTube embeds
* [Tailwind CSS](https://github.com/tailwindlabs/tailwindcss) — styling
  * [Tailwind Typography](https://github.com/tailwindlabs/tailwindcss-typography) — prose styles
* [PhotoSwipe](https://photoswipe.com/) — photo lightbox
* [Luxon](https://github.com/moment/luxon) — date formatting
* [Jampack](https://jampack.divriots.com/) — post-build optimisation
* [Tabler Icons](https://github.com/tabler/tabler-icons) — icons

## Updates

Since this post was first published, a few things have been added and removed:

**Added:**

* Custom film perforation effect on photos (CSS art direction)
* [PhotoSwipe](https://photoswipe.com/) lightbox with filmstrip navigation
* Tag system — post tags with filtered tag pages
* Photo gallery page drawing automatically from photography-tagged posts
* [`eleventy-plugin-time-to-read`](https://github.com/JKC-Codes/eleventy-plugin-time-to-read) — read time on each post
* [`eleventy-plugin-youtube-embed`](https://github.com/gfscott/eleventy-plugin-youtube-embed) — YouTube embeds
* [Jampack](https://jampack.divriots.com/) post-build optimisation

**Removed:**

* Google Fonts — replaced with a system font stack to eliminate layout shift
* Progressive Web App (PWA) functionality — stripped out as it added complexity without benefit

## Some challenges

Adapting the original template turned out harder than expected. Here's what I had to work through:

* Converting Nunjucks template files to Liquid for CloudCannon visual editing
* Stripping out all PWA-related code
* Getting a YAML data file working in place of the original JS data file
* Implementing image optimisation with `eleventy-img`
* Getting the template to build using CloudCannon's native 11ty compiler
* Translating Italian comments and variables
* Removing layout shift and performance hits from Google Fonts
