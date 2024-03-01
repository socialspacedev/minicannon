// Insert plugins
const eleventyNavigationPlugin = require("@11ty/eleventy-navigation");
const pluginRss = require("@11ty/eleventy-plugin-rss");
const timeToRead = require('eleventy-plugin-time-to-read');
const pluginBookshop = require("@bookshop/eleventy-bookshop");
const yaml = require("js-yaml");
const path = require("node:path");
const Image = require("@11ty/eleventy-img");
const embedYouTube = require("eleventy-plugin-youtube-embed");

// Helper packages
// const htmlmin = require("html-minifier");
const { DateTime } = require("luxon");

// 11ty
module.exports = function (eleventyConfig) {
  // Enable 11ty plugins
  eleventyConfig.addPlugin(eleventyNavigationPlugin);
  eleventyConfig.addPlugin(pluginRss);
  eleventyConfig.addPlugin(pluginBookshop({bookshopLocations: ["_component-library"],}));
//  eleventyConfig.addPlugin(embedYouTube);
  
  eleventyConfig.addPlugin(embedYouTube, {
    lite: true
  });
  
  // Add YAML extension to use for data file
  eleventyConfig.addDataExtension("yaml", contents => yaml.load(contents));


  // Copy over some static files
  eleventyConfig
    .addPassthroughCopy({ "src/favicon": "favicon" })
    .addPassthroughCopy({ "src/fonts": "fonts" })
    .addPassthroughCopy({ "src/img": "img" });

  // Show the year in the footer
  eleventyConfig.addShortcode("year", () => `${new Date().getFullYear()}`);

  // Prettify dates
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

  // 11ty image optimisation
  eleventyConfig.addShortcode("image", async (srcFilePath, alt, sizes) => {
   
    let inputFilePath = path.join(eleventyConfig.dir.input, eleventyConfig.dir.static, srcFilePath);

    let metadata = await Image(inputFilePath, {
      widths: [400, 800, 1600],
      formats: ["avif", "webp", "svg", "jpeg"],
      outputDir: "./public/img/",
      urlPath: "/img/",
      svgShortCiruit: "size",
      // svgCompressionSize: "br",
    });

    return Image.generateHTML(metadata, {
      alt,
      sizes,
      loading: "eager",
      decoding: "async",
    });
  });
		
  // The end
  return {
    passthroughFileCopy: true,
    // Directory: in, out, etc...
    dir: {
      input: "./src/",
      includes: "/_includes/",
      layouts: "/_layouts/",
      data: "/_data/",
      static: "/_static/",
      output: "./public/",
    },
  };
};
