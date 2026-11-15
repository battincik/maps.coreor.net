import type {Map as MapInstance} from 'maplibre-gl';
const SOURCE='coreor-nasa-blue-marble';
const LAYER='coreor-hybrid-imagery';
/** NASA Blue Marble is global/continental low-resolution imagery, not street-level satellite coverage. */
export function syncHybridImagery(map:MapInstance,enabled:boolean){
  if(!map.isStyleLoaded())return;
  if(!enabled){
    if(map.getLayer(LAYER))map.removeLayer(LAYER);
    if(map.getSource(SOURCE))map.removeSource(SOURCE);
    return;
  }
  if(!map.getSource(SOURCE))map.addSource(SOURCE,{
    type:'raster',
    tiles:['https://gibs.earthdata.nasa.gov/wmts/epsg3857/best/BlueMarble_NextGeneration/default/GoogleMapsCompatible_Level8/{z}/{y}/{x}.jpeg'],
    tileSize:256,minzoom:0,maxzoom:8,attribution:'Imagery: NASA GIBS / Blue Marble Next Generation'
  });
  if(!map.getLayer(LAYER)){
    const firstLabel=map.getStyle().layers.find(layer=>layer.type==='symbol')?.id;
    map.addLayer({id:LAYER,type:'raster',source:SOURCE,paint:{'raster-opacity':.85,'raster-fade-duration':200}},firstLabel);
  }
}
