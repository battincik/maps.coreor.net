'use client';
import {useCallback,useEffect,useRef,useState} from 'react';
import * as maplibregl from 'maplibre-gl';
import type {Map as MapInstance} from 'maplibre-gl';
import {AnimatePresence,motion,useReducedMotion} from 'motion/react';
import {Map, Layers, Box, Mountain, Compass, Crosshair, ZoomIn, ZoomOut, X, Languages, MapPin, SlidersHorizontal, RotateCcw, Search, Route, ChevronDown} from 'lucide-react';
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
    // The predev/prebuild script copies both the worker and its sibling ESM dependency.
    maplibregl.setWorkerUrl('/maplibre/maplibre-gl-worker.mjs');
    const map=new maplibregl.Map({
      container:container.current,style:styleURL('dark'),center:DEFAULT_CENTER,zoom:12.5,
      pitch:0,bearing:0,attributionControl:{compact:true},
      cooperativeGestures:false,renderWorldCopies:true
    });
    mapRef.current=map;
    const loaded=()=>{setReady(true);setError('');apply(map);};
    const failed=(e:maplibregl.ErrorEvent)=>{
      const msg=e.error?.message||'Harita verisi yüklenemedi';
      if(!map.isStyleLoaded())setError(msg);
    };
    const onZoom=()=>setZoom(map.getZoom());
    map.on('style.load',loaded);
    map.on('error',failed);
    map.on('zoomend',onZoom);
    return()=>{map.off('style.load',loaded);map.off('error',failed);map.off('zoomend',onZoom);map.remove();mapRef.current=null};
  },[apply]);

  useEffect(()=>{const map=mapRef.current;if(map?.isStyleLoaded())apply(map)},[filters,locale,roadColor,roadWidth,threeD,terrain,apply]);

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
    <div className="map-actions">
      <button title="Yakınlaştır" aria-label="Yakınlaştır" onClick={()=>adjustZoom(1)}><ZoomIn size={18}/></button>
      <button title="Uzaklaştır" aria-label="Uzaklaştır" onClick={()=>adjustZoom(-1)}><ZoomOut size={18}/></button>
      <div className="action-break"/>
      <button title="Konumum" aria-label="Konumum" onClick={goToMyLocation}><Crosshair size={18}/></button>
      <button title="Kuzeye dön" aria-label="Kuzeye dön" onClick={()=>animate({bearing:0})}><Compass size={18}/></button>
      <button title={threeD?'2D':'3D'} aria-label={threeD?'2D görünüme geç':'3D görünüme geç'} aria-pressed={threeD} className={threeD?'on':''} onClick={toggle3D}><Box size={18}/></button>
      <button title="Ankara'ya dön" aria-label="Ankara'ya dön" onClick={()=>animate({center:DEFAULT_CENTER,zoom:12.5,pitch:0,bearing:0})}><RotateCcw size={18}/></button>
    </div>
    <AnimatePresence mode="wait">
      {panel && <motion.aside key={panel} className="panel glass" {...compactMotion}>
        <div className="panel-head"><div><div className="eyebrow">COREOR MAPS</div><h2>{panel==='layers'?'Harita katmanları':panel==='view'?'Görünüm ayarları':'Harita araması'}</h2></div><button className="icon-button" onClick={()=>setPanel(null)} aria-label="Paneli kapat"><X size={18}/></button></div>
        {panel==='layers' && <div className="panel-body">
          <div className="section-title">Harita teması <span>{themes.length} stil</span></div>
          <div className="theme-grid">{themes.map(t=><button key={t.id} className={'theme-card '+(t.id===theme?'selected':'')} onClick={()=>setMapTheme(t.id)}><span className="theme-preview" style={{background:t.accent}}/><span>{t.title}</span>{t.id===theme&&<span className="selected-dot"/>}</button>)}</div>
          <div className="section-title">Detay filtreleri</div>
          {([['roads','Ana yollar'],['minorRoads','Ara sokaklar'],['parks','Parklar ve ormanlar'],['water','Su alanları'],['poi','Önemli yerler (POI)'],['labels','Yer etiketleri'],['buildings','Binalar']] as [keyof MapFilters,string][]).map(([key,label])=><label className="toggle-row" key={key}><span>{label}</span><input type="checkbox" checked={filters[key]} onChange={()=>changeFilter(key)}/><span className="toggle-track"/></label>)}
        </div>}
        {panel==='view' && <div className="panel-body">
          <div className="section-title">Kamera</div>
          <button className="choice" onClick={toggle3D}><Box size={17}/> 3D binalar <span>{threeD?'Açık':'Kapalı'}</span></button>
          <label className="toggle-row"><span>3D arazi</span><input type="checkbox" checked={terrain} onChange={e=>setTerrain(e.target.checked)}/><span className="toggle-track"/></label>
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
    <div className="footer"><span><span className="status"/> {ready?'Harita hazır':'Harita yükleniyor'}</span><span>{zoom.toFixed(1)}× zoom</span><span>© OpenStreetMap contributors</span></div>
    {error&&<div className="error-banner" role="alert">{error}<button onClick={()=>setError('')} aria-label="Hatayı kapat"><X size={14}/></button></div>}
  </main>;
}
