module.exports = {
  eleventyComputed: {
    permalink: (data) => {
      if (process.env.NODE_ENV === 'production' && data.date > new Date()) {
        return false;
      }
      return data.permalink;
    },
    eleventyExcludeFromCollections: (data) => {
      if (process.env.NODE_ENV === 'production' && data.date > new Date()) {
        return true;
      }
      return data.eleventyExcludeFromCollections;
    }
  }
};
