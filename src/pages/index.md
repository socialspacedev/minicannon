---
_schema: default
title: Index
description: A minimal and performant website built using CloudCannon and 11ty.
date: 2022-10-01T00:00:00+13:00
type: website
layout: home.liquid
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

Welcome to my website. To find out a little more about me, head to the [about page](/about.html). For random content, check out the [blog posts](/pages/blog/ "Index page for all blog posts.")&nbsp;or to see the tech behind this site, head [here](/site.html "Tech used to build this static site").