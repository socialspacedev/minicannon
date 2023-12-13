---
_schema: default
title: Search
description: Search for content on this website
date: 2023-11-03T12:31:04+13:00
luogo: Posted
type: website
layout: search.liquid
keyword: search
tags: pages
permalink: '{{ title | slugify }}.html'
eleventyNavigation:
  key: '{{ title | slugify }}'
  title: Search
  order: 5
---
# Search

This search page uses CloudCannon's opensource static search solution <a target="_blank" rel="noopener" href="https://pagefind.app/">PageFind</a>. It currently indexes pages and blog posts only.