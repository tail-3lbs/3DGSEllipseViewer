const sceneNames = [
  "Bicycle",
  "Bonsai",
  "Counter",
  "Flowers",
  "Garden",
  "Kitchen",
  "Room",
  "Stump",
  "Treehill",
];

const rows = [
  { key: "point_clouds", label: "Point Clouds" },
  { key: "ellipses", label: "Ellipses" },
  { key: "rendered", label: "Rendered" },
];

const variants = [
  { key: "colmap", label: "COLMAP init" },
  { key: "trained", label: "Trained model" },
];

const lightboxState = {
  items: [],
  index: 0,
};

function slugify(name) {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

function expectedPath(sceneSlug, variant, kind) {
  return `assets/scenes/${sceneSlug}/${variant}_${kind}.png`;
}

function buildCaption(variantLabel, rowLabel, path) {
  return `
    <strong>${variantLabel} · ${rowLabel}</strong>
    <span>${path}</span>
  `;
}

function buildMeta(variantLabel, rowLabel) {
  return `${variantLabel} · ${rowLabel}`;
}

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

function renderLightbox() {
  const els = getLightboxElements();
  const item = lightboxState.items[lightboxState.index];
  if (!item) {
    return;
  }

  els.image.src = item.path;
  els.image.alt = `${item.sceneName} ${item.variantLabel} ${item.rowLabel}`;
  els.scene.textContent = item.sceneName;
  els.meta.textContent = buildMeta(item.variantLabel, item.rowLabel);
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

function setupLightbox() {
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

function hydrateTile(tile, sceneName, sceneSlug, row, variant) {
  const path = expectedPath(sceneSlug, variant.key, row.key);
  const img = tile.querySelector("img");
  const caption = tile.querySelector("figcaption");

  img.alt = `${sceneSlug} ${variant.label} ${row.label}`;
  img.loading = "lazy";
  img.decoding = "async";
  img.src = path;
  caption.innerHTML = buildCaption(variant.label, row.label, path);

  img.addEventListener("load", () => {
    tile.classList.add("has-image");
  });

  img.addEventListener("error", () => {
    caption.innerHTML = `
      <strong>${variant.label} · ${row.label}</strong>
      <span>Placeholder active. Add image at ${path}</span>
    `;
  });

  return {
    tile,
    sceneName,
    path,
    rowLabel: row.label,
    variantLabel: variant.label,
  };
}

function buildSceneCard(sceneName) {
  const sceneSlug = slugify(sceneName);
  const template = document.getElementById("scene-template");
  const node = template.content.firstElementChild.cloneNode(true);
  const lightboxItems = [];
  const titleLink = node.querySelector(".scene-title-link");

  node.id = sceneSlug;
  titleLink.textContent = sceneName;
  titleLink.href = `#${sceneSlug}`;
  node.querySelector(".scene-slug").textContent = sceneSlug;

  rows.forEach((row) => {
    variants.forEach((variant) => {
      const tile = node.querySelector(
        `.viz-tile[data-kind="${row.key}"][data-variant="${variant.key}"]`
      );
      const item = hydrateTile(tile, sceneName, sceneSlug, row, variant);
      lightboxItems.push(item);
    });
  });

  lightboxItems.forEach((item, index) => {
    item.tile.addEventListener("click", () => {
      if (!item.tile.classList.contains("has-image")) {
        return;
      }
      openLightbox(lightboxItems, index);
    });
  });

  return node;
}

function init() {
  setupLightbox();
  const sceneList = document.getElementById("scene-list");
  sceneNames.forEach((sceneName) => {
    sceneList.appendChild(buildSceneCard(sceneName));
  });
}

init();
