# Map Exploration Tools — Implementation Guide

This project is a **map explorer first**. The route planner is not shown by default, and no default markers are added to the map.

## Controls
- **Rotate:** use map drag rotation or the ±30° buttons; click the compass to restore north without changing center or zoom.
- **Fullscreen:** use the map toolbar; the entire application shell enters fullscreen so controls remain usable.
- **Globe:** toggle MapLibre's globe projection without recreating the map.
- **Scale:** the bottom-left bar uses metric units and updates with map movement.
- **Hybrid imagery:** choose historical EOX Sentinel-2 Cloudless 2016 (CC BY 4.0, native zoom ≤13) or NASA Blue Marble (native zoom ≤8), under vector labels. Neither is current sub-meter imagery.
- **Share:** copies a URL with center, zoom, pitch and bearing; opening the URL restores the view.
- **Screenshot:** exports a canvas PNG and includes text attribution. Export can fail if a provider taints canvas due to CORS.

## Drawing tools
Open **Explore & Draw** from the map toolbar. The panel remains optional.

| Mode | Action |
|---|---|
| Explore | Normal map pan/zoom |
| Select | Click an annotation; Shift-click for multi-selection |
| Point | Click to add a point |
| Bookmark | Click to save a place locally (gold marker) |
| Line | Click multiple vertices, then Finish (Enter) |
| Polygon | Click 3+ vertices, then Finish (Enter) |
| Radius | Click the center, then click the outer radius |
| Nearest | Click the map to find the closest **saved annotation** |
| Edit vertices | Select a shape, then drag white vertex handles |

**Advanced basemap layers:** use the Layers panel → Advanced layer order for searching by layer/source, filtering layer type, visibility switches, ordering, and restoring original style order. Custom ordering resets when changing map style.

**Editing** supports insertion of a vertex at the longest segment midpoint, splitting lines at a middle vertex, and merging two nearby lines when endpoints are within 50 meters. Polygon splitting and topological union are not provided.

**Undo/Redo:** Ctrl/Cmd+Z, Ctrl/Cmd+Y or Cmd+Shift+Z; 50 committed snapshot states per browser session.

**Exports:** GeoJSON for all saved shapes, and PNG for the current map view.

**Nearest:** searches saved annotations and currently rendered POI symbol features (not all POIs worldwide).

**Storage:** Annotations are kept in `localStorage` (key `coreor-maps-annotations-v1`) on the current browser/device. This is not an authenticated multi-device cloud sync service.

## Accuracy and licensing
Distance is calculated using the spherical haversine formula; polygons use spherical area approximation and closed perimeters. For legal or surveying-grade measurements, use specialized GIS tools with an appropriate projected CRS and geodesic library.

OpenStreetMap attribution stays visible in the map and is embedded in screenshot exports. NASA Blue Marble data is attributed separately. Source availability, API quotas, imagery detail and licensing must be revalidated before commercial distribution.

## Acceptance gates
- [x] Geometry unit tests
- [x] TypeScript check and production build (GitHub Actions)
- [x] Worker responses checked in both development and production CI
- [ ] Real-browser drawing/dragging interactions on desktop
- [ ] Mobile touch/pointer and accessibility pass
- [ ] Fullscreen and globe cross-browser testing
- [ ] Visual regression for all map themes
- [ ] Satellite source response and CORS testing

Roadmap issues: MAP-011, 012, 013, 017–025, 091–099, 103. See PR #146.
