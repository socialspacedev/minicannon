// Shared YouTube lookup for Discogs releases — used by the Eleventy build
// (discogsYoutube filter) and by discogs-match. Discogs lists each release's
// videos; we pick the first whose title contains the track title.
//
// Responses are cached by eleventy-fetch for 30 days in .cache/, so repeat
// builds don't call Discogs. Any failure returns no video rather than
// breaking the build.

import EleventyFetch from "@11ty/eleventy-fetch";

const USER_AGENT = "minicannon-discogs/1.0 +https://anaru.nz";

export const normalize = (s) => String(s || "")
  .toLowerCase()
  .normalize("NFKD").replace(/[̀-ͯ]/g, "")
  .replace(/^the\s+/i, "")
  .replace(/\s+\(\d+\)$/, "")
  .replace(/[^a-z0-9]+/g, "");

function extractYouTubeId(uri) {
  const m = String(uri || "").match(/(?:v=|youtu\.be\/|youtube\.com\/embed\/)([\w-]{11})/);
  return m ? m[1] : null;
}

// One in-flight request per release, shared across every track that uses it
const pending = new Map();

export function releaseVideos(releaseId) {
  const id = String(releaseId);
  if (!pending.has(id)) pending.set(id, fetchVideos(id));
  return pending.get(id);
}

async function fetchVideos(releaseId) {
  // Token optional: Discogs serves release data without one, at a lower rate limit
  const token = process.env.DISCOGS_TOKEN;
  try {
    const buf = await EleventyFetch(`https://api.discogs.com/releases/${releaseId}`, {
      duration: "30d",
      type: "buffer",
      fetchOptions: {
        headers: {
          "User-Agent": USER_AGENT,
          "Accept": "application/json",
          ...(token && { "Authorization": `Discogs token=${token}` }),
        },
      },
    });
    const data = JSON.parse(buf.toString("utf8"));
    return (data.videos || [])
      .map(v => ({ title: v.title || "", youtube_id: extractYouTubeId(v.uri) }))
      .filter(v => v.youtube_id);
  } catch (e) {
    console.warn(`[discogs-videos] release ${releaseId}: ${e.message}`);
    return [];
  }
}

export function findVideoMatch(videos, trackTitle) {
  const target = normalize(trackTitle);
  if (!target) return null;
  const direct = videos.find(v => normalize(v.title).includes(target));
  return direct ? direct.youtube_id : null;
}
