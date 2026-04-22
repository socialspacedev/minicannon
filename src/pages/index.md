---
_schema: default
title: 'Website called '
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

Welcome to my website where you'll find more about me and my interests.