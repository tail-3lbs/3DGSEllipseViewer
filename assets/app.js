const sceneNames = [
  "Scene 01",
  "Scene 02",
  "Scene 03",
  "Scene 04",
  "Scene 05",
  "Scene 06",
  "Scene 07",
  "Scene 08",
  "Scene 09",
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

async function hydrateTile(tile, sceneSlug, row, variant) {
  const path = expectedPath(sceneSlug, variant.key, row.key);
  const img = tile.querySelector("img");
  const caption = tile.querySelector("figcaption");

  img.alt = `${sceneSlug} ${variant.label} ${row.label}`;
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
}

function buildSceneCard(sceneName) {
  const sceneSlug = slugify(sceneName);
  const template = document.getElementById("scene-template");
  const node = template.content.firstElementChild.cloneNode(true);

  node.querySelector(".scene-title").textContent = sceneName;
  node.querySelector(".scene-slug").textContent = sceneSlug;

  rows.forEach((row) => {
    variants.forEach((variant) => {
      const tile = node.querySelector(
        `.viz-tile[data-kind="${row.key}"][data-variant="${variant.key}"]`
      );
      hydrateTile(tile, sceneSlug, row, variant);
    });
  });

  return node;
}

function init() {
  const sceneList = document.getElementById("scene-list");
  sceneNames.forEach((sceneName) => {
    sceneList.appendChild(buildSceneCard(sceneName));
  });
}

init();
