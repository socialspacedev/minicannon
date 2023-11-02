---
_schema: default
title: Search
description: Search for content on this website
date: 2023-11-03T12:31:04+13:00
luogo: Posted
type: website
layout: page.njk
keyword: search
tags: pages
permalink: '{{ title | slugify }}.html'
eleventyNavigation:
  key: '{{ title | slugify }}'
  title: Search
  order: 5
---
## Search

<!-- Pagefind -->
<link href="/pagefind/pagefind-ui.css" rel="stylesheet">
<script src="/pagefind/pagefind-ui.js"></script>
<div id="search"></div>
<script>
    window.addEventListener('DOMContentLoaded', (event) => {
        new PagefindUI({ element: "#search", showSubResults: true });
    });
</script>