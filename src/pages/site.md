---
_schema: default
title: Site
description: Tech used to build this website
date: 2024-01-11T11:37:02+13:00
luogo: Posted
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
# Website

I'm using this small website to better understand the full potential of <a href="https://cloudcannon.com" target="_blank" rel="noopener">CloudCannon</a>. It's built using the speedy <a href="https://www.11ty.dev/" target="_blank" rel="noopener">11ty</a> static site generator (SSG) based on this elegant <a href="https://github.com/MarcoMicale/Minimalism" target="_blank" rel="noopener">minimalism</a> theme. I've customised a bunch of things behind the scenes and plan to evolve this into a complete CloudCannon site optimised for visual editing.

The aim of the site is to be as minimal, elegant and as fast as possible. I'm not a developer as such but it's developed through the CloudCannon UI with local dev used when needed. Here's the <a href="https://github.com/socialspacedev/minicannon" target="_blank" rel="noopener">repo</a>.

Many thanks to <a href="https://github.com/MarcoMicale" target="_blank" rel="noopener">Marco Micale</a> for the original template.

## Features

* Light/dark mode

* Visual editing on CloudCannon

* 404 and offline pages

* Optimised SEO

* 100 Lighthouse scores (WIP!)

* Social media links

* RSS feed

* Sitemap

* Static search

## Tech

* CloudCannon

  * Pagefind

  * Bookshop

* [Eleventy](https://github.com/11ty/eleventy)

  * eleventy-img

  * [eleventy-plugin-rss](https://github.com/11ty/eleventy-plugin-rss)

  * [eleventy-navigation](https://github.com/11ty/eleventy-navigation)

  * eleventy-plugin-time-to-read

* [Tailwindcss](https://github.com/tailwindlabs/tailwindcss)

  * [Tailwindcss typography](https://github.com/tailwindlabs/tailwindcss-typography)

* [Luxon](https://github.com/moment/luxon)

* [html minifier](https://github.com/kangax/html-minifier)

* [npm-run-all](https://github.com/mysticatea/npm-run-all)

* [rimraf](https://github.com/isaacs/rimraf)

* [Tabler Icon](https://github.com/tabler/tabler-icons)

## A few challenges

* Converting NJKs template files to Liquid in order to use live editing on CloudCannon.

* Stripping out all PWA related code.

* Getting a yaml data file to work in place of the JS file.

* Implementing 11ty image optimisation.

* Getting the original template to build using the CloudCannon native 11ty service.

##

<br>