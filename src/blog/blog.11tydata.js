// Future-dated posts are hidden from production builds (anaru.nz) until their
// date. A preview site (e.g. a CloudCannon branch site) can show them by
// setting the environment variable SHOW_FUTURE_POSTS=true.
const hideFuture = (data) =>
  process.env.NODE_ENV === 'production' &&
  process.env.SHOW_FUTURE_POSTS !== 'true' &&
  data.date > new Date();

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
