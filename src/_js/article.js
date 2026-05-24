// Add EXIF info button to figcaptions on images that have EXIF data
document.querySelectorAll('figure').forEach(figure => {
  const frame = figure.querySelector('.film-frame');
  if (!frame) return;

  const caption = figure.querySelector('figcaption');
  if (!caption) return;

  const camera = frame.dataset.exifCamera || '';
  const lens   = frame.dataset.exifLens   || '';
  const film   = frame.dataset.exifFilm   || '';
  const iso    = frame.dataset.exifIso    || '';

  const exifFields = [camera, lens, film, iso ? 'ISO ' + iso : ''].filter(Boolean);
  if (exifFields.length === 0) return;

  const exifWrap = document.createElement('span');
  exifWrap.className = 'pswp__exif-info';

  const panel = document.createElement('div');
  panel.className = 'pswp__exif-panel';
  exifFields.forEach(field => {
    const p = document.createElement('p');
    p.textContent = field;
    panel.appendChild(p);
  });

  const btn = document.createElement('button');
  btn.className = 'pswp__exif-btn';
  btn.textContent = 'ⓘ';
  btn.setAttribute('aria-label', 'Photo info');
  btn.addEventListener('click', e => {
    e.stopPropagation();
    exifWrap.classList.toggle('is-open');
  });

  exifWrap.appendChild(panel);
  exifWrap.appendChild(btn);
  caption.appendChild(exifWrap);
});

// Tag-context-aware pagination
(function () {
  const tag = new URLSearchParams(location.search).get('tag');
  if (!tag) return;
  const defaultNav = document.querySelector('ul.paginate[data-tag=""]');
  const tagNav = document.querySelector('ul.paginate[data-tag="' + CSS.escape(tag) + '"]');
  if (tagNav) {
    if (defaultNav) defaultNav.hidden = true;
    tagNav.removeAttribute('hidden');
    tagNav.querySelectorAll('a').forEach(function (a) {
      const url = new URL(a.href);
      url.searchParams.set('tag', tag);
      a.href = url.toString();
    });
  }
})();

// Lightbox for article images
(async () => {
  const frames = document.querySelectorAll('.film-frame[data-pswp-src]');
  if (frames.length === 0) return;

  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = 'https://cdn.jsdelivr.net/npm/photoswipe@5/dist/photoswipe.css';
  document.head.appendChild(link);

  const items = Array.from(frames).map(frame => ({
    src: frame.dataset.pswpSrc,
    width: parseInt(frame.dataset.pswpWidth),
    height: parseInt(frame.dataset.pswpHeight),
    thumb: frame.dataset.pswpThumb,
    alt: frame.querySelector('img')?.alt || '',
    caption: frame.closest('figure')?.querySelector('figcaption')?.firstChild?.textContent?.trim() || '',
    camera: frame.dataset.exifCamera || '',
    lens: frame.dataset.exifLens || '',
    film: frame.dataset.exifFilm || '',
    iso: frame.dataset.exifIso || ''
  }));

  const { default: PhotoSwipeLightbox } = await import('https://cdn.jsdelivr.net/npm/photoswipe@5/dist/photoswipe-lightbox.esm.min.js');

  const lightbox = new PhotoSwipeLightbox({
    dataSource: items,
    pswpModule: () => import('https://cdn.jsdelivr.net/npm/photoswipe@5/dist/photoswipe.esm.min.js'),
    bgOpacity: 0.92,
    showHideAnimationType: 'fade',
    zoom: false,
  });

  lightbox.on('uiRegister', function () {
    lightbox.pswp.ui.registerElement({
      name: 'filmstrip',
      order: 17,
      isButton: false,
      appendTo: 'root',
      onInit: (el, pswp) => {
        el.className = 'pswp__filmstrip';
        items.forEach((item, i) => {
          const btn = document.createElement('button');
          btn.className = 'pswp__filmstrip-thumb';
          btn.setAttribute('aria-label', item.alt || `Photo ${i + 1}`);
          const img = document.createElement('img');
          img.src = item.thumb || item.src;
          img.alt = '';
          img.loading = 'lazy';
          btn.appendChild(img);
          btn.addEventListener('click', () => pswp.goTo(i));
          el.appendChild(btn);
        });

        const updateActive = () => {
          el.querySelectorAll('.pswp__filmstrip-thumb').forEach((btn, i) => {
            btn.classList.toggle('active', i === pswp.currIndex);
          });
          const active = el.querySelector('.pswp__filmstrip-thumb.active');
          if (active) active.scrollIntoView({ block: 'nearest', inline: 'center', behavior: 'smooth' });
        };

        pswp.on('change', updateActive);
        pswp.on('afterInit', updateActive);
      }
    });

    lightbox.pswp.ui.registerElement({
      name: 'lightbox-caption',
      order: 9,
      isButton: false,
      appendTo: 'wrapper',
      onInit: (el, pswp) => {
        el.className = 'pswp__caption-area';

        const captionText = document.createElement('span');
        captionText.className = 'pswp__caption-text';

        const exifWrap = document.createElement('span');
        exifWrap.className = 'pswp__exif-info';

        const panel = document.createElement('div');
        panel.className = 'pswp__exif-panel';

        const btn = document.createElement('button');
        btn.className = 'pswp__exif-btn';
        btn.textContent = 'ⓘ';
        btn.setAttribute('aria-label', 'Photo info');

        exifWrap.appendChild(panel);
        exifWrap.appendChild(btn);
        el.appendChild(captionText);
        el.appendChild(exifWrap);

        btn.addEventListener('click', e => {
          e.stopPropagation();
          exifWrap.classList.toggle('is-open');
        });

        const update = () => {
          const item = items[pswp.currIndex] || {};
          exifWrap.classList.remove('is-open');
          panel.textContent = '';

          captionText.textContent = item.caption || '';

          const exifFields = [
            item.camera,
            item.lens,
            item.film,
            item.iso ? 'ISO ' + item.iso : ''
          ].filter(Boolean);

          exifWrap.style.display = exifFields.length > 0 ? '' : 'none';

          exifFields.forEach(field => {
            const p = document.createElement('p');
            p.textContent = field;
            panel.appendChild(p);
          });
        };

        pswp.on('change', update);
        pswp.on('afterInit', update);
      }
    });
  });

  lightbox.init();

  frames.forEach((frame, i) => {
    frame.addEventListener('click', () => lightbox.loadAndOpen(i));
    frame.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        lightbox.loadAndOpen(i);
      }
    });
  });
})();
