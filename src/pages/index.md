---
_schema: default
title: Index
description: A minimal CloudCannon and 11ty website by and about Andrew Long.
type: website
layout: page.liquid
keyword: index
tags: pages
permalink: '{{ title | slugify }}.html'
eleventyNavigation:
  key: '{{ title | slugify }}'
  title: About
  order: 2
  hide: true
---
# Nau mai, Haere mai!

Welcome to my website. To find out a little more about me, head to the [about page](/about.html). For other random content, check out the [blog posts](/pages/blog/ "Index page for all blog posts."). And finally, for the tech behind this site, check out this [page](/site.html "Details about the tech used to build this website.").

> He iti kahurangi.


{% assign mostRecent = collections.posts | first %}
<div class="most-recent-post">
  <h3>Most Recent Post: <a href="{{ mostRecent.url }}">{{ mostRecent.data.title }}</a></h3>
  <p>{{ mostRecent.data.date | date: "%B %d, %Y" }}</p>
</div>