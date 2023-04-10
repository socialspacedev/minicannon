---
title: Chat
layout: page.njk
keyword: chat
tags: pages
permalink: '{{ title | slugify }}.html'
eleventyNavigation:
  key: '{{ title | slugify }}'
  title: Chat
  order: 9
---
# Let's test Help Scout chat!

This is an in-app chat widget by Help Scout.

<!-- Help Scout Beacon code -->

<script type="text/javascript">!function(e,t,n){function a(){var e=t.getElementsByTagName("script")[0],n=t.createElement("script");n.type="text/javascript",n.async=!0,n.src="https://beacon-v2.helpscout.net",e.parentNode.insertBefore(n,e)}if(e.Beacon=n=function(t,n,a){e.Beacon.readyQueue.push({method:t,options:n,data:a})},n.readyQueue=[],"complete"===t.readyState)return a();e.attachEvent?e.attachEvent("onload",a):e.addEventListener("load",a,!1)}(window,document,window.Beacon||function(){});</script>

<script type="text/javascript">window.Beacon('init', '6bcb8ae7-40e2-4285-9bd3-bb1c2558ece9')</script>