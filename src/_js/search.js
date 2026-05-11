(function () {
  const dialog = document.getElementById('search-dialog');
  const openBtn = document.getElementById('search-open');
  const closeBtn = document.getElementById('search-close');
  let initialized = false;
  let initFailed = false;

  async function initSearch() {
    if (initialized || initFailed) return;
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = '/css/pagefind.css';
    document.head.appendChild(link);
    await new Promise((resolve, reject) => {
      const s = document.createElement('script');
      s.src = '/pagefind/pagefind-ui.js';
      s.onload = resolve;
      s.onerror = reject;
      document.head.appendChild(s);
    });
    new PagefindUI({ element: '#search-modal-ui', showSubResults: true });
    initialized = true;
  }

  function focusSearchInput() {
    const input = dialog.querySelector('input');
    if (input) {
      input.focus();
    } else {
      setTimeout(focusSearchInput, 50);
    }
  }

  const searchLi = openBtn.parentElement;

  openBtn.addEventListener('click', async (e) => {
    e.preventDefault();
    try {
      await initSearch();
    } catch (e) {
      if (!initFailed) {
        initFailed = true;
        document.getElementById('search-modal-ui').innerHTML =
          '<p class="search-fallback">Search is only available on the published site.</p>';
      }
    }
    searchLi.classList.add('active');
    dialog.showModal();
    setTimeout(focusSearchInput, 50);
  });

  closeBtn.addEventListener('click', () => dialog.close());

  dialog.addEventListener('click', e => {
    if (e.target === dialog) dialog.close();
  });

  dialog.addEventListener('close', () => {
    searchLi.classList.remove('active');
    openBtn.focus();
  });
})();
