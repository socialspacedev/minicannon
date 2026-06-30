(function () {
  const modal = document.getElementById("bandcamp-modal");
  if (!modal) return;

  const iframe = modal.querySelector(".bc-modal__embed");
  const postLink = modal.querySelector(".bc-modal__post-link");
  const closeBtn = modal.querySelector(".bc-modal__close");

  function open(button) {
    const src = button.dataset.bandcamp;
    if (!src) return;
    iframe.src = src;
    postLink.href = button.dataset.url || "#";
    postLink.textContent = button.dataset.title ? `View "${button.dataset.title}" →` : "View post →";
    document.querySelectorAll(".music-item__play.is-playing").forEach(b => b.classList.remove("is-playing"));
    button.classList.add("is-playing");
    modal.showModal();
  }

  function close() {
    modal.close();
  }

  // When the dialog closes (button, ESC, or backdrop click), clear the iframe to stop audio
  modal.addEventListener("close", () => {
    iframe.removeAttribute("src");
    document.querySelectorAll(".music-item__play.is-playing").forEach(b => b.classList.remove("is-playing"));
  });

  // Click-outside-to-close
  modal.addEventListener("click", e => {
    if (e.target === modal) close();
  });

  document.querySelectorAll(".music-item__play").forEach(btn => {
    btn.addEventListener("click", e => {
      e.preventDefault();
      e.stopPropagation();
      open(btn);
    });
  });

  closeBtn.addEventListener("click", close);
})();
