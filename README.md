# 3dgs-ellipse-viewer

Static webpage for comparing per-view 2D Gaussian ellipse visualizations across 9 Mip-NeRF 360 scenes.

## Published page

Visit the live page here:

https://tail-3lbs.github.io/3DGSEllipseViewer/

## Layout

Each scene renders a 3x2 comparison grid:

- columns: `colmap init`, `trained model`
- rows: `point clouds`, `ellipses`, `rendered`

That means each scene expects 6 images.

## Image convention

The page is already wired to look for images at:

```text
assets/scenes/<scene-slug>/colmap_point_clouds.png
assets/scenes/<scene-slug>/trained_point_clouds.png
assets/scenes/<scene-slug>/colmap_ellipses.png
assets/scenes/<scene-slug>/trained_ellipses.png
assets/scenes/<scene-slug>/colmap_rendered.png
assets/scenes/<scene-slug>/trained_rendered.png
```

Current scene slugs are generated from the names in `assets/app.js`:

- `scene-01`
- `scene-02`
- `scene-03`
- `scene-04`
- `scene-05`
- `scene-06`
- `scene-07`
- `scene-08`
- `scene-09`

## Next edits

- Replace the generic scene names in `assets/app.js` with your real 9 scene names.
- Drop images into `assets/scenes/<scene-slug>/`.
- Open `index.html` in a browser, or serve the folder with any static file server.
