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
    .addPassthroughCopy({ "src/_js": "js" })
    .addPassthroughCopy({ "src/_css/pagefind.css": "css/pagefind.css" });

  // Show the year in the footer
  eleventyConfig.addShortcode("year", () => `${new Date().getFullYear()}`);

  // Bandcamp embed — accepts a Bandcamp page URL, fetches artwork from page HTML at build time
  eleventyConfig.addShortcode("bandcamp", async (pageUrl) => {
    const { default: EleventyFetch } = await import("@11ty/eleventy-fetch");
    const esc = s => String(s).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    const decodeHtml = s => String(s).replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&lt;/g, '<').replace(/&gt;/g, '>');

    let thumbnail = '', embedSrc = '', label = '';
    try {
      const buf = await EleventyFetch(pageUrl, {
        duration: "30d",
        type: "buffer",
        fetchOptions: {
          headers: {
            "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
            "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
            "Accept-Language": "en-US,en;q=0.5",
          }
        }
      });
      const html = buf.toString('utf8');

      const imgMatch = html.match(/<meta\s+property="og:image"\s+content="([^"]+)"/i)
                    || html.match(/<meta\s+content="([^"]+)"\s+property="og:image"/i);
      if (imgMatch) thumbnail = imgMatch[1];

      const titleMatch = html.match(/<meta\s+property="og:title"\s+content="([^"]+)"/i)
                      || html.match(/<meta\s+content="([^"]+)"\s+property="og:title"/i);
      if (titleMatch) label = decodeHtml(titleMatch[1]);

      // Try to find an EmbeddedPlayer URL already in the page source
      const embedMatch = html.match(/https:\/\/bandcamp\.com\/EmbeddedPlayer\/[^\s"'<\\]+/);
      if (embedMatch) {
        embedSrc = embedMatch[0].replace(/\\"/g, '');
      } else {
        // Derive from numeric IDs in page JSON data
        const albumIdMatch = html.match(/"album_id"\s*:\s*(\d+)/);
        const trackIdMatch = html.match(/"track_id"\s*:\s*(\d+)/);
        if (albumIdMatch) {
          embedSrc = `https://bandcamp.com/EmbeddedPlayer/album=${albumIdMatch[1]}/`;
        } else if (trackIdMatch) {
          embedSrc = `https://bandcamp.com/EmbeddedPlayer/track=${trackIdMatch[1]}/`;
        }
      }
      if (embedSrc) {
        // Force a clean compact player overlaid on the artwork
        embedSrc = embedSrc
          .replace(/size=\w+\//i, 'size=small/')
          .replace(/artwork=\w+\//i, 'artwork=none/')
          .replace(/bgcol=[a-f0-9]+\//i, 'bgcol=1a1a1a/')
          .replace(/linkcol=[a-f0-9]+\//i, 'linkcol=ffffff/')
          .replace(/transparent=true\//i, '');
        if (!embedSrc.includes('size='))      embedSrc += 'size=small/';
        if (!embedSrc.includes('artwork='))   embedSrc += 'artwork=none/';
        if (!embedSrc.includes('tracklist=')) embedSrc += 'tracklist=false/';
        if (!embedSrc.includes('bgcol='))     embedSrc += 'bgcol=1a1a1a/';
        if (!embedSrc.includes('linkcol='))   embedSrc += 'linkcol=ffffff/';
      }
    } catch (e) {
      console.warn(`[bandcamp] Failed to fetch ${pageUrl}: ${e.message}`);
    }

    if (!thumbnail || !embedSrc) {
      return `<p><a href="${esc(pageUrl)}" target="_blank" rel="noopener noreferrer">Listen on Bandcamp ↗</a></p>`;
    }

    return `<div class="bc-embed">
  <img src="${esc(thumbnail)}" alt="${esc(label)}" loading="lazy">
  <iframe class="bc-iframe" src="${esc(embedSrc)}" title="${esc(label)}" seamless></iframe>
</div>`;
  });

  // YouTube embed — accepts a full YouTube URL or bare video ID
  eleventyConfig.addShortcode("youtube", (urlOrId) => {
    const match = String(urlOrId).match(/(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
    const id = match ? match[1] : urlOrId;
    return `<div class="youtube-embed"><iframe src="https://www.youtube.com/embed/${id}?rel=0" title="YouTube video" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen loading="lazy"></iframe></div>`;
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
  eleventyConfig.addShortcode("image", async (srcFilePath, alt, caption, camera, lens, film, iso) => {

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
      sizes: "(min-width: 1024px) 768px, 100vw",
      loading: "eager",
      decoding: "async",
    });

    if (caption) {
      const exifAttrs = [
        camera ? ` data-exif-camera="${camera}"` : '',
        lens    ? ` data-exif-lens="${lens}"`     : '',
        film    ? ` data-exif-film="${film}"`     : '',
        iso     ? ` data-exif-iso="${iso}"`       : '',
      ].join('');
      if (exifAttrs) {
        const jpegs = metadata.jpeg || [];
        const full = jpegs[jpegs.length - 1];
        const thumb = jpegs[0];
        const dataAttrs = full
          ? ` data-pswp-src="${full.url}" data-pswp-width="${full.width}" data-pswp-height="${full.height}" data-pswp-thumb="${thumb ? thumb.url : full.url}"`
          : '';
        const a11yAttrs = dataAttrs ? ` tabindex="0" role="button" aria-label="Open photo${alt ? ': ' + alt : ''}"` : '';
        return `<figure><div class="film-frame"${dataAttrs}${exifAttrs}${a11yAttrs}>${html}</div><figcaption>${caption}</figcaption></figure>`;
      }
      return `<figure>${html}<figcaption>${caption}</figcaption></figure>`;
    }
    return html;
  });

  // Centered/constrained image for use in page content (e.g. about page camera photo)
  eleventyConfig.addShortcode("image_centered", async (srcFilePath, alt) => {
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
      sizes: "(min-width: 430px) 448px, 100vw",
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

      // Parse {% image "path" "alt" %} and optional "caption" "camera" "lens" "film" "iso"
      const shortcodeRe = /\{%-?\s*image,?\s+"([^"]+)"\s+"([^"]+)"(?:\s+"([^"]*)")?(?:\s+"([^"]*)")?(?:\s+"([^"]*)")?(?:\s+"([^"]*)")?(?:\s+"([^"]*)")?\s*-?%\}/g;
      let match;
      while ((match = shortcodeRe.exec(content)) !== null) {
        const srcPath = match[1], alt = match[2], caption = match[3] || '';
        const camera = match[4] || '', lens = match[5] || '', film = match[6] || '', iso = match[7] || '';
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

      // Parse frontmatter photos array (photo dump posts)
      if (Array.isArray(item.data.photos)) {
        for (const photo of item.data.photos) {
          if (!photo.image_file || !photo.caption) continue;
          try {
            const metadata = await Image(path.join('./src/', photo.image_file), {
              widths: [400, 1000], formats: ["jpeg"],
              outputDir: "./public/img/", urlPath: "/img/",
            });
            const jpegs = metadata.jpeg || [];
            const full = jpegs[jpegs.length - 1], thumb = jpegs[0];
            if (full) result.push({ src: full.url, width: full.width, height: full.height,
              thumb: thumb ? thumb.url : full.url, alt: photo.alt || '', caption: photo.caption,
              postUrl: item.url, camera: photo.camera || '', lens: photo.lens || '',
              film: photo.film || '', iso: photo.iso || '' });
          } catch(e) {}
        }
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
        return `<figure>${rendered}<figcaption>${title}</figcaption></figure>`;
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