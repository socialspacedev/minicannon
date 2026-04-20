# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev        # Start dev server (Eleventy + Tailwind watch in parallel)
npm run go!        # Production build: clean → CSS → Eleventy
npm run clean      # Remove public/ output directory
npm run css        # Build Tailwind CSS once (minified)
npm run eleventy   # Run Eleventy build once
```

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

- **`.eleventy.js`** — Main config: plugins (navigation, RSS, YouTube embeds, image optimization, time-to-read, Pagefind search), image processing pipeline (AVIF/WebP/JPEG at multiple widths), draft filtering in production, custom Liquid filters
- **`cloudcannon.config.yml`** — CMS collections (`posts`, `pages`, `data`), input types, editorial tools; timezone is Pacific/Auckland
- **`tailwind.config.js`** — Custom breakpoints (`sm: 430px`, `md: 768px`, `lg: 1024px`), full color/spacing palette, Typography plugin, dark mode via `media`
- **`jampack.config.js`** — Post-build asset optimization: HTML minification, CSS inlining, image compression (WebP/PNG/JPEG), JS minification via esbuild

### Content authoring

Blog posts live in `src/blog/` as Markdown with YAML frontmatter. Set `draft: true` to exclude from production builds. Tags drive navigation and filtering. The `title`, `description`, and `date` fields are required by CloudCannon schemas.
