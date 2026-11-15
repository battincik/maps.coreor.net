'use client';
import {useCallback,useEffect,useRef,useState} from 'react';
import * as maplibregl from 'maplibre-gl';
import type {Map as MapInstance} from 'maplibre-gl';
import {AnimatePresence,motion,useReducedMotion} from 'motion/react';
import {Map, Layers, Box, Compass, Crosshair, ZoomIn, ZoomOut, X, MapPin, SlidersHorizontal, RotateCcw, Search, Globe2, Maximize2, Satellite, RotateCw} from 'lucide-react';
import MapTools from './MapTools';
import LayerManager from './LayerManager';
import {syncHybridImagery,type ImageryProvider} from '@/lib/maps/imagery';
import {applyCartography,syncBuildings,syncTerrain} from '@/lib/maps/cartography';
import {initialFilters,styleURL,themes,type Theme,type Locale,type MapFilters} from '@/lib/maps/types';

type Panel='layers'|'view'|'search'|null;
const DEFAULT_CENTER:[number,number]=[32.8597,39.9334];
const ANIMATION=850;

export default function MapExplorer() {
  const container=useRef<HTMLDivElement>(null);
  const mapRef=useRef<MapInstance|null>(null);
  const [ready,setReady]=useState(false);
  const [error,setError]=useState('');
  const [theme,setTheme]=useState<Theme>('dark');
  const [panel,setPanel]=useState<Panel>(null);
  const [filters,setFilters]=useState<MapFilters>(initialFilters);
  const [locale,setLocale]=useState<Locale>('tr');
  const [roadColor,setRoadColor]=useState('#7c8b99');
  const [roadWidth,setRoadWidth]=useState(1);
  const [threeD,setThreeD]=useState(false);
  const [terrain,setTerrain]=useState(false);
  const [query,setQuery]=useState('');
  const [zoom,setZoom]=useState(12.5);
  const [mapInstance,setMapInstance]=useState<MapInstance|null>(null);
  const [globe,setGlobe]=useState(false);
  const [hybrid,setHybrid]=useState(false);
  const [imageryProvider,setImageryProvider]=useState<ImageryProvider>('sentinel');
  const [bearing,setBearing]=useState(0);
  const prefersReducedMotion=useReducedMotion();
  const optionsRef=useRef({filters,locale,roadColor,roadWidth,threeD,terrain});
  optionsRef.current={filters,locale,roadColor,roadWidth,threeD,terrain};

  const apply=useCallback((map:MapInstance)=>{
    if(!map.isStyleLoaded()) return;
    const o=optionsRef.current;
    applyCartography(map,o.filters,o.locale,o.roadColor,o.roadWidth);
    syncBuildings(map,o.threeD && o.filters.buildings);
    try {syncTerrain(map,o.terrain);} catch(err) { console.warn('Terrain unavailable',err); }
  },[]);

  useEffect(()=>{
    if(!container.current || mapRef.current)return;
    // MapLibre v6 worker discovery can fail under Next.js Turbopack.
    // A same-origin Node.js route serves both the worker and its ESM dependency.
    maplibregl.setWorkerUrl('/api/maplibre/maplibre-gl-worker.mjs');
    const view = new URLSearchParams(window.location.search).get('view')?.split(',').map(Number);
    const valid = view?.length===5 && view.every(Number.isFinite) && Math.abs(view[0])<=180 && Math.abs(view[1])<=90 && view[2]>=0 && view[2]<=22;
    const map=new maplibregl.Map({
      container:container.current,style:styleURL('dark'),center:valid?[view![0],view![1]]:DEFAULT_CENTER,zoom:valid?view![2]:12.5,
      pitch:valid?Math.min(85,Math.max(0,view![4])):0,bearing:valid?view![3]:0,attributionControl:{compact:true},
      canvasContextAttributes:{preserveDrawingBuffer:true},
      cooperativeGestures:false,renderWorldCopies:true
    });
    mapRef.current=map;
    setMapInstance(map);
    map.addControl(new maplibregl.ScaleControl({unit:'metric',maxWidth:120}),'bottom-left');
    const onRotate=()=>setBearing(map.getBearing());
    map.on('rotateend',onRotate);
    const loaded=()=>{setReady(true);setError('');apply(map);};
    const failed=(e:maplibregl.ErrorEvent)=>{
      const msg=e.error?.message||'Harita verisi yüklenemedi';
      if(!map.isStyleLoaded())setError(msg);
    };
    const onZoom=()=>setZoom(map.getZoom());
    map.on('style.load',loaded);
    map.on('error',failed);
    map.on('zoomend',onZoom);
    return()=>{map.off('style.load',loaded);map.off('error',failed);map.off('zoomend',onZoom);map.off('rotateend',onRotate);map.remove();mapRef.current=null};
  },[apply]);

  useEffect(()=>{const map=mapRef.current;if(map?.isStyleLoaded())apply(map)},[filters,locale,roadColor,roadWidth,threeD,terrain,apply]);

  useEffect(()=>{
    const map=mapInstance;if(!map)return;
    const applyImagery=()=>{if(map.isStyleLoaded())syncHybridImagery(map,hybrid,imageryProvider)};
    map.on('style.load',applyImagery);applyImagery();
    return()=>{map.off('style.load',applyImagery);};
  },[mapInstance,hybrid,imageryProvider]);
  const toggleGlobe=()=>{
    const next=!globe;setGlobe(next);
    try { mapRef.current?.setProjection({type:next?'globe':'mercator'}); }
    catch {setError('Globe projection is unavailable for this map style.');setGlobe(false);}
  };
  const toggleFullscreen=async()=>{
    const el=mapRef.current?.getContainer().parentElement;if(!el)return;
    try {if(document.fullscreenElement)await document.exitFullscreen();else await el.requestFullscreen();requestAnimationFrame(()=>mapRef.current?.resize());}
    catch {setError('Fullscreen is not available on this device.');}
  };
  const setMapTheme=(next:Theme)=>{
    setTheme(next);setReady(false);setError('');
    mapRef.current?.setStyle(styleURL(next),{diff:false});
  };
  const animate=(options:maplibregl.EaseToOptions)=>{
    mapRef.current?.easeTo({...options,duration:prefersReducedMotion?0:ANIMATION,essential:false});
  };
  const toggle3D=()=>{setThreeD(v=>!v);animate({pitch:threeD?0:60,bearing:threeD?0:-17});};
  const goToMyLocation=()=>{
    if(!navigator.geolocation){setError('Konum hizmeti desteklenmiyor.');return;}
    navigator.geolocation.getCurrentPosition(({coords})=>{
      animate({center:[coords.longitude,coords.latitude],zoom:15,pitch:threeD?60:0});
    },()=>setError('Konum alınamadı. İzinleri kontrol et.'),{enableHighAccuracy:true,timeout:10000});
  };
  const adjustZoom=(delta:number)=>animate({zoom:(mapRef.current?.getZoom()??12)+delta});
  const changeFilter=(key:keyof MapFilters)=>setFilters(x=>({...x,[key]:!x[key]}));
  const compactMotion={initial:prefersReducedMotion?false:{opacity:0,x:-12,scale:.985},animate:{opacity:1,x:0,scale:1},exit:prefersReducedMotion?{opacity:0}:{opacity:0,x:-10,scale:.985},transition:{type:'spring' as const,stiffness:430,damping:38,mass:.8}};
  return <main className="shell">
    <div ref={container} className="map" role="application" aria-label="Etkileşimli Coreor haritası"/>
    <header className="header glass">
      <div className="brand"><span className="brand-mark"><Map size={18}/></span><strong>coreor<span> maps</span></strong></div>
      <button className="search-trigger" onClick={()=>setPanel(panel==='search'?null:'search')} aria-label="Harita arama"><Search size={17}/><span>Haritada keşfet</span><kbd>⌘ K</kbd></button>
      <div className="header-actions">
        <button onClick={()=>setPanel(panel==='view'?null:'view')} aria-label="Görünüm ayarları" title="Görünüm"><SlidersHorizontal size={18}/><span>Görünüm</span></button>
        <button onClick={()=>setPanel(panel==='layers'?null:'layers')} aria-label="Katmanları aç" title="Katmanlar"><Layers size={18}/><span>Katmanlar</span></button>
      </div>
    </header>
    <div className="map-actions" role="toolbar" aria-label="Map navigation controls">
      <button data-tooltip="Zoom in" aria-label="Zoom in" onClick={()=>adjustZoom(1)}><ZoomIn size={18}/></button>
      <button data-tooltip="Zoom out" aria-label="Zoom out" onClick={()=>adjustZoom(-1)}><ZoomOut size={18}/></button>
      <div className="action-break" role="separator"/>
      <button data-tooltip="My location" aria-label="Go to my location" onClick={goToMyLocation}><Crosshair size={18}/></button>
      <button data-tooltip="Rotate left · 30°" aria-label="Rotate map left by 30 degrees" onClick={()=>animate({bearing:(mapRef.current?.getBearing()??0)-30})}><RotateCcw size={18}/></button>
      <button data-tooltip="Rotate right · 30°" aria-label="Rotate map right by 30 degrees" onClick={()=>animate({bearing:(mapRef.current?.getBearing()??0)+30})}><RotateCw size={18}/></button>
      <button data-tooltip="Reset to north" aria-label="Reset north" onClick={()=>animate({bearing:0})}><Compass size={18} style={{transform:'rotate('+(-bearing)+'deg)'}}/></button>
      <button data-tooltip={threeD?'Switch to 2D':'Switch to 3D'} aria-label={threeD?'Switch to 2D':'Switch to 3D'} aria-pressed={threeD} className={threeD?'on':''} onClick={toggle3D}><Box size={18}/></button>
      <button data-tooltip={globe?'Switch to flat map':'Switch to globe'} aria-label={globe?'Switch to flat map':'Switch to globe'} aria-pressed={globe} className={globe?'on':''} onClick={toggleGlobe}><Globe2 size={18}/></button>
      <button data-tooltip={hybrid?'Disable satellite imagery':'Enable satellite imagery'} aria-label={hybrid?'Disable satellite imagery':'Enable satellite imagery'} aria-pressed={hybrid} className={hybrid?'on':''} onClick={()=>setHybrid(x=>!x)}><Satellite size={18}/></button>
      <button data-tooltip="Toggle fullscreen" aria-label="Toggle fullscreen" onClick={toggleFullscreen}><Maximize2 size={18}/></button>
      <button data-tooltip="Reset map view" aria-label="Reset map view" onClick={()=>animate({center:DEFAULT_CENTER,zoom:12.5,pitch:0,bearing:0})}><RotateCcw size={18}/></button>
    </div>
    <AnimatePresence mode="wait">
      {panel && <motion.aside key={panel} className="panel glass" {...compactMotion}>
        <div className="panel-head"><div><div className="eyebrow">COREOR MAPS</div><h2>{panel==='layers'?'Harita katmanları':panel==='view'?'Görünüm ayarları':'Harita araması'}</h2></div><button className="icon-button" onClick={()=>setPanel(null)} aria-label="Paneli kapat"><X size={18}/></button></div>
        {panel==='layers' && <div className="panel-body">
          <div className="section-title">Harita teması <span>{themes.length} stil</span></div>
          <div className="theme-grid">{themes.map(t=><button key={t.id} className={'theme-card '+(t.id===theme?'selected':'')} onClick={()=>setMapTheme(t.id)}><span className="theme-preview" style={{background:t.accent}}/><span>{t.title}</span>{t.id===theme&&<span className="selected-dot"/>}</button>)}</div>
          <LayerManager map={mapInstance}/><div className="section-title">Detail filters</div>
          {([['roads','Ana yollar'],['minorRoads','Ara sokaklar'],['parks','Parklar ve ormanlar'],['water','Su alanları'],['poi','Önemli yerler (POI)'],['labels','Yer etiketleri'],['buildings','Binalar']] as [keyof MapFilters,string][]).map(([key,label])=><label className="toggle-row" key={key}><span>{label}</span><input type="checkbox" checked={filters[key]} onChange={()=>changeFilter(key)}/><span className="toggle-track"/></label>)}
        </div>}
        {panel==='view' && <div className="panel-body">
          <div className="section-title">Kamera</div>
          <button className="choice" onClick={toggle3D}><Box size={17}/> 3D binalar <span>{threeD?'Açık':'Kapalı'}</span></button>
          <label className="toggle-row"><span>3D arazi</span><input type="checkbox" checked={terrain} onChange={e=>setTerrain(e.target.checked)}/><span className="toggle-track"/></label>
          <div className="section-title">Satellite imagery</div>
          <label className="toggle-row"><span>Hybrid imagery and street labels</span><input type="checkbox" checked={hybrid} onChange={e=>setHybrid(e.target.checked)}/><span className="toggle-track"/></label>
          <select className="imagery-select" aria-label="Imagery provider" value={imageryProvider} onChange={e=>setImageryProvider(e.target.value as ImageryProvider)}><option value="sentinel">Sentinel-2 2016 · CC BY 4.0</option><option value="nasa">NASA Blue Marble · Global</option></select>
          <p className="muted">Sentinel is historical imagery (native zoom ≤13). NASA is a low-resolution global composite (native zoom ≤8). Imagery is provider-dependent and must display attribution.</p>
          <div className="section-title">Harita dili</div>
          <div className="segmented"><button className={locale==='tr'?'active':''} onClick={()=>setLocale('tr')}>Türkçe</button><button className={locale==='en'?'active':''} onClick={()=>setLocale('en')}>English</button></div>
          <div className="section-title">Yollar</div>
          <label className="field"><span>Yol rengi</span><input type="color" value={roadColor} onChange={e=>setRoadColor(e.target.value)}/></label>
          <label className="field"><span>Yol kalınlığı ({roadWidth.toFixed(1)}×)</span><input type="range" min=".5" max="2.5" step=".1" value={roadWidth} onChange={e=>setRoadWidth(Number(e.target.value))}/></label>
          <button className="reset" onClick={()=>{setRoadColor('#7c8b99');setRoadWidth(1);setLocale('tr');setFilters(initialFilters);}}>Görünümü sıfırla</button>
        </div>}
        {panel==='search' && <div className="panel-body">
          <label className="search-field"><Search size={18}/><input autoFocus value={query} onChange={e=>setQuery(e.target.value)} placeholder="Yer veya koordinat ara" aria-label="Konum ara"/></label>
          <p className="muted">Koordinat gir (örnek: 39.9334, 32.8597). Adres ve POI araması sonraki aşamada geocoding API ile etkinleşecek.</p>
          {(()=>{const m=query.match(/^\s*(-?\d+(?:\.\d+)?)\s*[,;]\s*(-?\d+(?:\.\d+)?)\s*$/);const lat=m?Number(m[1]):NaN,lng=m?Number(m[2]):NaN;return Number.isFinite(lat)&&Number.isFinite(lng)&&Math.abs(lat)<=90&&Math.abs(lng)<=180?<button className="choice" onClick={()=>{animate({center:[lng,lat],zoom:15});setPanel(null)}}><MapPin size={17}/> Konuma git <span>{lat.toFixed(4)}, {lng.toFixed(4)}</span></button>:null})()}
        </div>}
      </motion.aside>}
    </AnimatePresence>
    <MapTools map={mapInstance} onError={setError}/>
    <div className="footer"><span><span className="status"/> {ready?'Harita hazır':'Harita yükleniyor'}</span><span>{zoom.toFixed(1)}× zoom</span><span>© OpenStreetMap contributors</span></div>
    {error&&<div className="error-banner" role="alert">{error}<button onClick={()=>setError('')} aria-label="Hatayı kapat"><X size={14}/></button></div>}
  </main>;
}
