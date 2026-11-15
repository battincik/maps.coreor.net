import type {Map as MapInstance} from 'maplibre-gl';
export type ImageryProvider='sentinel'|'nasa';
const LAYER='coreor-hybrid-imagery';
const providers={
 sentinel:{id:'coreor-sentinel-2016',url:'https://tiles.maps.eox.at/wmts/1.0.0/s2cloudless_3857/default/g/{z}/{y}/{x}.jpg',maxzoom:13,attribution:'EOxCloudless https://cloudless.eox.at by EOX IT Services GmbH (Contains modified Copernicus Sentinel data 2016 & 2017) · CC BY 4.0'},
 nasa:{id:'coreor-nasa-blue-marble',url:'https://gibs.earthdata.nasa.gov/wmts/epsg3857/best/BlueMarble_NextGeneration/default/GoogleMapsCompatible_Level8/{z}/{y}/{x}.jpeg',maxzoom:8,attribution:'NASA GIBS / Blue Marble Next Generation'}
};
/** Sentinel 2016 CC BY 4.0 permits commercial use with attribution. Newer EOX mosaics do not. */
export function syncHybridImagery(map:MapInstance,enabled:boolean,provider:ImageryProvider='sentinel'){
 if(!map.isStyleLoaded())return;
 if(map.getLayer(LAYER))map.removeLayer(LAYER);
 for(const item of Object.values(providers))if(map.getSource(item.id))map.removeSource(item.id);
 if(!enabled)return;
 const chosen=providers[provider];
 map.addSource(chosen.id,{type:'raster',tiles:[chosen.url],tileSize:256,minzoom:0,maxzoom:chosen.maxzoom,attribution:chosen.attribution});
 const symbol=map.getStyle().layers.find(x=>x.type==='symbol')?.id;
 map.addLayer({id:LAYER,type:'raster',source:chosen.id,paint:{'raster-opacity':.88,'raster-fade-duration':200}},symbol);
}
