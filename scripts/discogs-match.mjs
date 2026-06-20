// Best-effort matcher: for each Vinyl Vibes post, find tracks that have
// artist + title but no `discogs:` field and inject a release_id:position
// reference based on src/_data/discogs.yaml. Also fetches Discogs videos
// for each matched release (cached via eleventy-fetch) and injects a
// `youtube:` ID when a video's title matches the track title.
//
// Manual artist/title/year/duration fields are left in place — the template
// prefers them over Discogs lookups. This is purely additive.
//
// Run: npm run discogs:match
// Requires .env with DISCOGS_TOKEN= for the video fetch step.

import { readFile, writeFile, readdir } from "node:fs/promises";
import path from "node:path";
import yaml from "js-yaml";
import EleventyFetch from "@11ty/eleventy-fetch";

const TOKEN = process.env.DISCOGS_TOKEN;
const USER_AGENT = "minicannon-discogs-match/1.0 +https://anaru.nz";

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

function extractYouTubeId(uri) {
  const m = String(uri || "").match(/(?:v=|youtu\.be\/|youtube\.com\/embed\/)([\w-]{11})/);
  return m ? m[1] : null;
}

const videoCache = new Map();

async function fetchVideos(releaseId) {
  if (videoCache.has(releaseId)) return videoCache.get(releaseId);
  if (!TOKEN) {
    videoCache.set(releaseId, []);
    return [];
  }
  try {
    const buf = await EleventyFetch(`https://api.discogs.com/releases/${releaseId}`, {
      duration: "30d",
      type: "buffer",
      fetchOptions: {
        headers: {
          "User-Agent": USER_AGENT,
          "Authorization": `Discogs token=${TOKEN}`,
          "Accept": "application/json",
        },
      },
    });
    const data = JSON.parse(buf.toString("utf8"));
    const videos = (data.videos || [])
      .map(v => ({ title: v.title || "", youtube_id: extractYouTubeId(v.uri) }))
      .filter(v => v.youtube_id);
    videoCache.set(releaseId, videos);
    return videos;
  } catch (e) {
    videoCache.set(releaseId, []);
    return [];
  }
}

function findVideoMatch(videos, trackTitle) {
  const target = normalize(trackTitle);
  if (!target) return null;
  const direct = videos.find(v => normalize(v.title).includes(target));
  return direct ? direct.youtube_id : null;
}

function yamlValue(v) {
  // js-yaml dump returns "key: value\n" — strip the key and trailing newline
  const dumped = yaml.dump({ x: v }, { lineWidth: -1 }).trimEnd();
  return dumped.slice("x: ".length);
}

// Line-surgery helper: scan a track block starting at i, return field map
// + the line index where each field appears. Continuation lines (multi-line
// scalars) are passed through untouched.
function scanTrackBlock(lines, i) {
  const dashMatch = lines[i].match(/^(\s*)-\s+(\w+):\s*(.*)$/);
  if (!dashMatch) return null;
  const baseIndent = dashMatch[1];
  const continuationIndent = baseIndent + "  ";
  const fields = {};
  const fieldLine = {}; // field → line index
  const recordField = (k, v, lineIdx) => {
    if (k in fields) return; // first occurrence wins
    fields[k] = v;
    fieldLine[k] = lineIdx;
  };
  recordField(dashMatch[2], unquote(dashMatch[3]), i);

  let end = i + 1;
  while (end < lines.length) {
    const next = lines[end];
    const nextDash = next.match(/^(\s*)-\s/);
    if (nextDash && nextDash[1].length <= baseIndent.length) break;
    if (/^\S/.test(next)) break;
    // Only match lines at EXACTLY the field-level indent; deeper indents are
    // continuation of a multi-line scalar (e.g., `buy_url: >-\n            https://…`)
    const fieldM = next.match(/^(\s+)(\w+):\s*(.*)$/);
    if (fieldM && fieldM[1].length === continuationIndent.length) {
      recordField(fieldM[2], unquote(fieldM[3]), end);
    }
    end++;
  }
  return { baseIndent, continuationIndent, fields, fieldLine, startLine: i, endLine: end };
}

function unquote(s) {
  const t = s.trim();
  if ((t.startsWith("'") && t.endsWith("'")) || (t.startsWith('"') && t.endsWith('"'))) {
    return t.slice(1, -1).replace(/''/g, "'");
  }
  return t;
}

async function injectMatches(content, index, discogs) {
  const lines = content.split("\n");
  // We'll mutate lines in place (replacements) and track insertions to splice in afterward.
  const insertions = []; // { afterLine, lines: string[] }
  const summary = [];

  let i = 0;
  while (i < lines.length) {
    // Only treat a dashed line as a track block if its first key is
    // discogs or artist — `- dj: …` and similar are *set* entries and we
    // must descend into them rather than scooping their tracks.
    const dashMatch = lines[i].match(/^(\s*)-\s+(\w+):/);
    const firstKey = dashMatch && dashMatch[2];
    if (firstKey !== "discogs" && firstKey !== "artist") {
      i++;
      continue;
    }
    const block = scanTrackBlock(lines, i);
    if (!block) { i++; continue; }

    const { continuationIndent, fields, fieldLine, endLine } = block;
    let status = "no-change";
    let youtubeAdded = false;
    let resolvedRelease = null;

    // Direction 1: have artist+title, no discogs → add discogs
    if (!fields.discogs && fields.artist && fields.title) {
      const key = normalize(fields.artist) + "|" + normalize(fields.title);
      const matches = index.get(key);
      if (matches && matches.length > 0) {
        const pick = matches[0];
        fields.discogs = `${pick.release_id}:${pick.position}`;
        // Convert `- artist: X` line → `- discogs: "ID"` and insert artist below
        const dashLine = lines[fieldLine.artist]; // this is the `- artist: …` line
        const dashIndent = dashLine.match(/^(\s*)-/)[1];
        lines[fieldLine.artist] = `${dashIndent}- discogs: "${fields.discogs}"`;
        insertions.push({ afterLine: fieldLine.artist, lines: [`${continuationIndent}artist: ${yamlValue(fields.artist)}`] });
        status = matches.length > 1 ? "duplicate" : "match";
        summary.push({ artist: fields.artist, title: fields.title, status, pick, count: matches.length });
      } else {
        summary.push({ artist: fields.artist, title: fields.title, status: "no-match" });
      }
    }

    // Direction 2: have discogs → fill missing artist/title/year/duration (and youtube)
    if (fields.discogs) {
      const [releaseId, position] = String(fields.discogs).split(":");
      const release = discogs.releases?.[releaseId];
      const track = release?.tracks?.find(t => t.position === position);
      if (release && track) {
        resolvedRelease = release;
        const fillTargets = [
          ["artist",   track.artist || release.artist],
          ["title",    track.title],
          ["year",     release.year ? String(release.year) : null],
          ["duration", track.duration],
          ["buy_url",  `https://www.discogs.com/release/${releaseId}`],
        ];
        const toInsert = [];
        for (const [k, v] of fillTargets) {
          if (!v) continue;
          if (fields[k]) continue; // user has a value — leave alone
          if (k in fieldLine) {
            // Empty field exists (`artist: ''` or bare `artist:`) — rewrite the line
            const lineIdx = fieldLine[k];
            const orig = lines[lineIdx];
            const m = orig.match(/^(\s+)(\w+)\s*:/);
            if (m) {
              lines[lineIdx] = `${m[1]}${m[2]}: ${yamlValue(v)}`;
              fields[k] = v;
              status = "filled";
            }
          } else {
            // Field missing entirely — insert a new line below the discogs line
            toInsert.push(`${continuationIndent}${k}: ${yamlValue(v)}`);
            fields[k] = v;
            status = "filled";
          }
        }
        if (toInsert.length > 0) {
          insertions.push({ afterLine: fieldLine.discogs, lines: toInsert });
        }

        // YouTube: skip if already set, else look up videos for matched release
        if (!fields.youtube) {
          const videos = await fetchVideos(releaseId);
          const ytId = findVideoMatch(videos, fields.title || track.title);
          if (ytId) {
            if ("youtube" in fieldLine) {
              const lineIdx = fieldLine.youtube;
              const orig = lines[lineIdx];
              const m = orig.match(/^(\s+)(\w+)\s*:/);
              if (m) lines[lineIdx] = `${m[1]}${m[2]}: ${ytId}`;
            } else {
              insertions.push({ afterLine: fieldLine.discogs, lines: [`${continuationIndent}youtube: ${ytId}`] });
            }
            youtubeAdded = true;
          }
        }

        if (status === "filled" || youtubeAdded) {
          if (!summary.find(s => s.artist === fields.artist && s.title === fields.title)) {
            summary.push({ artist: fields.artist, title: fields.title, status: "filled", youtubeAdded });
          } else if (youtubeAdded) {
            summary[summary.length - 1].youtubeAdded = true;
          }
        }
      }
    }

    void resolvedRelease;
    i = endLine;
  }

  // Apply insertions in reverse order so indexes stay valid
  insertions.sort((a, b) => b.afterLine - a.afterLine);
  for (const { afterLine, lines: newLines } of insertions) {
    lines.splice(afterLine + 1, 0, ...newLines);
  }

  return { content: lines.join("\n"), summary };
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
    const { content, summary } = await injectMatches(text, index, discogs);

    const counts = {
      match: summary.filter(s => s.status === "match").length,
      duplicate: summary.filter(s => s.status === "duplicate").length,
      noMatch: summary.filter(s => s.status === "no-match").length,
      filled: summary.filter(s => s.status === "filled").length,
    };

    totals.matched += counts.match;
    totals.duplicate += counts.duplicate;
    totals.missed += counts.noMatch;
    totals.alreadySet += counts.filled;

    const wrote = content !== text;
    if (wrote) await writeFile(filepath, content);

    console.log(`${file}`);
    const ytCount = summary.filter(s => s.youtubeAdded).length;
    console.log(`  +${counts.match} matched | ${counts.duplicate} duplicate (REVIEW) | ${counts.noMatch} unmatched | ${counts.filled} filled from Discogs | +${ytCount} YouTube IDs`);

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
