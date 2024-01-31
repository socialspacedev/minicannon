// config.js
const default_options = {
  general: {
    browserslist: 'defaults', // defaults = '> 0.5%, last 2 versions, Firefox ESR, not dead'
  },
  html: {
    add_css_reset_as: 'inline',
    sort_attributes: false,
  },
  css: {
    inline_critical_css: false,
  },
  js: {
    compressor: 'esbuild',
  },
  image: {
    embed_size: 1500,
    srcset_min_width: 390 * 2, // HiDPI phone
    srcset_max_width: 1920 * 2, // 4K
    max_width: 99999,
    external: {
      process: 'off',
      src_include: /^.*$/,
      src_exclude: null,
    },
    cdn: {
      process: 'off',
      src_include: /^.*$/,
      src_exclude: null,
    },
    compress: true,
    jpeg: {
      options: {
        quality: 50,
        mozjpeg: true,
      },
    },
    png: {
      options: {
        compressionLevel: 6,
      },
    },
    webp: {
      options_lossless: {
        effort: 4,
        quality: 60,
        mode: 'lossless',
      },
      options_lossly: {
        effort: 4,
        quality: 60,
        mode: 'lossly',
      },
    },
    svg: {
      optimization: true,
    },
  },
  misc: {
    prefetch_links: 'off',
  },
};

module.exports = default_options;