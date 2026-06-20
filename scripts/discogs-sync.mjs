// Discogs collection sync — fetches Andrew's Discogs collection + tracklists,
// writes src/_data/discogs.yaml for use by the Vinyl Vibes track picker.
//
// Run: npm run discogs:sync
// Requires: .env with DISCOGS_TOKEN=... (personal access token from
//           https://www.discogs.com/settings/developers)

import { readFile, writeFile } from "node:fs/promises";
import yaml from "js-yaml";

const TOKEN = process.env.DISCOGS_TOKEN;
const USERNAME = "socialspacious";
const USER_AGENT = "minicannon-discogs-sync/1.0 +https://anaru.nz";
const OUT_PATH = "src/_data/discogs.yaml";
const PICKER_PATH = "src/_data/discogs_picker.yaml";

// Discogs allows 60 authenticated req/min. 1100ms = ~55 req/min, safely under.
const RATE_LIMIT_MS = 1100;
const SAVE_EVERY = 25; // checkpoint so a Ctrl+C doesn't lose progress

if (!TOKEN) {
  console.error("Missing DISCOGS_TOKEN — add it to .env (DISCOGS_TOKEN=...) or set in the environment.");
  process.exit(1);
}

const sleep = (ms) => new Promise(r => setTimeout(r, ms));

async function api(path) {
  const url = path.startsWith("http") ? path : `https://api.discogs.com${path}`;
  const res = await fetch(url, {
    headers: {
      "User-Agent": USER_AGENT,
      "Authorization": `Discogs token=${TOKEN}`,
      "Accept": "application/json",
    },
  });
  if (res.status === 429) {
    // Rate limited — back off
    const retry = Number(res.headers.get("Retry-After") || 60);
    console.warn(`\n⏳ Rate limited, waiting ${retry}s...`);
    await sleep(retry * 1000);
    return api(path);
  }
  if (!res.ok) throw new Error(`${res.status} ${res.statusText} — ${url}`);
  return res.json();
}

async function fetchCollection() {
  const releases = [];
  let page = 1, pages = 1;
  while (page <= pages) {
    process.stdout.write(`\rFetching collection page ${page}/${pages}...`);
    const data = await api(`/users/${USERNAME}/collection/folders/0/releases?per_page=100&page=${page}&sort=added&sort_order=desc`);
    pages = data.pagination.pages;
    for (const item of data.releases) {
      const bi = item.basic_information;
      releases.push({
        id: bi.id,
        artists: (bi.artists || []).map(a => a.name).join(", ") || "Unknown Artist",
        title: bi.title || "Untitled",
        year: bi.year || null,
      });
    }
    page++;
    if (page <= pages) await sleep(RATE_LIMIT_MS);
  }
  process.stdout.write("\n");
  return releases;
}

async function fetchTracklist(releaseId) {
  const data = await api(`/releases/${releaseId}`);
  return (data.tracklist || [])
    .filter(t => !t.type_ || t.type_ === "track")
    .map(t => ({
      position: t.position || "",
      title: t.title || "",
      duration: t.duration || "",
      artist: t.artists ? t.artists.map(a => a.name).join(", ") : null,
    }));
}

async function loadExisting() {
  try {
    const text = await readFile(OUT_PATH, "utf8");
    return yaml.load(text) || {};
  } catch {
    return {};
  }
}

function buildPickerOptions(releases) {
  const out = [];
  const seen = new Set();
  for (const [id, rel] of Object.entries(releases)) {
    for (const t of rel.tracks) {
      if (!t.position && !t.title) continue;
      const value = `${id}:${t.position}`;
      // Dedupe: Discogs occasionally lists multiple tracks at the same
      // physical position (medleys, soundtrack quirks). CloudCannon select
      // requires unique values, so we keep the first occurrence only.
      if (seen.has(value)) continue;
      seen.add(value);
      const artist = t.artist || rel.artist;
      const pos = t.position ? `${t.position}: ` : "";
      const dur = t.duration ? ` (${t.duration})` : "";
      const year = rel.year ? ` [${rel.year}]` : "";
      out.push({
        value,
        label: `${artist} – ${pos}${t.title}${dur} — ${rel.title}${year}`,
      });
    }
  }
  out.sort((a, b) => a.label.localeCompare(b.label));
  return out;
}

async function save(releases) {
  const out = {
    last_synced: new Date().toISOString(),
    username: USERNAME,
    counts: {
      releases: Object.keys(releases).length,
      tracks: Object.values(releases).reduce((n, r) => n + r.tracks.length, 0),
    },
    releases,
  };
  await writeFile(OUT_PATH, yaml.dump(out, { lineWidth: -1, noRefs: true }));
  // Slim picker file for the CloudCannon dropdown — kept separate so the CMS
  // doesn't have to load the full 2.5MB release/track data on every edit.
  await writeFile(PICKER_PATH, yaml.dump(buildPickerOptions(releases), { lineWidth: -1, noRefs: true }));
}

async function main() {
  const existing = await loadExisting();
  const releases = { ...(existing.releases || {}) };

  console.log("→ Fetching collection list...");
  const collection = await fetchCollection();
  console.log(`  ${collection.length} releases in collection.`);

  // Prune releases no longer in collection
  const collectionIds = new Set(collection.map(r => String(r.id)));
  for (const id of Object.keys(releases)) {
    if (!collectionIds.has(id)) {
      delete releases[id];
    }
  }

  const toFetch = collection.filter(r => !releases[r.id] || !releases[r.id].tracks);
  console.log(`→ ${toFetch.length} tracklists to fetch (${collection.length - toFetch.length} already cached).`);

  if (toFetch.length === 0) {
    await save(releases);
    console.log(`✓ Nothing new. Saved ${OUT_PATH}.`);
    return;
  }

  const estMin = Math.ceil((toFetch.length * RATE_LIMIT_MS) / 60000);
  console.log(`  Estimated time: ~${estMin} min at ${Math.round(60000 / RATE_LIMIT_MS)} req/min.\n`);

  let done = 0;
  for (const r of toFetch) {
    done++;
    const pct = Math.round((done / toFetch.length) * 100);
    process.stdout.write(`\r[${pct}%] ${done}/${toFetch.length} — ${r.artists} – ${r.title}`.padEnd(120) + " ");
    try {
      const tracks = await fetchTracklist(r.id);
      releases[r.id] = { artist: r.artists, title: r.title, year: r.year, tracks };
    } catch (e) {
      console.warn(`\n  ⚠ Failed for release ${r.id}: ${e.message}`);
    }
    if (done % SAVE_EVERY === 0) {
      await save(releases);
    }
    await sleep(RATE_LIMIT_MS);
  }

  await save(releases);
  process.stdout.write("\n");
  const counts = {
    releases: Object.keys(releases).length,
    tracks: Object.values(releases).reduce((n, r) => n + r.tracks.length, 0),
  };
  console.log(`✓ Synced ${counts.releases} releases, ${counts.tracks} tracks → ${OUT_PATH}`);
}

main().catch(err => {
  console.error("\n✗", err.message);
  process.exit(1);
});
