// Insert plugins
const eleventyNavigationPlugin = require("@11ty/eleventy-navigation");
const pluginRss = require("@11ty/eleventy-plugin-rss");
const timeToRead = require('eleventy-plugin-time-to-read');
const yaml = require("js-yaml");
const path = require("node:path");
const { readFile } = require("fs").promises;
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
  
  // Configure YouTube embed plugin
  eleventyConfig.addPlugin(embedYouTube, {
    lazy: true
  });
  
  // Add YAML extension to use for data file
  eleventyConfig.addDataExtension("yaml", contents => yaml.load(contents));

  // Copy over some static files
  eleventyConfig
    .addPassthroughCopy({ "src/favicon": "favicon" })
    .addPassthroughCopy({ "src/fonts": "fonts" })
    .addPassthroughCopy({ "src/img": "img" })
    .addPassthroughCopy({ "src/_css/pagefind.css": "css/pagefind.css" });

  // Show the year in the footer
  eleventyConfig.addShortcode("year", () => `${new Date().getFullYear()}`);

  // Bandcamp embed
  eleventyConfig.addShortcode("bandcamp", (src) => {
    return `<iframe id="bandcamp" style="border: 0; width: 100%; height: 522px;" src="${src}" seamless=""></iframe>`;
  });

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
  eleventyConfig.addShortcode("image", async (srcFilePath, alt, sizes, caption, camera, lens, film, iso) => {

    let inputFilePath = path.join(eleventyConfig.dir.input, srcFilePath);

    let metadata = await Image(inputFilePath, {
      widths: [400, 800, 1000],
      formats: ["avif", "webp", "svg", "jpeg"],
      outputDir: "./public/img/",
      urlPath: "/img/",
      svgShortCiruit: "size",
      // svgCompressionSize: "br",
    });

    const html = Image.generateHTML(metadata, {
      alt,
      sizes,
      loading: "eager",
      decoding: "async",
    });

    if (caption) {
      const jpegs = metadata.jpeg || [];
      const full = jpegs[jpegs.length - 1];
      const thumb = jpegs[0];
      const dataAttrs = full
        ? ` data-pswp-src="${full.url}" data-pswp-width="${full.width}" data-pswp-height="${full.height}" data-pswp-thumb="${thumb ? thumb.url : full.url}"`
        : '';
      const exifAttrs = [
        camera ? ` data-exif-camera="${camera}"` : '',
        lens    ? ` data-exif-lens="${lens}"`     : '',
        film    ? ` data-exif-film="${film}"`     : '',
        iso     ? ` data-exif-iso="${iso}"`       : '',
      ].join('');
      const a11yAttrs = dataAttrs ? ` tabindex="0" role="button" aria-label="Open photo${alt ? ': ' + alt : ''}"` : '';
      return `<figure><div class="film-frame"${dataAttrs}${exifAttrs}${a11yAttrs}>${html}</div><figcaption>${caption}</figcaption></figure>`;
    }
    return html;
  });

  // Centered/constrained image for use in page content (e.g. about page camera photo)
  eleventyConfig.addShortcode("image_centered", async (srcFilePath, alt, sizes) => {
    let inputFilePath = path.join(eleventyConfig.dir.input, srcFilePath);
    let metadata = await Image(inputFilePath, {
      widths: [400, 800, 1000],
      formats: ["avif", "webp", "svg", "jpeg"],
      outputDir: "./public/img/",
      urlPath: "/img/",
      svgShortCiruit: "size",
    });
    const html = Image.generateHTML(metadata, {
      alt,
      sizes,
      loading: "lazy",
      decoding: "async",
    });
    return `<div class="max-w-md mx-auto mt-2">${html}</div>`;
  });

  // Exclude drafts from production
//	eleventyConfig.addGlobalData("eleventyComputed.permalink", function () {
//		return (data) => {
//			if (!data.published && process.env.production) {
//				return false;
//			}

//			return data.permalink;
//		};
//	});

  eleventyConfig.addCollection("tagList", function(collection) {
    let tagSet = new Set();
    collection.getAll().forEach(item => {
      (item.data.tags || []).forEach(tag => {
        if (tag !== "post" && tag !== "pages") tagSet.add(tag);
      });
    });
    return [...tagSet].sort();
  });

  eleventyConfig.addCollection("galleryImages", async function(collection) {
    const items = collection.getFilteredByTag("photography");
    items.sort((a, b) => b.date - a.date);
    const result = [];

    for (const item of items) {
      let content;
      try { content = await readFile(item.inputPath, 'utf8'); } catch(e) { continue; }

      // Parse {% image, "path" "alt" "sizes" %} and optional "caption" "camera" "lens" "film" "iso"
      const shortcodeRe = /\{%-?\s*image,?\s+"([^"]+)"\s+"([^"]+)"\s+"([^"]+)"(?:\s+"([^"]*)")?(?:\s+"([^"]*)")?(?:\s+"([^"]*)")?(?:\s+"([^"]*)")?(?:\s+"([^"]*)")?\s*-?%\}/g;
      let match;
      while ((match = shortcodeRe.exec(content)) !== null) {
        const srcPath = match[1], alt = match[2], caption = match[4] || '';
        const camera = match[5] || '', lens = match[6] || '', film = match[7] || '', iso = match[8] || '';
        if (!caption) continue;
        try {
          const metadata = await Image(path.join('./src/', srcPath), {
            widths: [400, 1000], formats: ["jpeg"],
            outputDir: "./public/img/", urlPath: "/img/",
          });
          const jpegs = metadata.jpeg || [];
          const full = jpegs[jpegs.length - 1], thumb = jpegs[0];
          if (full) result.push({ src: full.url, width: full.width, height: full.height,
            thumb: thumb ? thumb.url : full.url, alt, caption, postUrl: item.url, camera, lens, film, iso });
        } catch(e) {}
      }

      // Parse markdown images ![alt](src "title")
      const mdImgRe = /!\[([^\]]*)\]\(([^\s)]+)(?:\s+"([^"]*)")?\)/g;
      while ((match = mdImgRe.exec(content)) !== null) {
        const alt = match[1], src = match[2], caption = match[3] || '';
        if (!src.startsWith('/img/') || !caption) continue;
        try {
          const metadata = await Image(path.join('./src/', src), {
            widths: [400, 1000], formats: ["jpeg"],
            outputDir: "./public/img/", urlPath: "/img/",
          });
          const jpegs = metadata.jpeg || [];
          const full = jpegs[jpegs.length - 1], thumb = jpegs[0];
          if (full) result.push({ src: full.url, width: full.width, height: full.height,
            thumb: thumb ? thumb.url : full.url, alt, caption, postUrl: item.url,
            camera: '', lens: '', film: '', iso: '' });
        } catch(e) {}
      }
    }
    return result;
  });

  // Wrap markdown images in <figure>/<figcaption> when a title attribute is present
  eleventyConfig.amendLibrary("md", (mdLib) => {
    const defaultRender = mdLib.renderer.rules.image || function(tokens, idx, options, env, self) {
      return self.renderToken(tokens, idx, options);
    };
    mdLib.renderer.rules.image = function(tokens, idx, options, env, self) {
      const token = tokens[idx];
      const title = token.attrGet("title");
      const rendered = defaultRender(tokens, idx, options, env, self);
      if (title) {
        return `<figure><div class="film-frame">${rendered}</div><figcaption>${title}</figcaption></figure>`;
      }
      return rendered;
    };
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
      output: "./public/",
    },
  };
};