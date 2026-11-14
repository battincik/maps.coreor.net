# Coreor Maps — 144-Feature Development Roadmap

## Product principles
- Map exploration first; routing is optional and hidden by default.
- AMOLED black UI, responsive layouts, meaningful Motion animations and reduced-motion support.
- Open-source geospatial stack where feasible; never fabricate traffic or missing place data.
- Reusable platform primitives for React, TypeScript, Swift and future Maps API services.
- A feature is **Done** only after implementation, CI, real-browser acceptance and review.

## Current progress
> MAP-001–MAP-010 have an initial implementation in draft PR #1 and remain **In Review**, not Done, pending acceptance. All other items are in the Backlog.

## Suggested GitHub Projects fields
| Field | Values |
|---|---|
| Status | Backlog, Ready, In Progress, In Review, Done, Blocked |
| Priority | P0, P1, P2, P3 |
| Phase | 1–7 |
| Area | Map Experience, Places & Search, Routing & Navigation, Map Layers, Spatial Tools, Realtime Maps, Maps API & Developer Platform |

## Feature catalog

### Map Experience (1–25)

- [ ] **MAP-001** — 2D and 3D map mode switching · P0 · In Review
- [ ] **MAP-002** — Extruded buildings with real-world heights · P0 · In Review
- [ ] **MAP-003** — 3D terrain elevation and hillshading · P0 · In Review
- [ ] **MAP-004** — Zoom-aware smart label density · P0 · In Review
- [ ] **MAP-005** — Customizable road colors and widths · P0 · In Review
- [ ] **MAP-006** — Road hierarchy: motorways, avenues and streets · P0 · In Review
- [ ] **MAP-007** — Distinct park, forest, water and land-use layers · P0 · In Review
- [ ] **MAP-008** — Category-specific POI icons · P0 · In Review
- [ ] **MAP-009** — Turkish and English map labels · P0 · In Review
- [ ] **MAP-010** — Smooth camera and navigation animations · P0 · In Review
- [ ] **MAP-011** — Free camera rotation · P1 · Backlog
- [ ] **MAP-012** — Reset map orientation to north · P1 · Backlog
- [ ] **MAP-013** — Full-screen map mode · P1 · Backlog
- [ ] **MAP-014** — Visual map style editor · P1 · Backlog
- [ ] **MAP-015** — Save personal map themes · P1 · Backlog
- [ ] **MAP-016** — Import and export style JSON · P1 · Backlog
- [ ] **MAP-017** — Reorder map layers · P1 · Backlog
- [ ] **MAP-018** — Hybrid satellite imagery with street labels · P1 · Backlog
- [ ] **MAP-019** — Globe projection view · P1 · Backlog
- [ ] **MAP-020** — Scalebar and map scale · P1 · Backlog
- [ ] **MAP-021** — Measure distance on the map · P1 · Backlog
- [ ] **MAP-022** — Measure area and perimeter · P1 · Backlog
- [ ] **MAP-023** — Export map screenshots · P1 · Backlog
- [ ] **MAP-024** — Saved places and bookmarks · P1 · Backlog
- [ ] **MAP-025** — Share map viewport with URL · P1 · Backlog

### Places & Search (26–40)

- [ ] **MAP-026** — Search-as-you-type autocomplete · P1 · Backlog
- [ ] **MAP-027** — Search cities, districts, neighborhoods and streets · P1 · Backlog
- [ ] **MAP-028** — Reverse geocode map coordinates · P1 · Backlog
- [ ] **MAP-029** — Discover nearby places · P1 · Backlog
- [ ] **MAP-030** — Filter POIs by category · P1 · Backlog
- [ ] **MAP-031** — Search within current map viewport · P1 · Backlog
- [ ] **MAP-032** — Recent search history · P1 · Backlog
- [ ] **MAP-033** — Favorite places and home/work shortcuts · P1 · Backlog
- [ ] **MAP-034** — Detailed place information panel · P1 · Backlog
- [ ] **MAP-035** — Search directly using coordinates · P1 · Backlog
- [ ] **MAP-036** — Support Open Location Code / Plus Codes · P1 · Backlog
- [ ] **MAP-037** — Find similar places nearby · P1 · Backlog
- [ ] **MAP-038** — Multilingual address and POI search · P1 · Backlog
- [ ] **MAP-039** — Normalize and deduplicate addresses · P1 · Backlog
- [ ] **MAP-040** — Share locations and GeoJSON points · P1 · Backlog

### Routing & Navigation (41–58)

- [ ] **MAP-041** — Point-to-point and multi-stop route planning · P2 · Backlog
- [ ] **MAP-042** — Alternative routes by travel preference · P2 · Backlog
- [ ] **MAP-043** — Driving, walking, cycling and transit profiles · P2 · Backlog
- [ ] **MAP-044** — Avoid tolls, highways and ferries · P2 · Backlog
- [ ] **MAP-045** — Analyze elevation, grade and road surface · P2 · Backlog
- [ ] **MAP-046** — Turn-by-turn route instructions · P2 · Backlog
- [ ] **MAP-047** — Estimated arrival, distance and cost · P2 · Backlog
- [ ] **MAP-048** — GPS trace map matching · P2 · Backlog
- [ ] **MAP-049** — Follow-user navigation camera · P2 · Backlog
- [ ] **MAP-050** — Automatic route recalculation · P2 · Backlog
- [ ] **MAP-051** — Travel time and distance matrices · P2 · Backlog
- [ ] **MAP-052** — Optimize multi-stop visit order · P2 · Backlog
- [ ] **MAP-053** — Isochrone / reachable area polygons · P2 · Backlog
- [ ] **MAP-054** — Import and export GPX/KML routes · P2 · Backlog
- [ ] **MAP-055** — Save and share route plans · P2 · Backlog
- [ ] **MAP-056** — Discover POIs along a route · P2 · Backlog
- [ ] **MAP-057** — Traffic-aware routing when data is available · P2 · Backlog
- [ ] **MAP-058** — Replay recorded journeys · P2 · Backlog

### Map Layers (59–90)

- [ ] **MAP-059** — Building footprints · P2 · Backlog
- [ ] **MAP-060** — Building height coverage · P2 · Backlog
- [ ] **MAP-061** — Land-use classification · P2 · Backlog
- [ ] **MAP-062** — Road network layers · P2 · Backlog
- [ ] **MAP-063** — Bicycle lanes · P2 · Backlog
- [ ] **MAP-064** — Pedestrian paths · P2 · Backlog
- [ ] **MAP-065** — Parking locations · P2 · Backlog
- [ ] **MAP-066** — EV charging stations · P2 · Backlog
- [ ] **MAP-067** — Bridges and tunnels · P2 · Backlog
- [ ] **MAP-068** — Administrative boundaries · P2 · Backlog
- [ ] **MAP-069** — Public transport routes · P2 · Backlog
- [ ] **MAP-070** — Bus and train stops · P2 · Backlog
- [ ] **MAP-071** — Traffic congestion · P2 · Backlog
- [ ] **MAP-072** — Road closures · P2 · Backlog
- [ ] **MAP-073** — Roadworks and incidents · P2 · Backlog
- [ ] **MAP-074** — Cycling network · P2 · Backlog
- [ ] **MAP-075** — Speed limits · P2 · Backlog
- [ ] **MAP-076** — Transport accessibility · P2 · Backlog
- [ ] **MAP-077** — Parks and forests · P2 · Backlog
- [ ] **MAP-078** — Lakes and rivers · P2 · Backlog
- [ ] **MAP-079** — Terrain elevation and slope · P2 · Backlog
- [ ] **MAP-080** — Air quality · P2 · Backlog
- [ ] **MAP-081** — Weather conditions · P2 · Backlog
- [ ] **MAP-082** — Precipitation radar · P2 · Backlog
- [ ] **MAP-083** — Flood and earthquake risk zones · P2 · Backlog
- [ ] **MAP-084** — Land cover · P2 · Backlog
- [ ] **MAP-085** — Custom GeoJSON uploads · P2 · Backlog
- [ ] **MAP-086** — Live device locations · P2 · Backlog
- [ ] **MAP-087** — Geofencing regions · P2 · Backlog
- [ ] **MAP-088** — Heatmap overlays · P2 · Backlog
- [ ] **MAP-089** — Custom vector tile sources · P2 · Backlog
- [ ] **MAP-090** — User-defined POIs · P2 · Backlog

### Spatial Tools (91–108)

- [ ] **MAP-091** — Draw point features · P2 · Backlog
- [ ] **MAP-092** — Draw lines and paths · P2 · Backlog
- [ ] **MAP-093** — Draw polygons · P2 · Backlog
- [ ] **MAP-094** — Draw circles and radius buffers · P2 · Backlog
- [ ] **MAP-095** — Calculate area and perimeter · P2 · Backlog
- [ ] **MAP-096** — Measure distances between points · P2 · Backlog
- [ ] **MAP-097** — Select multiple map features · P2 · Backlog
- [ ] **MAP-098** — Edit, split and merge geometry · P2 · Backlog
- [ ] **MAP-099** — Undo and redo map edits · P2 · Backlog
- [ ] **MAP-100** — Export GeoJSON · P2 · Backlog
- [ ] **MAP-101** — Import KML and GPX files · P2 · Backlog
- [ ] **MAP-102** — Generate point density heatmaps · P2 · Backlog
- [ ] **MAP-103** — Find nearest features · P2 · Backlog
- [ ] **MAP-104** — Point-in-polygon queries · P2 · Backlog
- [ ] **MAP-105** — Polygon intersection analysis · P2 · Backlog
- [ ] **MAP-106** — Search POIs along route corridors · P2 · Backlog
- [ ] **MAP-107** — Grid and hexagon aggregation · P2 · Backlog
- [ ] **MAP-108** — Filter geospatial data by time range · P2 · Backlog

### Realtime Maps (109–123)

- [ ] **MAP-109** — Live position updates via WebSockets · P2 · Backlog
- [ ] **MAP-110** — Track multiple devices on a map · P2 · Backlog
- [ ] **MAP-111** — Location history and timeline · P2 · Backlog
- [ ] **MAP-112** — GPS accuracy circles · P2 · Backlog
- [ ] **MAP-113** — Movement heading and speed indicators · P2 · Backlog
- [ ] **MAP-114** — Last-seen device timestamps · P2 · Backlog
- [ ] **MAP-115** — Expiring location sharing links · P2 · Backlog
- [ ] **MAP-116** — Geofence entry and exit events · P2 · Backlog
- [ ] **MAP-117** — Location-triggered notifications · P2 · Backlog
- [ ] **MAP-118** — Driving walking and stationary detection · P2 · Backlog
- [ ] **MAP-119** — Journey replay animations · P2 · Backlog
- [ ] **MAP-120** — Cluster thousands of live points · P2 · Backlog
- [ ] **MAP-121** — Location data latency and quality metrics · P2 · Backlog
- [ ] **MAP-122** — Real-time IoT and sensor overlays · P2 · Backlog
- [ ] **MAP-123** — User and organization-level layer permissions · P2 · Backlog

### Maps API & Developer Platform (124–144)

- [ ] **MAP-124** — API key management · P2 · Backlog
- [ ] **MAP-125** — OAuth2 integration · P2 · Backlog
- [ ] **MAP-126** — Fine-grained API scopes · P2 · Backlog
- [ ] **MAP-127** — Allowed domain and origin restrictions · P2 · Backlog
- [ ] **MAP-128** — Per-application usage quotas · P2 · Backlog
- [ ] **MAP-129** — API usage analytics · P2 · Backlog
- [ ] **MAP-130** — OpenAPI 3.1 documentation · P2 · Backlog
- [ ] **MAP-131** — Webhook event delivery · P2 · Backlog
- [ ] **MAP-132** — WebSocket streaming API · P2 · Backlog
- [ ] **MAP-133** — GeoJSON REST API · P2 · Backlog
- [ ] **MAP-134** — Vector tile API · P2 · Backlog
- [ ] **MAP-135** — Map style API · P2 · Backlog
- [ ] **MAP-136** — Request caching and CDN strategy · P2 · Backlog
- [ ] **MAP-137** — API versioning and compatibility · P2 · Backlog
- [ ] **MAP-138** — Developer dashboard · P2 · Backlog
- [ ] **MAP-139** — Interactive API playground · P2 · Backlog
- [ ] **MAP-140** — Multi-tenant organization isolation · P2 · Backlog
- [ ] **MAP-141** — Request IDs and distributed tracing · P2 · Backlog
- [ ] **MAP-142** — Service health and readiness checks · P2 · Backlog
- [ ] **MAP-143** — Swappable provider adapters · P2 · Backlog
- [ ] **MAP-144** — Consistent API error contract · P2 · Backlog

## Project migration
Each MAP-### item is tracked as an independent GitHub Issue. Add Issues to a GitHub Projects V2 board using the Project's Add items bulk selection; direct Project V2 edits are not exposed by the current integration.
