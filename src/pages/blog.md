---
_schema: default
title: Blog
description: Index page of blog posts
date:
type: website
layout: blog.liquid
keyword: blog
tags: pages
pagination:
  data: collections.post
  alias: posts
  reverse: true
  permalink: "split/page-{{ pagination.pageNumber | plus: 1 }}/index.html"
eleventyNavigation:
  key: '{{ title | slugify }}'
  title: Blog
  order: 2
---
# Blog