# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev        # Start dev server (Eleventy + Tailwind watch in parallel)
npm run go!        # Production build: clean → CSS → Eleventy
npm run clean      # Remove public/ output directory
npm run css        # Build Tailwind CSS once (minified)
npm run eleventy   # Run Eleventy build once
npm run discogs:sync   # Refresh src/_data/discogs*.yaml from Discogs (after new records)
npm run discogs:match  # Optional: link typed Vinyl Vibes tracks to the collection
```

Vinyl Vibes YouTube IDs are looked up at build time (`discogsYoutube` filter, `scripts/discogs-videos.mjs`) — see README "Discogs sync for Vinyl Vibes".

No test suite exists in this project.

## Architecture

**Minicannon** is a personal blog/portfolio at anaru.nz built with [Eleventy](https://www.11ty.dev/) (SSG) + Tailwind CSS, managed via CloudCannon CMS.

### Data flow

- `src/blog/*.md` + `src/pages/*.md` → Eleventy processes frontmatter + Liquid templates → `public/`
- `src/_css/site.css` → Tailwind → `public/css/style.css`
- `src/_data/meta.yaml` → global site metadata (title, author, social links) available in all templates

### Key directories

| Path | Purpose |
|------|---------|
| `src/_layouts/` | Page-level Liquid templates (`home`, `article`, `blog`, `page`, `search`) |
| `src/_includes/` | Reusable components (`nav`, `footer`, `head`) |
| `src/_data/` | Global data (YAML) |
| `src/_generate/` | Auto-generated outputs: RSS feed, sitemap, robots.txt |
| `.cloudcannon/schemas/` | Editor schemas for CloudCannon CMS fields |
| `public/` | Built output — never edit directly |

### Configuration

- **`eleventy.config.mjs`** — Main config (ESM): plugins (navigation, RSS, YouTube embeds, image optimization, time-to-read, Pagefind search), image processing pipeline (AVIF/WebP/JPEG at multiple widths), draft filtering in production, custom Liquid filters
- **`cloudcannon.config.yml`** — CMS collections (`posts`, `pages`, `data`), input types, editorial tools; timezone is Pacific/Auckland
- **Tailwind v4 (CSS-first, no `tailwind.config.js`)** — theme lives in the `@theme` block at the top of `src/_css/site.css`: breakpoints all in px (`sm: 430px`, `md: 768px`, `lg: 1024px`, `xl: 1280px`, `2xl: 1600px` — never mix in rem, v4 sorts by value), v3 rem line heights, Roboto Serif, and v3 hex values pinned for the slate/gray/zinc/sky families. Typography via `@plugin`. Dark mode via `prefers-color-scheme` (v4 default). Built with `@tailwindcss/cli`. Note: CSS outside `@layer` beats all Tailwind utilities in v4
- **`jampack.config.js`** — Post-build asset optimization: HTML minification, CSS inlining, image compression (WebP/PNG/JPEG), JS minification via esbuild

### Content authoring

Blog posts live in `src/blog/` as Markdown with YAML frontmatter. Set `draft: true` to exclude from production builds. Tags drive navigation and filtering. The `title`, `description`, and `date` fields are required by CloudCannon schemas.
