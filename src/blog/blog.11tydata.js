// Future-dated posts are hidden only on the live site, which is the one
// CloudCannon site with ELEVENTY_ENV=production. Branch/preview sites and local
// builds don't set it, so they show future posts as they'll look once published.
const hideFuture = (data) =>
  process.env.ELEVENTY_ENV === 'production' && data.date > new Date();

module.exports = {
  eleventyComputed: {
    permalink: (data) => {
      if (hideFuture(data)) {
        return false;
      }
      return data.permalink;
    },
    eleventyExcludeFromCollections: (data) => {
      if (hideFuture(data)) {
        return true;
      }
      return data.eleventyExcludeFromCollections;
    }
  }
};
