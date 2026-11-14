# Coreor Maps — Development Roadmap

> **144 GitHub Issues created and individually tracked.** First ten issues are **In Review**, not closed: draft PR #1 contains initial implementation, but visual and feature-level acceptance is still pending.

## Product standards
- Map exploration is the default experience. Routing and markers appear only after explicit user action.
- AMOLED-black interface, compact controls, responsive layouts and polished motion with reduced-motion support.
- Prefer open-source GIS tooling and transparent source attribution. Do not fabricate traffic, elevation or places.
- Reusable SDK-ready architecture; explicit testing, security, privacy and operating costs.

## GitHub Projects configuration

| Field | Values |
|---|---|
| Status | Backlog, Ready, In Progress, In Review, Done, Blocked |
| Priority | P0, P1, P2, P3 |
| Phase | 1 — Map, 2 — Search, 3 — Routing, 4 — Layers, 5 — Spatial, 6 — Realtime, 7 — API |
| Area | Map Experience, Places & Search, Routing & Navigation, Map Layers, Spatial Tools, Realtime Maps, Maps API & Developer Platform |

Suggested views: **Roadmap**, **Board by Status**, **Priority**, **Area**, **Current Sprint**, **Releases**.

## Release gates
- An issue enters **In Review** after implementation and passing automated checks.
- An issue reaches **Done** only when the feature-specific criteria, production build, mobile/desktop UX, accessibility, real-map browser verification and code review pass.
- Draft PR #1: https://github.com/battincik/maps.coreor.net/pull/1

## All 144 trackable features

### Map Experience — Phase 1

| ID | Issue | Feature | Priority | Status |
|---|---|---|---|---|
| MAP-001 | [#2](https://github.com/battincik/maps.coreor.net/issues/2) | 2D and 3D map mode switching | P0 | In Review |
| MAP-002 | [#3](https://github.com/battincik/maps.coreor.net/issues/3) | Extruded buildings with real-world heights | P0 | In Review |
| MAP-003 | [#4](https://github.com/battincik/maps.coreor.net/issues/4) | 3D terrain elevation and hillshading | P0 | In Review |
| MAP-004 | [#5](https://github.com/battincik/maps.coreor.net/issues/5) | Zoom-aware smart label density | P0 | In Review |
| MAP-005 | [#6](https://github.com/battincik/maps.coreor.net/issues/6) | Customizable road colors and widths | P0 | In Review |
| MAP-006 | [#7](https://github.com/battincik/maps.coreor.net/issues/7) | Road hierarchy: motorways, avenues and streets | P0 | In Review |
| MAP-007 | [#8](https://github.com/battincik/maps.coreor.net/issues/8) | Distinct park, forest, water and land-use layers | P0 | In Review |
| MAP-008 | [#9](https://github.com/battincik/maps.coreor.net/issues/9) | Category-specific POI icons | P0 | In Review |
| MAP-009 | [#10](https://github.com/battincik/maps.coreor.net/issues/10) | Turkish and English map labels | P0 | In Review |
| MAP-010 | [#11](https://github.com/battincik/maps.coreor.net/issues/11) | Smooth camera and navigation animations | P0 | In Review |
| MAP-011 | [#12](https://github.com/battincik/maps.coreor.net/issues/12) | Free camera rotation | P1 | Backlog |
| MAP-012 | [#13](https://github.com/battincik/maps.coreor.net/issues/13) | Reset map orientation to north | P1 | Backlog |
| MAP-013 | [#14](https://github.com/battincik/maps.coreor.net/issues/14) | Full-screen map mode | P1 | Backlog |
| MAP-014 | [#15](https://github.com/battincik/maps.coreor.net/issues/15) | Visual map style editor | P1 | Backlog |
| MAP-015 | [#16](https://github.com/battincik/maps.coreor.net/issues/16) | Save personal map themes | P1 | Backlog |
| MAP-016 | [#17](https://github.com/battincik/maps.coreor.net/issues/17) | Import and export style JSON | P1 | Backlog |
| MAP-017 | [#18](https://github.com/battincik/maps.coreor.net/issues/18) | Reorder map layers | P1 | Backlog |
| MAP-018 | [#19](https://github.com/battincik/maps.coreor.net/issues/19) | Hybrid satellite imagery with street labels | P1 | Backlog |
| MAP-019 | [#20](https://github.com/battincik/maps.coreor.net/issues/20) | Globe projection view | P1 | Backlog |
| MAP-020 | [#21](https://github.com/battincik/maps.coreor.net/issues/21) | Scalebar and map scale | P1 | Backlog |
| MAP-021 | [#22](https://github.com/battincik/maps.coreor.net/issues/22) | Measure distance on the map | P1 | Backlog |
| MAP-022 | [#23](https://github.com/battincik/maps.coreor.net/issues/23) | Measure area and perimeter | P1 | Backlog |
| MAP-023 | [#24](https://github.com/battincik/maps.coreor.net/issues/24) | Export map screenshots | P1 | Backlog |
| MAP-024 | [#25](https://github.com/battincik/maps.coreor.net/issues/25) | Saved places and bookmarks | P1 | Backlog |
| MAP-025 | [#26](https://github.com/battincik/maps.coreor.net/issues/26) | Share map viewport with URL | P1 | Backlog |

### Places & Search — Phase 2

| ID | Issue | Feature | Priority | Status |
|---|---|---|---|---|
| MAP-026 | [#27](https://github.com/battincik/maps.coreor.net/issues/27) | Search-as-you-type autocomplete | P1 | Backlog |
| MAP-027 | [#28](https://github.com/battincik/maps.coreor.net/issues/28) | Search cities, districts, neighborhoods and streets | P1 | Backlog |
| MAP-028 | [#29](https://github.com/battincik/maps.coreor.net/issues/29) | Reverse geocode map coordinates | P1 | Backlog |
| MAP-029 | [#30](https://github.com/battincik/maps.coreor.net/issues/30) | Discover nearby places | P1 | Backlog |
| MAP-030 | [#31](https://github.com/battincik/maps.coreor.net/issues/31) | Filter POIs by category | P1 | Backlog |
| MAP-031 | [#32](https://github.com/battincik/maps.coreor.net/issues/32) | Search within current map viewport | P1 | Backlog |
| MAP-032 | [#33](https://github.com/battincik/maps.coreor.net/issues/33) | Recent search history | P1 | Backlog |
| MAP-033 | [#34](https://github.com/battincik/maps.coreor.net/issues/34) | Favorite places and home/work shortcuts | P1 | Backlog |
| MAP-034 | [#35](https://github.com/battincik/maps.coreor.net/issues/35) | Detailed place information panel | P1 | Backlog |
| MAP-035 | [#36](https://github.com/battincik/maps.coreor.net/issues/36) | Search directly using coordinates | P1 | Backlog |
| MAP-036 | [#37](https://github.com/battincik/maps.coreor.net/issues/37) | Support Open Location Code / Plus Codes | P1 | Backlog |
| MAP-037 | [#38](https://github.com/battincik/maps.coreor.net/issues/38) | Find similar places nearby | P1 | Backlog |
| MAP-038 | [#39](https://github.com/battincik/maps.coreor.net/issues/39) | Multilingual address and POI search | P1 | Backlog |
| MAP-039 | [#40](https://github.com/battincik/maps.coreor.net/issues/40) | Normalize and deduplicate addresses | P1 | Backlog |
| MAP-040 | [#41](https://github.com/battincik/maps.coreor.net/issues/41) | Share locations and GeoJSON points | P1 | Backlog |

### Routing & Navigation — Phase 3

| ID | Issue | Feature | Priority | Status |
|---|---|---|---|---|
| MAP-041 | [#42](https://github.com/battincik/maps.coreor.net/issues/42) | Point-to-point and multi-stop route planning | P2 | Backlog |
| MAP-042 | [#43](https://github.com/battincik/maps.coreor.net/issues/43) | Alternative routes by travel preference | P2 | Backlog |
| MAP-043 | [#44](https://github.com/battincik/maps.coreor.net/issues/44) | Driving, walking, cycling and transit profiles | P2 | Backlog |
| MAP-044 | [#45](https://github.com/battincik/maps.coreor.net/issues/45) | Avoid tolls, highways and ferries | P2 | Backlog |
| MAP-045 | [#46](https://github.com/battincik/maps.coreor.net/issues/46) | Analyze elevation, grade and road surface | P2 | Backlog |
| MAP-046 | [#47](https://github.com/battincik/maps.coreor.net/issues/47) | Turn-by-turn route instructions | P2 | Backlog |
| MAP-047 | [#48](https://github.com/battincik/maps.coreor.net/issues/48) | Estimated arrival, distance and cost | P2 | Backlog |
| MAP-048 | [#49](https://github.com/battincik/maps.coreor.net/issues/49) | GPS trace map matching | P2 | Backlog |
| MAP-049 | [#50](https://github.com/battincik/maps.coreor.net/issues/50) | Follow-user navigation camera | P2 | Backlog |
| MAP-050 | [#51](https://github.com/battincik/maps.coreor.net/issues/51) | Automatic route recalculation | P2 | Backlog |
| MAP-051 | [#52](https://github.com/battincik/maps.coreor.net/issues/52) | Travel time and distance matrices | P2 | Backlog |
| MAP-052 | [#53](https://github.com/battincik/maps.coreor.net/issues/53) | Optimize multi-stop visit order | P2 | Backlog |
| MAP-053 | [#54](https://github.com/battincik/maps.coreor.net/issues/54) | Isochrone / reachable area polygons | P2 | Backlog |
| MAP-054 | [#55](https://github.com/battincik/maps.coreor.net/issues/55) | Import and export GPX/KML routes | P2 | Backlog |
| MAP-055 | [#56](https://github.com/battincik/maps.coreor.net/issues/56) | Save and share route plans | P2 | Backlog |
| MAP-056 | [#57](https://github.com/battincik/maps.coreor.net/issues/57) | Discover POIs along a route | P2 | Backlog |
| MAP-057 | [#58](https://github.com/battincik/maps.coreor.net/issues/58) | Traffic-aware routing when data is available | P2 | Backlog |
| MAP-058 | [#59](https://github.com/battincik/maps.coreor.net/issues/59) | Replay recorded journeys | P2 | Backlog |

### Map Layers — Phase 4

| ID | Issue | Feature | Priority | Status |
|---|---|---|---|---|
| MAP-059 | [#60](https://github.com/battincik/maps.coreor.net/issues/60) | Building footprints | P2 | Backlog |
| MAP-060 | [#61](https://github.com/battincik/maps.coreor.net/issues/61) | Building height coverage | P2 | Backlog |
| MAP-061 | [#62](https://github.com/battincik/maps.coreor.net/issues/62) | Land-use classification | P2 | Backlog |
| MAP-062 | [#63](https://github.com/battincik/maps.coreor.net/issues/63) | Road network layers | P2 | Backlog |
| MAP-063 | [#64](https://github.com/battincik/maps.coreor.net/issues/64) | Bicycle lanes | P2 | Backlog |
| MAP-064 | [#65](https://github.com/battincik/maps.coreor.net/issues/65) | Pedestrian paths | P2 | Backlog |
| MAP-065 | [#66](https://github.com/battincik/maps.coreor.net/issues/66) | Parking locations | P2 | Backlog |
| MAP-066 | [#67](https://github.com/battincik/maps.coreor.net/issues/67) | EV charging stations | P2 | Backlog |
| MAP-067 | [#68](https://github.com/battincik/maps.coreor.net/issues/68) | Bridges and tunnels | P2 | Backlog |
| MAP-068 | [#69](https://github.com/battincik/maps.coreor.net/issues/69) | Administrative boundaries | P2 | Backlog |
| MAP-069 | [#70](https://github.com/battincik/maps.coreor.net/issues/70) | Public transport routes | P2 | Backlog |
| MAP-070 | [#71](https://github.com/battincik/maps.coreor.net/issues/71) | Bus and train stops | P2 | Backlog |
| MAP-071 | [#72](https://github.com/battincik/maps.coreor.net/issues/72) | Traffic congestion | P2 | Backlog |
| MAP-072 | [#73](https://github.com/battincik/maps.coreor.net/issues/73) | Road closures | P2 | Backlog |
| MAP-073 | [#74](https://github.com/battincik/maps.coreor.net/issues/74) | Roadworks and incidents | P2 | Backlog |
| MAP-074 | [#75](https://github.com/battincik/maps.coreor.net/issues/75) | Cycling network | P2 | Backlog |
| MAP-075 | [#76](https://github.com/battincik/maps.coreor.net/issues/76) | Speed limits | P2 | Backlog |
| MAP-076 | [#77](https://github.com/battincik/maps.coreor.net/issues/77) | Transport accessibility | P2 | Backlog |
| MAP-077 | [#78](https://github.com/battincik/maps.coreor.net/issues/78) | Parks and forests | P2 | Backlog |
| MAP-078 | [#79](https://github.com/battincik/maps.coreor.net/issues/79) | Lakes and rivers | P2 | Backlog |
| MAP-079 | [#80](https://github.com/battincik/maps.coreor.net/issues/80) | Terrain elevation and slope | P2 | Backlog |
| MAP-080 | [#81](https://github.com/battincik/maps.coreor.net/issues/81) | Air quality | P2 | Backlog |
| MAP-081 | [#82](https://github.com/battincik/maps.coreor.net/issues/82) | Weather conditions | P2 | Backlog |
| MAP-082 | [#83](https://github.com/battincik/maps.coreor.net/issues/83) | Precipitation radar | P2 | Backlog |
| MAP-083 | [#84](https://github.com/battincik/maps.coreor.net/issues/84) | Flood and earthquake risk zones | P2 | Backlog |
| MAP-084 | [#85](https://github.com/battincik/maps.coreor.net/issues/85) | Land cover | P2 | Backlog |
| MAP-085 | [#86](https://github.com/battincik/maps.coreor.net/issues/86) | Custom GeoJSON uploads | P2 | Backlog |
| MAP-086 | [#87](https://github.com/battincik/maps.coreor.net/issues/87) | Live device locations | P2 | Backlog |
| MAP-087 | [#88](https://github.com/battincik/maps.coreor.net/issues/88) | Geofencing regions | P2 | Backlog |
| MAP-088 | [#89](https://github.com/battincik/maps.coreor.net/issues/89) | Heatmap overlays | P2 | Backlog |
| MAP-089 | [#90](https://github.com/battincik/maps.coreor.net/issues/90) | Custom vector tile sources | P2 | Backlog |
| MAP-090 | [#91](https://github.com/battincik/maps.coreor.net/issues/91) | User-defined POIs | P2 | Backlog |

### Spatial Tools — Phase 5

| ID | Issue | Feature | Priority | Status |
|---|---|---|---|---|
| MAP-091 | [#92](https://github.com/battincik/maps.coreor.net/issues/92) | Draw point features | P2 | Backlog |
| MAP-092 | [#93](https://github.com/battincik/maps.coreor.net/issues/93) | Draw lines and paths | P2 | Backlog |
| MAP-093 | [#94](https://github.com/battincik/maps.coreor.net/issues/94) | Draw polygons | P2 | Backlog |
| MAP-094 | [#95](https://github.com/battincik/maps.coreor.net/issues/95) | Draw circles and radius buffers | P2 | Backlog |
| MAP-095 | [#96](https://github.com/battincik/maps.coreor.net/issues/96) | Calculate area and perimeter | P2 | Backlog |
| MAP-096 | [#97](https://github.com/battincik/maps.coreor.net/issues/97) | Measure distances between points | P2 | Backlog |
| MAP-097 | [#98](https://github.com/battincik/maps.coreor.net/issues/98) | Select multiple map features | P2 | Backlog |
| MAP-098 | [#99](https://github.com/battincik/maps.coreor.net/issues/99) | Edit, split and merge geometry | P2 | Backlog |
| MAP-099 | [#100](https://github.com/battincik/maps.coreor.net/issues/100) | Undo and redo map edits | P2 | Backlog |
| MAP-100 | [#101](https://github.com/battincik/maps.coreor.net/issues/101) | Export GeoJSON | P2 | Backlog |
| MAP-101 | [#102](https://github.com/battincik/maps.coreor.net/issues/102) | Import KML and GPX files | P2 | Backlog |
| MAP-102 | [#103](https://github.com/battincik/maps.coreor.net/issues/103) | Generate point density heatmaps | P2 | Backlog |
| MAP-103 | [#104](https://github.com/battincik/maps.coreor.net/issues/104) | Find nearest features | P2 | Backlog |
| MAP-104 | [#105](https://github.com/battincik/maps.coreor.net/issues/105) | Point-in-polygon queries | P2 | Backlog |
| MAP-105 | [#106](https://github.com/battincik/maps.coreor.net/issues/106) | Polygon intersection analysis | P2 | Backlog |
| MAP-106 | [#107](https://github.com/battincik/maps.coreor.net/issues/107) | Search POIs along route corridors | P2 | Backlog |
| MAP-107 | [#108](https://github.com/battincik/maps.coreor.net/issues/108) | Grid and hexagon aggregation | P2 | Backlog |
| MAP-108 | [#109](https://github.com/battincik/maps.coreor.net/issues/109) | Filter geospatial data by time range | P2 | Backlog |

### Realtime Maps — Phase 6

| ID | Issue | Feature | Priority | Status |
|---|---|---|---|---|
| MAP-109 | [#110](https://github.com/battincik/maps.coreor.net/issues/110) | Live position updates via WebSockets | P2 | Backlog |
| MAP-110 | [#111](https://github.com/battincik/maps.coreor.net/issues/111) | Track multiple devices on a map | P2 | Backlog |
| MAP-111 | [#112](https://github.com/battincik/maps.coreor.net/issues/112) | Location history and timeline | P2 | Backlog |
| MAP-112 | [#113](https://github.com/battincik/maps.coreor.net/issues/113) | GPS accuracy circles | P2 | Backlog |
| MAP-113 | [#114](https://github.com/battincik/maps.coreor.net/issues/114) | Movement heading and speed indicators | P2 | Backlog |
| MAP-114 | [#115](https://github.com/battincik/maps.coreor.net/issues/115) | Last-seen device timestamps | P2 | Backlog |
| MAP-115 | [#116](https://github.com/battincik/maps.coreor.net/issues/116) | Expiring location sharing links | P2 | Backlog |
| MAP-116 | [#117](https://github.com/battincik/maps.coreor.net/issues/117) | Geofence entry and exit events | P2 | Backlog |
| MAP-117 | [#118](https://github.com/battincik/maps.coreor.net/issues/118) | Location-triggered notifications | P2 | Backlog |
| MAP-118 | [#119](https://github.com/battincik/maps.coreor.net/issues/119) | Driving walking and stationary detection | P2 | Backlog |
| MAP-119 | [#120](https://github.com/battincik/maps.coreor.net/issues/120) | Journey replay animations | P2 | Backlog |
| MAP-120 | [#121](https://github.com/battincik/maps.coreor.net/issues/121) | Cluster thousands of live points | P2 | Backlog |
| MAP-121 | [#122](https://github.com/battincik/maps.coreor.net/issues/122) | Location data latency and quality metrics | P2 | Backlog |
| MAP-122 | [#123](https://github.com/battincik/maps.coreor.net/issues/123) | Real-time IoT and sensor overlays | P2 | Backlog |
| MAP-123 | [#124](https://github.com/battincik/maps.coreor.net/issues/124) | User and organization-level layer permissions | P2 | Backlog |

### Maps API & Developer Platform — Phase 7

| ID | Issue | Feature | Priority | Status |
|---|---|---|---|---|
| MAP-124 | [#125](https://github.com/battincik/maps.coreor.net/issues/125) | API key management | P2 | Backlog |
| MAP-125 | [#126](https://github.com/battincik/maps.coreor.net/issues/126) | OAuth2 integration | P2 | Backlog |
| MAP-126 | [#127](https://github.com/battincik/maps.coreor.net/issues/127) | Fine-grained API scopes | P2 | Backlog |
| MAP-127 | [#128](https://github.com/battincik/maps.coreor.net/issues/128) | Allowed domain and origin restrictions | P2 | Backlog |
| MAP-128 | [#129](https://github.com/battincik/maps.coreor.net/issues/129) | Per-application usage quotas | P2 | Backlog |
| MAP-129 | [#130](https://github.com/battincik/maps.coreor.net/issues/130) | API usage analytics | P2 | Backlog |
| MAP-130 | [#131](https://github.com/battincik/maps.coreor.net/issues/131) | OpenAPI 3.1 documentation | P2 | Backlog |
| MAP-131 | [#132](https://github.com/battincik/maps.coreor.net/issues/132) | Webhook event delivery | P2 | Backlog |
| MAP-132 | [#133](https://github.com/battincik/maps.coreor.net/issues/133) | WebSocket streaming API | P2 | Backlog |
| MAP-133 | [#134](https://github.com/battincik/maps.coreor.net/issues/134) | GeoJSON REST API | P2 | Backlog |
| MAP-134 | [#135](https://github.com/battincik/maps.coreor.net/issues/135) | Vector tile API | P2 | Backlog |
| MAP-135 | [#136](https://github.com/battincik/maps.coreor.net/issues/136) | Map style API | P2 | Backlog |
| MAP-136 | [#137](https://github.com/battincik/maps.coreor.net/issues/137) | Request caching and CDN strategy | P2 | Backlog |
| MAP-137 | [#138](https://github.com/battincik/maps.coreor.net/issues/138) | API versioning and compatibility | P2 | Backlog |
| MAP-138 | [#139](https://github.com/battincik/maps.coreor.net/issues/139) | Developer dashboard | P2 | Backlog |
| MAP-139 | [#140](https://github.com/battincik/maps.coreor.net/issues/140) | Interactive API playground | P2 | Backlog |
| MAP-140 | [#141](https://github.com/battincik/maps.coreor.net/issues/141) | Multi-tenant organization isolation | P2 | Backlog |
| MAP-141 | [#142](https://github.com/battincik/maps.coreor.net/issues/142) | Request IDs and distributed tracing | P2 | Backlog |
| MAP-142 | [#143](https://github.com/battincik/maps.coreor.net/issues/143) | Service health and readiness checks | P2 | Backlog |
| MAP-143 | [#144](https://github.com/battincik/maps.coreor.net/issues/144) | Swappable provider adapters | P2 | Backlog |
| MAP-144 | [#145](https://github.com/battincik/maps.coreor.net/issues/145) | Consistent API error contract | P2 | Backlog |

## Project onboarding
The connected GitHub integration cannot write GitHub Projects V2 items. To populate a board, create a Project in the repository's Projects section and bulk-add issues from this repository. Use the CSV as a reference for custom fields and grouping; no board mutations have been made.
