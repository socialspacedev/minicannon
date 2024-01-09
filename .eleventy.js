// Inseriment plugins
const eleventyNavigationPlugin = require("@11ty/eleventy-navigation");
const pluginRss = require("@11ty/eleventy-plugin-rss");
const timeToRead = require('eleventy-plugin-time-to-read');
const pluginBookshop = require("@bookshop/eleventy-bookshop");
const yaml = require("js-yaml");

// Helper packages
const htmlmin = require("html-minifier");
const { DateTime } = require("luxon");

// 11ty
module.exports = function (eleventyConfig) {
  // Apri automaticamente il browser
  eleventyConfig.setBrowserSyncConfig({ open: true });

  // 11ty attivazione plugins
  eleventyConfig.addPlugin(eleventyNavigationPlugin);
  eleventyConfig.addPlugin(pluginRss);
  eleventyConfig.addPlugin(pluginBookshop({bookshopLocations: ["_component-library"],}));
  
  // Add YAML extension to use for data file
  eleventyConfig.addDataExtension("yaml", contents => yaml.load(contents));


  // Copia alcuni file statici
  eleventyConfig
    .addPassthroughCopy({ "src/_11ty/_static/favicon": "favicon" })
    .addPassthroughCopy({ "src/_11ty/_static/img": "img" });

  // Mostrare l'anno nel footer
  eleventyConfig.addShortcode("year", () => `${new Date().getFullYear()}`);

  // HTML minify
  eleventyConfig.addTransform("htmlmin", (content, outputPath) => {
    if (outputPath.endsWith(".html")) {
      return htmlmin.minify(content, {
        collapseWhitespace: true,
        removeComments: true,
        useShortDoctype: true,
      });
    }
    return content;
  });

  // Data leggibile
  eleventyConfig.addFilter("readableDate", (dateObj) => {
    return DateTime.fromJSDate(dateObj, { zone: "utc+13" }).toFormat(
      "dd LLL yyyy"
    );
  });

  // Data Feed
  eleventyConfig.addLiquidFilter("dateToRfc3339", pluginRss.dateToRfc3339);

  // Time to read for liquid
  eleventyConfig.addPlugin(timeToRead, {
    speed: '1000 characters per minute',
    language: 'en',
    style: 'long',
    type: 'unit',
    hours: 'auto',
    minutes: true,
    seconds: false,
    digits: 1,
    output: function(data) {
      return data.timing;
    }
  });
  
// Safe stopped working with Liquid so trying this
  //eleventyConfig.addFilter("safe", function(content) {
  //  return content;
  //});

  // e alla fine
  return {
    passthroughFileCopy: true,
    // Directory: in, out, etc...
    dir: {
      input: "./src/",
      includes: "/_11ty/_includes/",
      layouts: "/_11ty/_layouts/",
      data: "/_11ty/_data/",
      output: "./public/",
    },
  };
};
