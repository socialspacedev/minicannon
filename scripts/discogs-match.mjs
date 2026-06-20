// Best-effort matcher: for each Vinyl Vibes post, find tracks that have
// artist + title but no `discogs:` field and inject a release_id:position
// reference based on src/_data/discogs.yaml.
//
// Manual artist/title/year/duration fields are left in place — the template
// prefers them over Discogs lookups. So this is purely additive: it gives
// you the Buy link auto-deriving to Discogs and a foothold for later cleanup.
//
// Run: node scripts/discogs-match.mjs

import { readFile, writeFile, readdir } from "node:fs/promises";
import path from "node:path";
import yaml from "js-yaml";

const VV_DIR = "src/blog";
const DATA_PATH = "src/_data/discogs.yaml";

const normalize = (s) => String(s || "")
  .toLowerCase()
  .normalize("NFKD").replace(/[̀-ͯ]/g, "")
  .replace(/^the\s+/i, "")
  .replace(/\s+\(\d+\)$/, "")
  .replace(/[^a-z0-9]+/g, "");

async function loadDiscogs() {
  return yaml.load(await readFile(DATA_PATH, "utf8"));
}

function buildIndex(discogs) {
  const index = new Map();
  for (const [release_id, rel] of Object.entries(discogs.releases || {})) {
    if (!Array.isArray(rel.tracks)) continue;
    for (const t of rel.tracks) {
      const artistField = t.artist || rel.artist || "";
      for (const a of artistField.split(/\s*[,/]\s*/)) {
        const key = normalize(a) + "|" + normalize(t.title);
        if (!key.includes("|") || key.startsWith("|") || key.endsWith("|")) continue;
        if (!index.has(key)) index.set(key, []);
        index.get(key).push({
          release_id, position: t.position,
          artist: artistField, title: t.title,
          rel_title: rel.title, year: rel.year,
        });
      }
    }
  }
  return index;
}

function findVideoMatch(release, trackTitle) {
  if (!release || !Array.isArray(release.videos)) return null;
  const target = normalize(trackTitle);
  if (!target) return null;
  // Strict: video title contains the track title (after normalisation)
  const direct = release.videos.find(v => normalize(v.title).includes(target));
  if (direct) return direct.youtube_id;
  return null;
}

function injectMatches(content, index, discogs) {
  const lines = content.split("\n");
  const out = [];
  const summary = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    out.push(line);

    const m = line.match(/^(\s*)-\s+artist:\s*(.+?)\s*$/);
    if (!m) continue;

    const baseIndent = m[1];
    const continuationIndent = baseIndent + "  ";
    let artist = m[2].replace(/^['"]|['"]$/g, "");

    let title = null;
    let hasDiscogs = false;
    let hasYouTube = false;
    for (let j = i + 1; j < lines.length; j++) {
      const next = lines[j];
      const nextDash = next.match(/^(\s*)-\s/);
      if (nextDash && nextDash[1].length <= baseIndent.length) break;
      const blockBoundary = next.match(/^\S/);
      if (blockBoundary) break;
      const titleM = next.match(/^\s+title:\s*(.+?)\s*$/);
      if (titleM) title = titleM[1].replace(/^['"]|['"]$/g, "");
      if (/^\s+discogs:\s*\S/.test(next)) hasDiscogs = true;
      if (/^\s+youtube:\s*\S/.test(next)) hasYouTube = true;
    }

    if (!title) continue;
    if (hasDiscogs) { summary.push({ artist, title, status: "already-set" }); continue; }

    const key = normalize(artist) + "|" + normalize(title);
    const matches = index.get(key);

    if (!matches || matches.length === 0) {
      summary.push({ artist, title, status: "no-match" });
      continue;
    }

    const pick = matches[0];
    out.push(`${continuationIndent}discogs: "${pick.release_id}:${pick.position}"`);

    let youtubeAdded = false;
    if (!hasYouTube) {
      const release = discogs.releases[pick.release_id];
      const ytId = findVideoMatch(release, title);
      if (ytId) {
        out.push(`${continuationIndent}youtube: ${ytId}`);
        youtubeAdded = true;
      }
    }

    summary.push({
      artist, title,
      status: matches.length > 1 ? "duplicate" : "match",
      pick, count: matches.length,
      candidates: matches,
      youtubeAdded,
    });
  }

  return { content: out.join("\n"), summary };
}

async function main() {
  const discogs = await loadDiscogs();
  const index = buildIndex(discogs);
  console.log(`Index: ${index.size} normalized (artist, title) keys from ${Object.keys(discogs.releases).length} releases.\n`);

  const allFiles = await readdir(VV_DIR);
  const vvFiles = allFiles.filter(f => /^vinyl-vibes-/.test(f) && f.endsWith(".md")).sort();

  const totals = { matched: 0, duplicate: 0, missed: 0, alreadySet: 0 };

  for (const file of vvFiles) {
    const filepath = path.join(VV_DIR, file);
    const text = await readFile(filepath, "utf8");
    const { content, summary } = injectMatches(text, index, discogs);

    const counts = {
      match: summary.filter(s => s.status === "match").length,
      duplicate: summary.filter(s => s.status === "duplicate").length,
      noMatch: summary.filter(s => s.status === "no-match").length,
      alreadySet: summary.filter(s => s.status === "already-set").length,
    };

    totals.matched += counts.match;
    totals.duplicate += counts.duplicate;
    totals.missed += counts.noMatch;
    totals.alreadySet += counts.alreadySet;

    const wrote = counts.match + counts.duplicate > 0;
    if (wrote) await writeFile(filepath, content);

    console.log(`${file}`);
    const ytCount = summary.filter(s => s.youtubeAdded).length;
    console.log(`  +${counts.match} matched | ${counts.duplicate} duplicate (auto-picked first, REVIEW) | ${counts.noMatch} unmatched | ${counts.alreadySet} already set | +${ytCount} YouTube IDs`);

    summary.filter(s => s.status === "duplicate").forEach(s => {
      console.log(`  ⚠ ${s.artist} — ${s.title} (${s.count} releases, picked: ${s.pick.rel_title})`);
    });
    summary.filter(s => s.status === "no-match").forEach(s => {
      console.log(`  – ${s.artist} — ${s.title}`);
    });
  }

  console.log(`\n=== Summary ===`);
  console.log(`Matched cleanly: ${totals.matched}`);
  console.log(`Duplicates picked (review in CMS): ${totals.duplicate}`);
  console.log(`Unmatched (not in your Discogs collection): ${totals.missed}`);
  console.log(`Already had discogs set: ${totals.alreadySet}`);
}

main().catch(e => { console.error(e); process.exit(1); });
