# anaru.nz

Personal blog and photography portfolio at [anaru.nz](https://anaru.nz), built with Eleventy and Tailwind CSS, managed via CloudCannon CMS. Started from the [Minimalism](https://github.com/MarcoMicale/Minimalism) theme by [Marco Micale](https://github.com/MarcoMicale).

## Tech stack

- **[CloudCannon](https://cloudcannon.com/)** — Git-based CMS and hosting
  - **[Pagefind](https://pagefind.app/)** — static search
- **[Eleventy](https://www.11ty.dev/)** — static site generator
  - [eleventy-img](https://github.com/11ty/eleventy-img) — image optimisation (AVIF, WebP, JPEG at multiple widths)
  - [eleventy-fetch](https://github.com/11ty/eleventy-fetch) — cached build-time HTTP fetching (used for Bandcamp artwork and Discogs YouTube lookups)
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
- Two-column homepage: hero image from the latest post that has one + recent posts list with post-type icons
  - Image source: the show post's `hero_image` / `hero_alt` (Vinyl Vibes, A Certain Sound), else `thumbnail`; posts with no image are skipped
  - Optimised via eleventy-img (AVIF/WebP/JPEG at 400/800/1200w), loaded eagerly with high priority, and links to its post
- Static search via Pagefind, opened from a magnifying-glass icon next to the site title (lazy-loaded dialog modal)
- Scheduled posts — posts with a future date are excluded from production builds until that date
- RSS feed, XML sitemap, and `llms.txt` for AEO
- Rich social sharing — Open Graph + Twitter/X (`summary_large_image`) card tags and BlogPosting JSON-LD, with a share-image fallback chain (`thumbnail` → post `hero_image` → site `defaultImage` in `meta.yaml`) so every post gets a preview image
- Per-post "Share" button — a single Tabler share glyph at the foot of every post opens a `<dialog>` modal with Facebook, Bluesky, Threads, copy-link, and (on mobile) native Web Share; links are server-rendered so they work without JS. On A Certain Sound and Vinyl Vibes posts the glyph aligns into the post's footer link row
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
  - YouTube videos looked up automatically at build time for Discogs-linked tracks
  - Two track types when adding a track in CloudCannon: **From my Discogs collection** (picker) or **Not in my collection** (artist, title, year, duration, YouTube, link)
  - Hero image with optional photographer caption
  - Facebook group link footer on every Vinyl Vibes post
  - Full CloudCannon schema with typed inputs for all fields
- **A Certain Sound** — radio show playlist post type for the OAR show
  - Per-episode hero image, OAR on-demand link, and a minimal artist/title/year/note tracklist
- **Audio shortcode** — `{% audio %}` shortcode for self-hosted M4A/MP3, with a styled HTML5 player and optional caption; CloudCannon snippet picks files from `src/audio/`

## Discogs sync for Vinyl Vibes

Track data on Vinyl Vibes posts is sourced from a local snapshot of Andrew's Discogs collection.

```bash
npm run discogs:sync    # fetch Discogs collection + tracklists — run after adding records
npm run discogs:match   # optional — link manually typed tracks to the collection
```

Both read `DISCOGS_TOKEN=...` from `.env` (personal access token from [discogs.com/settings/developers](https://www.discogs.com/settings/developers)). `discogs:sync` requires it; the matcher and the build work without it at a lower Discogs rate limit.

### `discogs:sync`

Writes two YAML files:

- `src/_data/discogs.yaml` — full release/track data, used by the Eleventy template at build time
- `src/_data/discogs_picker.yaml` — slim `{value, label}` list, the only file CloudCannon loads for the dropdown

Names are tidied on every save (`scripts/discogs-clean.mjs`), including already-cached releases: Discogs's artist disambiguation suffixes (`The Twerps (2)` → `The Twerps`, 1–3 digits only so years survive) and stray whitespace in titles are stripped.

Rate-limited to ~55 req/min (Discogs auth ceiling is 60). Checkpoints every 25 releases so a Ctrl+C is recoverable. The first sync of a ~1000-record collection takes ~20 min; subsequent syncs are incremental (only new releases since last run) and finish in seconds.

### At build time (no script needed)

For each track with a `discogs:` reference, the template fills artist, title, year, duration and the Discogs link from `discogs.yaml` — any value typed on the track wins.

If the track has no `youtube:` ID, the `discogsYoutube` filter looks one up from the release's Discogs video list (`scripts/discogs-videos.mjs`) and uses the first video whose title contains the track title. Responses are cached 30 days in `.cache/` via eleventy-fetch, one request per release. A failed or unmatched lookup renders the track without a video; it never fails the build. A hand-entered `youtube:` ID always wins.

### `discogs:match`

Walks `src/blog/vinyl-vibes-*.md`. Since the build handles display and YouTube, its main use is linking manually typed tracks:

- **Has typed artist + title, no `discogs:` ref, no `buy_url`** — looks the track up in the synced collection and inserts `discogs: "release_id:position"`. Tracks with their own `buy_url` are left alone, as that marks a deliberate link elsewhere (e.g. a copy not in the collection).
- **Has a `discogs:` ref** — writes missing artist / title / year / duration / buy_url and a matching YouTube ID into the file. Existing values are never overwritten.

The script preserves YAML idiosyncrasies — multi-line scalars (`buy_url: >- … `) and existing quoting are left alone.

### In CloudCannon

**Add track** offers two types:

- **From my Discogs collection** — a **Track** dropdown that searches the synced collection and stores a `release_id:position` reference. Labels are `Artist – Position: Track Title (Duration) — Album [Year]` so duplicates (same song on multiple releases) can be told apart by year.
- **Not in my collection** — artist and title (required), year, duration, YouTube and link fields.

### Typical workflow

1. Add new records to your Discogs collection
2. `npm run discogs:sync` and push — the picker picks them up
3. In CloudCannon, create the Vinyl Vibes post and add tracks of either type
4. Save — the build fills track details and YouTube videos. Add a YouTube ID by hand only where none is found or you want a different video

### CloudCannon build settings

- **Preserved paths** includes `.cache` so Discogs and Bandcamp lookups are reused between builds
- **Environment variable** `DISCOGS_TOKEN` (optional) raises the Discogs rate limit for build-time lookups — set in CloudCannon, never committed

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
