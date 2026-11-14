# Coreor Maps – 1–10 implementation checklist

## Scope
- [x] 1. 2D/3D button and pitch animation.
- [x] 2. Extruded building layer based on available OSM height attributes.
- [x] 3. Terrarium DEM terrain toggle (public elevation tile source required).
- [x] 4. Zoom-dependent POI text sizes.
- [x] 5. Road color + width controls.
- [x] 6. Major/minor road filters (layer-name matching).
- [x] 7. Park, forest and water visibility toggles.
- [x] 8. Category POIs preserved from upstream style; configurable POI visibility.
- [x] 9. Turkish/English label preference with source field fallback.
- [x] 10. Smooth easeTo camera transitions, reduced-motion fallback.
- [x] AMOLED black (#000) UI and isolated exploration panels.
- [x] Initial state does not render route markers or route panel.

## Validation still required on CI/browser
- [ ] npm install / npm run typecheck / npm run build
- [ ] Desktop Chrome/Firefox/Safari visual regression
- [ ] Mobile viewport, touch and keyboard usability
- [ ] DEM source response, CORS and attribution
- [ ] 3D-building height data coverage and layer ordering
- [ ] Full POI category icons (upstream style dependent)
- [ ] Zoom-dependent label collision and density in dense urban areas
- [ ] Motion and prefers-reduced-motion verification
- [ ] Upstream OpenFreeMap source and availability

## Notes
Roads are identified by upstream layer-name patterns, not a fully owned schema. A future self-host vector tile schema should provide stable per-class IDs. Search currently accepts coordinates only; address search awaits a dedicated geocoder. This is a map explorer, not a route-first UI.

## Hotfix: MapLibre v6 worker
- [x] Set an explicit same-origin worker URL before Map construction.
- [x] Copy worker and its shared ESM import on predev/prebuild.
- [ ] Verify /maplibre/maplibre-gl-worker.mjs serves JS (not HTML) after install.
- [ ] Verify /maplibre/maplibre-gl-shared.mjs serves JS.
- [ ] Browser smoke test: map tiles render without worker error.
