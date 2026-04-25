# anaru.nz

Personal blog and photography portfolio at [anaru.nz](https://anaru.nz), built with Eleventy and Tailwind CSS, managed via CloudCannon CMS. Started from the [Minimalism](https://github.com/MarcoMicale/Minimalism) theme by [Marco Micale](https://github.com/MarcoMicale).

## Tech stack

- **[CloudCannon](https://cloudcannon.com/)** — Git-based CMS and hosting
  - **[Pagefind](https://pagefind.app/)** — static search
- **[Eleventy](https://www.11ty.dev/)** — static site generator
  - [eleventy-img](https://github.com/11ty/eleventy-img) — image optimisation (AVIF, WebP, JPEG at multiple widths)
  - [eleventy-plugin-rss](https://github.com/11ty/eleventy-plugin-rss) — RSS feed
  - [eleventy-navigation](https://github.com/11ty/eleventy-navigation) — site navigation
  - [eleventy-plugin-time-to-read](https://github.com/JKC-Codes/eleventy-plugin-time-to-read) — read time estimates
  - [eleventy-plugin-youtube-embed](https://github.com/gfscott/eleventy-plugin-youtube-embed) — YouTube embeds
- **[Tailwind CSS](https://tailwindcss.com/)** — styling
  - [@tailwindcss/typography](https://tailwindcss.com/docs/typography-plugin) — prose styles
- **[PhotoSwipe](https://photoswipe.com/)** — photo lightbox with filmstrip
- **[Jampack](https://jampack.divriots.com/)** — post-build asset optimisation
- **[Luxon](https://moment.github.io/luxon/)** — date formatting

## Features

- Light/dark mode
- Visual editing via CloudCannon
- Film photography gallery with EXIF data tooltip and lightbox
  - Keyboard accessible (Tab to image, Enter/Space to open)
  - EXIF data (camera, lens, film, ISO) stored in YAML data files and editable via CloudCannon
- Two-column homepage: latest photography hero image + recent posts list
- Static search via Pagefind (lazy-loaded dialog modal)
- RSS feed, XML sitemap, and `llms.txt` for AEO
- Structured data (BlogPosting JSON-LD) and Open Graph tags
- Optimised images served in AVIF/WebP
- Pagination and tag-filtered post pages
- 404 and offline pages
- WCAG 2.1 AA accessibility: skip-to-content link, ARIA landmarks, keyboard navigation throughout

## Local development

```bash
npm install
npm run dev        # Eleventy + Tailwind watch in parallel
```

```bash
npm run go!        # Production build: clean → CSS → Eleventy
npm run clean      # Remove public/ output
npm run css        # Tailwind CSS build (minified)
npm run eleventy   # Eleventy build only
```

The `public/` directory is git-ignored — it is the built output. Pagefind search only works on the deployed site (CloudCannon runs it as a post-build step).

## Content

Blog posts live in `src/blog/` as Markdown with YAML frontmatter. Photography posts tagged `photography` are automatically included in the photo gallery.

## Deployment

Pushes to `main` trigger a CloudCannon build automatically.
