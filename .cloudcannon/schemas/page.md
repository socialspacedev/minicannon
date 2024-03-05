---
title: Add your catchy title
description: What is this page about?
date:
type: website
layout: page.liquid
keyword: about
tags: pages
permalink: '{{ title | slugify }}.html'
eleventyNavigation:
  key: '{{ title | slugify }}'
  title: About
  order: 2
content_blocks: 
---