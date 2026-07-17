# anaru.nz

Personal blog and photography portfolio at [anaru.nz](https://anaru.nz), built with Eleventy and Tailwind CSS, managed via CloudCannon CMS. Started from the [Minimalism](https://github.com/MarcoMicale/Minimalism) theme by [Marco Micale](https://github.com/MarcoMicale).

## Tech stack

- **[CloudCannon](https://cloudcannon.com/)** — Git-based CMS and hosting
  - **[Pagefind](https://pagefind.app/)** — static search
- **[Eleventy](https://www.11ty.dev/)** — static site generator
  - [eleventy-img](https://github.com/11ty/eleventy-img) — image optimisation (AVIF, WebP, JPEG at multiple widths)
  - [eleventy-fetch](https://github.com/11ty/eleventy-fetch) — cached build-time HTTP fetching (used for Bandcamp artwork)
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
  - EXIF info button (ⓘ) on article figcaptions and inside the lightbox caption area
- Curated Music page — grid of posts opted in via a `music_featured: true` frontmatter toggle, with a layered image fallback (hero image → thumbnail → first inline image → Bandcamp artwork). Each tile has a ▶ play button on hover that pops a modal Bandcamp player; tiles' empty-row gap is filled with a "More music →" tile pointing at the music tag
- Two-column homepage: latest photography hero image + recent posts list with post-type icons
- Static search via Pagefind, opened from a magnifying-glass icon next to the site title (lazy-loaded dialog modal)
- Scheduled posts — posts with a future date are excluded from production builds until that date
- RSS feed, XML sitemap, and `llms.txt` for AEO
- Structured data (BlogPosting JSON-LD) and Open Graph tags
- Optimised images served in AVIF/WebP with layout-aware `sizes` attributes; all article images are full width regardless of orientation
- Tag-context-aware pagination — navigating from a tag page carries the tag through prev/next links
- Pagination and tag-filtered post pages
- 404 and offline pages
- WCAG 2.1 AA accessibility: skip-to-content link, ARIA landmarks, keyboard navigation throughout
- **YouTube embeds** — `{% youtube %}` shortcode accepts a full URL or bare video ID; CloudCannon snippet included
- **Bandcamp embeds** — `{% bandcamp %}` shortcode accepts a Bandcamp page URL, fetches album artwork and embed details at build time (cached for 30 days via eleventy-fetch), and renders full-width artwork with the Bandcamp player overlaid at the bottom
- **Vinyl Vibes** — dedicated post type for vinyl record night playlists
  - Two DJ sets per event, each with an ordered tracklist
  - YouTube thumbnails with zoom-on-hover and lazy-loaded embeds (click to expand, click title to close)
  - Per-track data auto-populated from a synced Discogs collection (see below); manual fields kept as per-field overrides
  - Hero image with optional photographer caption
  - Facebook group link footer on every Vinyl Vibes post
  - Full CloudCannon schema with typed inputs for all fields
- **A Certain Sound** — radio show playlist post type for the OAR show
  - Per-episode hero image, OAR on-demand link, and a minimal artist/title/year/note tracklist
- **Audio shortcode** — `{% audio %}` shortcode for self-hosted M4A/MP3, with a styled HTML5 player and optional caption; CloudCannon snippet picks files from `src/audio/`

## Discogs sync for Vinyl Vibes

Track data on Vinyl Vibes posts is sourced from a local snapshot of Andrew's Discogs collection. Two scripts work together:

```bash
npm run discogs:sync    # fetch Discogs collection + tracklists
npm run discogs:match   # walk Vinyl Vibes posts, fill missing data
```

Both require `.env` with `DISCOGS_TOKEN=...` (personal access token from [discogs.com/settings/developers](https://www.discogs.com/settings/developers)).

### `discogs:sync`

Writes two YAML files:

- `src/_data/discogs.yaml` — full release/track data, used by the Eleventy template at build time
- `src/_data/discogs_picker.yaml` — slim `{value, label}` list, the only file CloudCannon loads for the dropdown

Rate-limited to ~55 req/min (Discogs auth ceiling is 60). Checkpoints every 25 releases so a Ctrl+C is recoverable. The first sync of a ~1000-record collection takes ~20 min; subsequent syncs are incremental (only new releases since last run) and finish in seconds.

### `discogs:match`

Walks `src/blog/vinyl-vibes-*.md` and works bi-directionally on each track:

- **Has typed artist + title, no `discogs:` ref** — looks the track up in the synced collection, picks the first match, inserts a `discogs: "release_id:position"` line at the top of the block.
- **Has a `discogs:` ref but missing artist / title / year / duration / buy_url** — fills them in from the synced data. The Discogs release page URL is set as `buy_url`. Existing manual values are never overwritten.
- **Has a `discogs:` ref but no `youtube:`** — fetches the release's Discogs videos (cached 30 days via eleventy-fetch — only releases referenced by posts ever get queried) and injects a YouTube ID if a video title matches the track title.

The script preserves YAML idiosyncrasies — multi-line scalars (`buy_url: >- … `) and existing quoting are left alone. Tracks that already have everything set are untouched.

### The CloudCannon picker

Each Vinyl Vibes track has a **Track (from Discogs collection)** dropdown that searches the synced collection and stores a `release_id:position` reference. The labels are formatted `Artist – Position: Track Title (Duration) — Album [Year]` so you can disambiguate duplicates (same song on multiple releases) by release year.

Picks store only the reference. Running `npm run discogs:match` after CC edits fills the human-readable fields in the YAML so they're visible in the editor and the rendered post.

### Typical workflow

1. Add new records to your Discogs collection
2. `npm run discogs:sync` — picks them up
3. In CloudCannon, edit a Vinyl Vibes post and pick tracks via the dropdown
4. `git pull` locally → `npm run discogs:match` → `git push` — fills artist/title/year/duration/buy_url and tries to auto-add YouTube IDs from Discogs's linked videos

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

Blog posts live in `src/blog/` as Markdown with YAML frontmatter. Photography posts tagged `photography` are automatically included in the photo gallery. Posts with a future `date` are hidden from production builds and published automatically when CloudCannon's scheduled daily build runs on that date.

JavaScript source files live in `src/_js/` and are copied to `public/js/` at build time.

## Deployment

Pushes to `main` trigger a CloudCannon build automatically.
