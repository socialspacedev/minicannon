// Shared tidy-up for names coming from the Discogs API, used by both
// discogs-sync (when saving) and discogs-match (when filling posts).

// Discogs appends " (2)", " (3)"… to artist names to tell apart artists who
// share a name ("The Twerps (2)"). Strip it from each artist in a joined
// "A (2), B" string — it's Discogs bookkeeping, not part of the name.
// Capped at 3 digits so a year in parentheses survives.
export const cleanArtist = (s) => String(s || "")
  .replace(/\s+\(\d{1,3}\)(?=\s*(,|$))/g, "")
  .trim();

// Discogs titles occasionally carry stray tabs/whitespace ("Roadrunner\t").
export const cleanTitle = (s) => String(s || "").replace(/\s+/g, " ").trim();
