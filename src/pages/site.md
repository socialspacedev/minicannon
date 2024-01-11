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

I'm using this small website to better understand the full potential of the <a href="https://cloudcannon.com" target="_blank" rel="noopener">CloudCannon</a> Git-based CMS. Since I work there it's sensible thing to do and it's fun! The site is built using the speedy <a href="https://www.11ty.dev/" target="_blank" rel="noopener">11ty</a> static site generator (SSG) based on an elegant <a href="https://github.com/MarcoMicale/Minimalism" target="_blank" rel="noopener">minimalism</a> theme by <a href="https://github.com/MarcoMicale" target="_blank" rel="noopener">Marco Micale</a>. It has been reconfigured for CloudCannon with visual editing and other useful capabilities.

The aim of the site is to be minimal, elegant and performant. I'm not a developer as such but it's primarily built through the CloudCannon UI with local dev used when required. If you're interested, here's the <a href="https://github.com/socialspacedev/minicannon" target="_blank" rel="noopener">repo</a>.

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

## Tech

* <a href="https://cloudcannon.com/" title="CloudCannon git-bases CMS" target="_blank" rel="noopener">CloudCannon</a>

  * <a href="https://github.com/CloudCannon/pagefind" target="_blank" rel="noopener">Pagefind</a>

  * <a href="https://github.com/CloudCannon/bookshop" target="_blank" rel="noopener">Bookshop</a>

* <a href="https://github.com/11ty/eleventy" target="_blank" rel="noopener">Eleventy</a>

  * <a href="https://github.com/11ty/eleventy-img" target="_blank" rel="noopener">eleventy-img</a>

  * <a href="https://github.com/11ty/eleventy-plugin-rss" target="_blank" rel="noopener">eleventy-plugin-rss</a>

  * <a href="https://github.com/11ty/eleventy-navigation" target="_blank" rel="noopener">eleventy-navigation</a>

  * <a href="https://github.com/JKC-Codes/eleventy-plugin-time-to-read" target="_blank" rel="noopener">eleventy-plugin-time-to-read</a>

* <a href="https://github.com/tailwindlabs/tailwindcss" target="_blank" rel="noopener">Tailwindcss</a>

  * <a href="https://github.com/tailwindlabs/tailwindcss-typography" target="_blank" rel="noopener">Tailwindcss typography</a>
* <a href="https://github.com/moment/luxon" target="_blank" rel="noopener">Luxon</a>

* <a href="https://github.com/kangax/html-minifier" target="_blank" rel="noopener">html minifier</a>

* <a href="https://github.com/mysticatea/npm-run-all" target="_blank" rel="noopener">npm-run-all</a>

* <a href="https://github.com/isaacs/rimraf" target="_blank" rel="noopener">rimraf</a>

* <a href="https://github.com/tabler/tabler-icons" target="_blank" rel="noopener">Tabler Icon</a>

## Some challenges

Adapting this template as been difficult at times and a real learning experience. Consequently I've been able to learn how powerful CloudCannon, Git and 11ty are.

Here's some hurdles I've had to overcome:

* Converting NJKs template files to Liquid in order to use live editing on CloudCannon.

* Stripping out all PWA related code.

* Getting a yaml data file to work in place of the JS file.

* Implementing 11ty image optimisation.

* Getting the original template to build using the CloudCannon native 11ty compiler.

* Translating Italian comments and variables.

##

 <br>