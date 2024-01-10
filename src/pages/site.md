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

This small website I'm using to better understand the full potential of <a href="https://cloudcannon.com" target="_blank" rel="noopener">CloudCannon</a>. It's built using the speedy <a href="https://www.11ty.dev/" target="_blank" rel="noopener">11ty</a> static site generator (SSG) based on this elegant <a href="https://github.com/MarcoMicale/Minimalism" target="_blank" rel="noopener">minimalism</a> theme. I've customised a bunch of things behind the scenes and plan to evolve this into a complete CloudCannon site optimised for visual editing.