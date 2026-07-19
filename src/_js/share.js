(function () {
  const modal = document.getElementById("share-modal");
  const trigger = document.querySelector(".share__trigger");
  if (!modal || !trigger) return;

  const closeBtn = modal.querySelector(".share-modal__close");
  const nativeItem = modal.querySelector(".share-modal__native");
  const copyLabel = modal.querySelector(".share-modal__copy-label");
  const url = modal.dataset.url;
  const text = modal.dataset.text;
  const title = modal.dataset.title;

  // Reveal the native "Share…" option only where the Web Share API exists (mostly mobile)
  if (nativeItem && navigator.share) nativeItem.hidden = false;

  trigger.addEventListener("click", () => modal.showModal());
  closeBtn.addEventListener("click", () => modal.close());

  // Click-outside-to-close
  modal.addEventListener("click", e => {
    if (e.target === modal) modal.close();
  });

  // Reset the copy label whenever the dialog closes
  modal.addEventListener("close", () => {
    if (copyLabel) copyLabel.textContent = "Copy link";
  });

  modal.querySelectorAll("[data-share]").forEach(el => {
    el.addEventListener("click", async e => {
      const kind = el.dataset.share;

      if (kind === "native") {
        e.preventDefault();
        try {
          await navigator.share({ title, text, url });
        } catch (err) { /* user cancelled — no-op */ }
        modal.close();
        return;
      }

      if (kind === "copy") {
        e.preventDefault();
        try {
          await navigator.clipboard.writeText(url);
          if (copyLabel) copyLabel.textContent = "Copied ✓";
        } catch (err) {
          if (copyLabel) copyLabel.textContent = "Press ⌘/Ctrl+C";
        }
        return;
      }

      // External share links (Facebook, Bluesky, Threads) open in a new tab — just close the modal
      modal.close();
    });
  });
})();
