# 3dgs-ellipse-viewer

Static webpage for comparing per-view 2D Gaussian ellipse visualizations across 9 Mip-NeRF 360 scenes.

## Published page

Visit the live page here:

https://tail-3lbs.github.io/3DGSEllipseViewer/

## What the page shows

Each scene renders a 3x2 comparison grid:

- columns: `COLMAP init`, `Trained model`
- rows: `Point Clouds`, `Ellipses`, `Rendered`

Each scene therefore uses 6 images:

```text
colmap_point_clouds.png
trained_point_clouds.png
colmap_ellipses.png
trained_ellipses.png
colmap_rendered.png
trained_rendered.png
```

## Included scenes

The current site is populated with these 9 Mip-NeRF 360 scenes:

- `bicycle`
- `bonsai`
- `counter`
- `flowers`
- `garden`
- `kitchen`
- `room`
- `stump`
- `treehill`

## Interaction

- clicking a scene image opens an in-page lightbox
- left/right arrow keys navigate through the 6 images for that scene
- `Esc` closes the lightbox
- clicking a scene name updates the page hash and scrolls to that panel

## Repo contents

- `index.html`: page structure and lightbox container
- `assets/styles.css`: page styling and responsive layout
- `assets/app.js`: scene rendering, self-links, and lightbox behavior
- `assets/scenes/`: scene images used by the page
- `images/teaser.png`: top teaser image

## Local testing

Serve the folder with a local static server from the repo root:

```bash
cd /home/jiaqi/workspace/3dgs-ellipse-viewer
python3 -m http.server 8000
```

Then open:

```text
http://127.0.0.1:8000
```
