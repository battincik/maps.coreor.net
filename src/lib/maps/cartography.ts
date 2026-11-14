import type { Map as MapInstance, ExpressionSpecification } from 'maplibre-gl';
import type { Locale, MapFilters } from './types';

/** All mutations are re-applied after style.load (styles replace their layers). */
export function applyCartography(map:MapInstance, filters:MapFilters, locale:Locale, roadColor:string, roadWidth:number) {
  const layers = map.getStyle()?.layers || [];
  for(const layer of layers) {
    const id=layer.id.toLowerCase();
    const isRoad = /road|highway|transportation|street/.test(id);
    const isMinor = /minor|service|path|track|pedestrian|residential/.test(id);
    const isPark = /park|wood|forest|grass|landcover|landuse/.test(id);
    const isWater = /water|lake|river/.test(id);
    const isPoi = /poi|hospital|school|shop|retail|amenity|place_of_worship/.test(id);
    const isLabel = layer.type==='symbol' && /label|name|place|poi/.test(id);
    const hide = (isRoad && (!filters.roads || (isMinor && !filters.minorRoads)))
      || (isPark && !filters.parks) || (isWater && !filters.water)
      || (isPoi && !filters.poi) || (isLabel && !filters.labels);
    try { map.setLayoutProperty(layer.id,'visibility',hide?'none':'visible'); } catch { /* unsupported layer */ }
    if(isRoad && layer.type==='line') {
      try {
        map.setPaintProperty(layer.id,'line-color',roadColor);
        const base = isMinor ? 0.65 : /motorway|trunk|primary|major/.test(id) ? 2.5 : 1.25;
        map.setPaintProperty(layer.id,'line-width',['interpolate',['linear'],['zoom'],8,Math.max(.3,base*.35*roadWidth),13,base*roadWidth,18,base*2.7*roadWidth]);
      } catch { /* expressive property from upstream may be unsupported */ }
    }
    if(layer.type==='symbol' && isLabel) {
      // OpenMapTiles properties: display a local name when available, otherwise fall back.
      const field:ExpressionSpecification = locale==='tr'
        ? ['coalesce',['get','name:tr'],['get','name'],['get','name:en'],'']
        : ['coalesce',['get','name:en'],['get','name:latin'],['get','name'],''];
      try { map.setLayoutProperty(layer.id,'text-field',field); } catch { /* label not using text */ }
      if(isPoi) {
        try { map.setLayoutProperty(layer.id,'text-size',['interpolate',['linear'],['zoom'],10,9,13,11,16,13,19,15]); } catch {}
      }
    }
  }
}

export function syncBuildings(map:MapInstance, enabled:boolean) {
  const id='coreor-3d-buildings';
  if(!enabled) { if(map.getLayer(id))map.removeLayer(id); return; }
  if(map.getLayer(id) || !map.getSource('openmaptiles'))return;
  map.addLayer({
    id,type:'fill-extrusion',source:'openmaptiles','source-layer':'building',minzoom:14,
    paint:{
      'fill-extrusion-color':'#8b929a',
      'fill-extrusion-opacity':.64,
      'fill-extrusion-height':['coalesce',['to-number',['get','render_height']],['to-number',['get','height']],10],
      'fill-extrusion-base':['coalesce',['to-number',['get','render_min_height']],['to-number',['get','min_height']],0]
    }
  });
}

const terrainSource='coreor-terrain-dem';
export function syncTerrain(map:MapInstance, enabled:boolean){
  if(!enabled) { map.setTerrain(null); return; }
  if(!map.getSource(terrainSource)) {
    map.addSource(terrainSource,{
      type:'raster-dem',
      tiles:['https://s3.amazonaws.com/elevation-tiles-prod/terrarium/{z}/{x}/{y}.png'],
      tileSize:256,maxzoom:15,encoding:'terrarium',
      attribution:'Elevation: Mapzen terrain tiles / AWS terrain tiles'
    });
  }
  map.setTerrain({source:terrainSource,exaggeration:1.1});
}
