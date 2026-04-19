const lightboxState = {
  items: [],
  index: 0,
};

function getLightboxElements() {
  return {
    root: document.getElementById("lightbox"),
    image: document.getElementById("lightbox-image"),
    scene: document.getElementById("lightbox-scene"),
    meta: document.getElementById("lightbox-meta"),
    prev: document.getElementById("lightbox-prev"),
    next: document.getElementById("lightbox-next"),
  };
}

function preloadImage(path) {
  if (!path) {
    return;
  }

  const img = new Image();
  img.decoding = "async";
  img.src = path;
}

function renderLightbox() {
  const els = getLightboxElements();
  const item = lightboxState.items[lightboxState.index];
  if (!item) {
    return;
  }

  els.image.src = item.fullPath;
  els.image.alt = `${item.sceneName} ${item.variantLabel} ${item.rowLabel}`;
  els.scene.textContent = item.sceneName;
  els.meta.textContent = `${item.variantLabel} · ${item.rowLabel}`;

  const count = lightboxState.items.length;
  preloadImage(lightboxState.items[(lightboxState.index + 1) % count]?.fullPath);
  preloadImage(lightboxState.items[(lightboxState.index - 1 + count) % count]?.fullPath);
}

function openLightbox(items, index) {
  const els = getLightboxElements();
  lightboxState.items = items;
  lightboxState.index = index;
  renderLightbox();
  els.root.classList.add("is-open");
  els.root.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
}

function closeLightbox() {
  const els = getLightboxElements();
  els.root.classList.remove("is-open");
  els.root.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";
}

function stepLightbox(delta) {
  const count = lightboxState.items.length;
  if (!count) {
    return;
  }

  lightboxState.index = (lightboxState.index + delta + count) % count;
  renderLightbox();
}

function setupLightboxControls() {
  const els = getLightboxElements();

  els.prev.addEventListener("click", () => stepLightbox(-1));
  els.next.addEventListener("click", () => stepLightbox(1));

  els.root.querySelectorAll("[data-lightbox-close]").forEach((node) => {
    node.addEventListener("click", closeLightbox);
  });

  document.addEventListener("keydown", (event) => {
    if (!els.root.classList.contains("is-open")) {
      return;
    }

    if (event.key === "Escape") {
      closeLightbox();
    } else if (event.key === "ArrowLeft") {
      stepLightbox(-1);
    } else if (event.key === "ArrowRight") {
      stepLightbox(1);
    }
  });
}

function setupTiles() {
  document.querySelectorAll(".scene-card").forEach((card) => {
    const items = Array.from(card.querySelectorAll(".viz-tile")).map((tile) => ({
      tile,
      fullPath: tile.dataset.fullSrc,
      sceneName: tile.dataset.sceneName,
      rowLabel: tile.dataset.rowLabel,
      variantLabel: tile.dataset.variantLabel,
    }));

    items.forEach((item, index) => {
      item.tile.addEventListener("click", () => openLightbox(items, index));
    });
  });
}

function init() {
  setupLightboxControls();
  setupTiles();
}

init();
