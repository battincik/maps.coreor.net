'use client';
import {useCallback,useEffect,useRef,useState} from 'react';
import * as maplibregl from 'maplibre-gl';
import type {Map as MapInstance,GeoJSONSource} from 'maplibre-gl';
import {AnimatePresence,motion,useReducedMotion} from 'motion/react';
import {Bookmark,Check,ChevronDown,ChevronUp,Copy,Download,Edit3,Layers3,MapPin,MousePointer2,MoveDown,MoveUp,Navigation,PenLine,Plus,Redo2,RotateCcw,Save,Scissors,Search,Share2,Trash2,Undo2,Waypoints,X} from 'lucide-react';
import {circlePolygon,createCircle,createFeature,distanceMeters,EMPTY_FEATURES,formatDistance,lineLength,mergeLines,moveVertex,nearestFeature,polygonAreaMeters,splitLine,summarize,vertices,type MapFeature,type Position} from '@/lib/maps/geometry';

type Mode='browse'|'point'|'line'|'polygon'|'circle'|'bookmark'|'nearest'|'select'|'edit';
const STORAGE='coreor-maps-annotations-v1';
const MAIN='coreor-annotations';
const PREVIEW='coreor-preview';
const VERTICES='coreor-vertices';
const LAYERS=['coreor-annotation-fill','coreor-annotation-lines','coreor-annotation-points'] as const;
type Draft={points:Position[];radius?:number};
const collection=(features:MapFeature[])=>({type:'FeatureCollection' as const,features:features.map(f=>({...f,properties:{...f.properties,_fid:f.id}}))});
const visibleLayers=(map:MapInstance)=>LAYERS.filter(id=>!!map.getLayer(id));

export default function MapTools({map,onError}:{map:MapInstance|null;onError:(message:string)=>void}) {
  const [opened,setOpened]=useState(false);
  const [mode,setMode]=useState<Mode>('browse');
  const [features,setFeatures]=useState<MapFeature[]>([]);
  const [selected,setSelected]=useState<string[]>([]);
  const [draft,setDraft]=useState<Draft>({points:[]});
  const [nearest,setNearest]=useState<{name:string;distance:number}|null>(null);
  const [layerOrder,setLayerOrder]=useState<string[]>([...LAYERS]);
  const [loaded,setLoaded]=useState(false);
  const [counter,setCounter]=useState(0);
  const [renaming,setRenaming]=useState('');
  const [nameInput,setNameInput]=useState('');
  const [message,setMessage]=useState('');
  const shouldReduce=useReducedMotion();
  const past=useRef<MapFeature[][]>([]);
  const future=useRef<MapFeature[][]>([]);
  const featureRef=useRef(features);
  const selectedRef=useRef(selected);
  const draftRef=useRef(draft);
  const modeRef=useRef(mode);
  const dragRef=useRef<{id:string;vertex:number;before:MapFeature[]}|null>(null);
  featureRef.current=features;selectedRef.current=selected;draftRef.current=draft;modeRef.current=mode;

  useEffect(()=>{
    try {
      const raw=localStorage.getItem(STORAGE);
      if(raw) {
        const parsed:unknown=JSON.parse(raw);
        if(Array.isArray(parsed)) {
          const valid=parsed.filter((f):f is MapFeature=>
            !!f&&typeof f==='object'&&'id'in f&&'geometry'in f&&'properties'in f
          ).slice(0,2000);
          featureRef.current=valid;setFeatures(valid);
        }
      }
    } catch { onError('Saved drawing data could not be loaded.'); }
    setLoaded(true);
  },[onError]);
  useEffect(()=>{
    if(!loaded)return;
    try{localStorage.setItem(STORAGE,JSON.stringify(features));}
    catch{setMessage('Storage is full. Export your drawings to keep them.');}
  },[features,loaded]);

  const commit=useCallback((next:MapFeature[],selection?:string[])=>{
    past.current=[...past.current.slice(-49),structuredClone(featureRef.current)];
    future.current=[];
    featureRef.current=next;
    setFeatures(next);
    if(selection!==undefined){selectedRef.current=selection;setSelected(selection);}
    setCounter(x=>x+1);
  },[]);
  const undo=useCallback(()=>{
    const old=past.current.pop();if(!old)return;
    future.current.push(structuredClone(featureRef.current));
    featureRef.current=old;setFeatures(old);setSelected([]);selectedRef.current=[];setCounter(x=>x+1);
  },[]);
  const redo=useCallback(()=>{
    const next=future.current.pop();if(!next)return;
    past.current.push(structuredClone(featureRef.current));
    featureRef.current=next;setFeatures(next);setSelected([]);selectedRef.current=[];setCounter(x=>x+1);
  },[]);
  const choose=useCallback((id:string,additive=false)=>{
    const next=additive?(selectedRef.current.includes(id)?selectedRef.current.filter(x=>x!==id):[...selectedRef.current,id]):[id];
    selectedRef.current=next;setSelected(next);
  },[]);
  const changeMode=(next:Mode)=>{
    modeRef.current=next;setMode(next);setDraft({points:[]});draftRef.current={points:[]};setNearest(null);
    if(next!=='browse')setOpened(true);
  };
  const finish=useCallback(()=>{
    const d=draftRef.current;const m=modeRef.current;
    if(m!=='line'&&m!=='polygon')return;
    if(d.points.length<(m==='line'?2:3)){setMessage(m==='line'?'Add at least two points.':'Add at least three points.');return;}
    const f=createFeature(m,d.points);
    commit([...featureRef.current,f],[f.id]);
    draftRef.current={points:[]};setDraft({points:[]});setMessage('Geometry saved.');
  },[commit]);
  const cancelDraft=()=>{draftRef.current={points:[]};setDraft({points:[]});};

  useEffect(()=>{
    if(!map)return;
    const ensureLayers=()=>{
      if(!map.isStyleLoaded())return;
      if(!map.getSource(MAIN))map.addSource(MAIN,{type:'geojson',data:EMPTY_FEATURES});
      if(!map.getSource(PREVIEW))map.addSource(PREVIEW,{type:'geojson',data:EMPTY_FEATURES});
      if(!map.getSource(VERTICES))map.addSource(VERTICES,{type:'geojson',data:EMPTY_FEATURES});
      if(!map.getLayer(LAYERS[0]))map.addLayer({id:LAYERS[0],type:'fill',source:MAIN,filter:['==',['geometry-type'],'Polygon'],paint:{'fill-color':'#00ccd6','fill-opacity':.20,'fill-outline-color':'#72eff1'}});
      if(!map.getLayer(LAYERS[1]))map.addLayer({id:LAYERS[1],type:'line',source:MAIN,filter:['==',['geometry-type'],'LineString'],paint:{'line-color':'#00ccd6','line-width':3,'line-opacity':.95}});
      if(!map.getLayer('coreor-annotation-outline'))map.addLayer({id:'coreor-annotation-outline',type:'line',source:MAIN,filter:['==',['geometry-type'],'Polygon'],paint:{'line-color':'#55ecf1','line-width':2.5}});
      if(!map.getLayer(LAYERS[2]))map.addLayer({id:LAYERS[2],type:'circle',source:MAIN,filter:['==',['geometry-type'],'Point'],paint:{'circle-radius':7,'circle-color':['case',['==',['get','kind'],'bookmark'],'#ffcf70','#00ccd6'],'circle-stroke-color':'#050505','circle-stroke-width':2}});
      if(!map.getLayer('coreor-preview-fill'))map.addLayer({id:'coreor-preview-fill',type:'fill',source:PREVIEW,paint:{'fill-color':'#ffffff','fill-opacity':.10}});
      if(!map.getLayer('coreor-preview-line'))map.addLayer({id:'coreor-preview-line',type:'line',source:PREVIEW,paint:{'line-color':'#fafafa','line-width':2,'line-dasharray':[3,2]}});
      if(!map.getLayer('coreor-preview-point'))map.addLayer({id:'coreor-preview-point',type:'circle',source:PREVIEW,paint:{'circle-radius':5,'circle-color':'#f5f5f5','circle-stroke-color':'#111111','circle-stroke-width':2}});
      if(!map.getLayer('coreor-vertex-points'))map.addLayer({id:'coreor-vertex-points',type:'circle',source:VERTICES,paint:{'circle-radius':7,'circle-color':'#ffffff','circle-stroke-color':'#00ccd6','circle-stroke-width':3}});
    };
    const onStyle=()=>{ensureLayers();setCounter(x=>x+1);};
    map.on('style.load',onStyle);
    if(map.isStyleLoaded())ensureLayers();
    return()=>{map.off('style.load',onStyle);};
  },[map]);
  useEffect(()=>{
    if(!map||!map.isStyleLoaded()||!map.getSource(MAIN))return;
    const selectedFeatures=features.map(f=>({...f,properties:{...f.properties,selected:selected.includes(f.id)}}));
    (map.getSource(MAIN) as GeoJSONSource).setData(collection(selectedFeatures));
    const points=draft.points;
    const draftFeatures:MapFeature[]=[];
    if(points.length) {
      for(const p of points)draftFeatures.push(createFeature('point',[p]));
      if(points.length>1)draftFeatures.push(createFeature('line',points));
      if(mode==='polygon'&&points.length>=3)draftFeatures.push(createFeature('polygon',points));
      if(mode==='circle'&&points.length===2)draftFeatures.push(createCircle(points[0],distanceMeters(points[0],points[1])));
    }
    (map.getSource(PREVIEW) as GeoJSONSource).setData(collection(draftFeatures));
    const handles=selected.filter(id=>features.some(f=>f.id===id)).flatMap(id=>{
      const f=features.find(x=>x.id===id)!;
      return vertices(f).map((point,index)=>({...createFeature('point',[point]),properties:{...createFeature('point',[point]).properties,_fid:id,_vertex:index}}));
    });
    (map.getSource(VERTICES) as GeoJSONSource).setData({type:'FeatureCollection',features:mode==='edit'?handles:[]});
  },[map,features,draft,mode,selected,counter]);
  useEffect(()=>{
    if(!map)return;
    const click=(e:maplibregl.MapMouseEvent)=>{
      if(dragRef.current)return;
      const m=modeRef.current;
      if(m==='browse'||m==='edit')return;
      const point:Position=[e.lngLat.lng,e.lngLat.lat];
      if(m==='point'||m==='bookmark'){
        const f=createFeature(m,[point]);
        commit([...featureRef.current,f],[f.id]);
        setMessage('Point saved.');
      } else if(m==='line'||m==='polygon'){
        const old=draftRef.current.points;
        const next=old.length&&distanceMeters(old.at(-1)!,point)<1?old:[...old,point];
        draftRef.current={points:next};setDraft({points:next});
      } else if(m==='circle'){
        if(draftRef.current.points.length===0){
          draftRef.current={points:[point]};setDraft({points:[point]});
        }else{
          const r=distanceMeters(draftRef.current.points[0],point);
          if(r<1){setMessage('Choose a radius of at least 1 m.');return;}
          const f=createCircle(draftRef.current.points[0],r);
          commit([...featureRef.current,f],[f.id]);
          draftRef.current={points:[]};setDraft({points:[]});
        }
      }else if(m==='nearest'){
        const match=nearestFeature(point,featureRef.current);
        setNearest(match?{name:match.feature.properties.name,distance:match.distance}:null);
        if(match)choose(match.feature.id);
      }else if(m==='select'){
        const layers=visibleLayers(map);
        const hits=layers.length?map.queryRenderedFeatures(e.point,{layers}):[];
        const id=hits[0]?.properties?._fid;
        if(typeof id==='string'&&featureRef.current.some(f=>f.id===id))choose(id,!!e.originalEvent.shiftKey);
        else if(!e.originalEvent.shiftKey){selectedRef.current=[];setSelected([]);}
      }
    };
    const down=(e:maplibregl.MapMouseEvent)=>{
      if(modeRef.current!=='edit'||!map.getLayer('coreor-vertex-points'))return;
      const hits=map.queryRenderedFeatures(e.point,{layers:['coreor-vertex-points']});
      const id=hits[0]?.properties?._fid,idx=Number(hits[0]?.properties?._vertex);
      if(typeof id==='string'&&Number.isInteger(idx)&&featureRef.current.some(f=>f.id===id)){
        dragRef.current={id,vertex:idx,before:structuredClone(featureRef.current)};
        map.dragPan.disable();map.getCanvas().style.cursor='grabbing';e.preventDefault();
      }
    };
    const move=(e:maplibregl.MapMouseEvent)=>{
      if(!dragRef.current)return;
      const {id,vertex}=dragRef.current;
      const next=featureRef.current.map(f=>f.id===id?moveVertex(f,vertex,[e.lngLat.lng,e.lngLat.lat]):f);
      featureRef.current=next;setFeatures(next);
    };
    const up=()=>{
      if(!dragRef.current)return;
      past.current=[...past.current.slice(-49),dragRef.current.before];
      future.current=[];dragRef.current=null;map.dragPan.enable();map.getCanvas().style.cursor='';
    };
    map.on('click',click);map.on('mousedown',down);map.on('mousemove',move);map.on('mouseup',up);
    return()=>{map.off('click',click);map.off('mousedown',down);map.off('mousemove',move);map.off('mouseup',up);if(dragRef.current){dragRef.current=null;map.dragPan.enable();}};
  },[map,commit,choose]);
  useEffect(()=>{
    const handler=(e:KeyboardEvent)=>{
      const target=e.target as HTMLElement|null;
      if(target?.matches('input,textarea,[contenteditable="true"]'))return;
      if(e.key==='Escape'){changeMode('browse');return;}
      if((e.metaKey||e.ctrlKey)&&e.key.toLowerCase()==='z'){e.preventDefault();e.shiftKey?redo():undo();}
      if((e.metaKey||e.ctrlKey)&&e.key.toLowerCase()==='y'){e.preventDefault();redo();}
      if(e.key==='Enter'&&['line','polygon'].includes(modeRef.current))finish();
    };
    window.addEventListener('keydown',handler);
    return()=>window.removeEventListener('keydown',handler);
  },[undo,redo,finish]);
  const removeSelected=()=>{
    if(!selected.length)return;
    commit(features.filter(f=>!selected.includes(f.id)),[]);
  };
  const addVertex=()=>{
    if(selected.length!==1)return;
    const f=features.find(x=>x.id===selected[0]);if(!f||f.geometry.type==='Point')return;
    const points=vertices(f);if(points.length<2)return;
    let bestIndex=0,bestLength=0;
    for(let i=0;i<(f.geometry.type==='Polygon'?points.length:points.length-1);i++){
      const a=points[i],b=points[(i+1)%points.length];
      const d=distanceMeters(a,b);if(d>bestLength){bestLength=d;bestIndex=i;}
    }
    const a=points[bestIndex],b=points[(bestIndex+1)%points.length],middle:Position=[(a[0]+b[0])/2,(a[1]+b[1])/2];
    const next=[...points.slice(0,bestIndex+1),middle,...points.slice(bestIndex+1)];
    const updated={...f,geometry:f.geometry.type==='LineString'?{type:'LineString' as const,coordinates:next}:{type:'Polygon' as const,coordinates:[[...next,next[0]]]}};
    commit(features.map(x=>x.id===f.id?updated:x),[f.id]);setMode('edit');modeRef.current='edit';
  };
  const splitSelected=()=>{
    if(selected.length!==1)return;const f=features.find(x=>x.id===selected[0]);if(!f||f.geometry.type!=='LineString')return;
    const result=splitLine(f,Math.floor(f.geometry.coordinates.length/2));
    if(!result){setMessage('Add a vertex to the line before splitting.');return;}
    commit([...features.filter(x=>x.id!==f.id),...result],result.map(x=>x.id));
  };
  const mergeSelected=()=>{
    if(selected.length!==2)return;
    const parts=selected.map(id=>features.find(f=>f.id===id)).filter((x):x is MapFeature=>!!x);
    if(parts.length!==2)return;const merged=mergeLines(parts[0],parts[1]);
    if(!merged){setMessage('Select two lines with endpoints within 50 meters.');return;}
    commit([...features.filter(x=>!selected.includes(x.id)),merged],[merged.id]);
  };
  const rename=()=>{
    if(selected.length!==1||!nameInput.trim())return;
    commit(features.map(f=>f.id===selected[0]?{...f,properties:{...f.properties,name:nameInput.trim().slice(0,100)}}:f));
    setRenaming('');setNameInput('');
  };
  const download=(data:string,filename:string,type:string)=>{
    const url=URL.createObjectURL(new Blob([data],{type}));
    const a=document.createElement('a');a.href=url;a.download=filename;a.click();
    setTimeout(()=>URL.revokeObjectURL(url),1000);
  };
  const exportGeo=()=>download(JSON.stringify(collection(features),null,2),'coreor-map-annotations.geojson','application/geo+json');
  const screenshot=()=>{
    if(!map)return;
    try{
      const image=map.getCanvas();
      const canvas=document.createElement('canvas');canvas.width=image.width;canvas.height=image.height;
      const ctx=canvas.getContext('2d');if(!ctx)throw new Error('Canvas unavailable');
      ctx.drawImage(image,0,0);
      const credit=map.getSource('coreor-sentinel-2016')
        ?'© OpenStreetMap contributors · EOxCloudless https://cloudless.eox.at by EOX IT Services GmbH (Contains modified Copernicus Sentinel data 2016 & 2017) · CC BY 4.0'
        :map.getSource('coreor-nasa-blue-marble')
          ?'© OpenStreetMap contributors · NASA GIBS / Blue Marble Next Generation'
          :'© OpenStreetMap contributors';
      const pixel=Math.max(1,window.devicePixelRatio||1);
      ctx.font=(11*pixel)+'px sans-serif';
      const maxWidth=canvas.width-22*pixel;
      const lines:string[]=[];let line='';
      for(const word of credit.split(' ')){
        const candidate=line?line+' '+word:word;
        if(ctx.measureText(candidate).width>maxWidth&&line){lines.push(line);line=word;}
        else line=candidate;
      }
      if(line)lines.push(line);
      const barHeight=Math.max(32,lines.length*16+12)*pixel;
      ctx.fillStyle='rgba(0,0,0,.87)';ctx.fillRect(0,canvas.height-barHeight,canvas.width,barHeight);
      ctx.fillStyle='#fff';
      lines.forEach((text,index)=>ctx.fillText(text,11*pixel,canvas.height-barHeight+(index+1)*16*pixel));
      const a=document.createElement('a');a.href=canvas.toDataURL('image/png');a.download='coreor-map.png';a.click();
    }catch{onError('Screenshot unavailable. Check tile CORS permissions.');}
  };
  const share=async()=>{
    if(!map)return;
    const c=map.getCenter();
    const url=new URL(window.location.href);
    url.searchParams.set('view',[c.lng.toFixed(6),c.lat.toFixed(6),map.getZoom().toFixed(2),map.getBearing().toFixed(1),map.getPitch().toFixed(1)].join(','));
    try{await navigator.clipboard.writeText(url.toString());setMessage('Map link copied.');}
    catch{window.prompt('Copy map URL',url.toString());}
  };
  const changeOrder=(id:string,direction:number)=>{
    const old=layerOrder.indexOf(id),next=old+direction;
    if(old<0||next<0||next>=layerOrder.length||!map)return;
    const order=[...layerOrder];[order[old],order[next]]=[order[next],order[old]];
    setLayerOrder(order);
    // Reorder only user-editable overlay groups, never reorder basemap labels blindly.
    for(const layer of order){if(map.getLayer(layer))map.moveLayer(layer);}
  };
  const selection=features.filter(f=>selected.includes(f.id));
  const lineCanSplit=selection.length===1&&selection[0].geometry.type==='LineString';
  const lineCanMerge=selection.length===2&&selection.every(f=>f.geometry.type==='LineString');
  const modes:{id:Mode;label:string;hint:string}[]=[
    {id:'browse',label:'Explore',hint:'Pan and inspect the map'},
    {id:'select',label:'Select',hint:'Click shapes; Shift adds more'},
    {id:'point',label:'Point',hint:'Click to create point markers'},
    {id:'bookmark',label:'Bookmark',hint:'Click to save places locally'},
    {id:'line',label:'Line',hint:'Click multiple points, then Finish'},
    {id:'polygon',label:'Polygon',hint:'Click three or more points, then Finish'},
    {id:'circle',label:'Radius',hint:'Click center, then outer edge'},
    {id:'nearest',label:'Nearest',hint:'Click to find nearest saved shape'},
    {id:'edit',label:'Edit vertices',hint:'Select a shape, drag white handles'}
  ];
  return <>
    <button className={'tools-trigger '+(opened?'active':'')} type="button" aria-expanded={opened} aria-label="Drawing and map tools" title="Drawing and map tools" onClick={()=>setOpened(x=>!x)}><PenLine size={19}/></button>
    <AnimatePresence>
      {opened&&<motion.section className="tools-panel glass" initial={shouldReduce?false:{opacity:0,x:18,scale:.98}} animate={{opacity:1,x:0,scale:1}} exit={{opacity:0,x:12,scale:.98}} transition={{type:'spring',stiffness:390,damping:35}}>
        <div className="panel-head"><div><div className="eyebrow">MAP WORKSPACE</div><h2>Explore & Draw</h2></div><button className="icon-button" aria-label="Close tools" onClick={()=>{setOpened(false);changeMode('browse')}}><X size={17}/></button></div>
        <div className="tools-scroll">
          <p className="muted">Your annotations stay on this device. No account or tracking required.</p>
          <div className="section-title">Interaction mode</div>
          <div className="tool-modes">{modes.map(x=><button key={x.id} title={x.hint} className={mode===x.id?'tool-active':''} aria-pressed={mode===x.id} onClick={()=>changeMode(x.id)}>{x.label}</button>)}</div>
          <p className="tool-hint">{modes.find(x=>x.id===mode)?.hint}</p>
          {['line','polygon','circle'].includes(mode)&&draft.points.length>0&&<div className="draft-actions"><span>{draft.points.length} point(s) pending</span>{mode!=='circle'&&<button onClick={finish}><Check size={14}/> Finish</button>}<button onClick={cancelDraft}>Cancel</button></div>}
          {nearest&&<div className="tool-result"><strong>Nearest annotation</strong><span>{nearest.name} · {formatDistance(nearest.distance)}</span></div>}
          <div className="section-title">Annotations <span>{features.length} saved</span></div>
          <div className="tool-list">
            {features.length===0&&<p className="muted">No markers or shapes yet. Choose a drawing mode and click the map.</p>}
            {features.slice(-100).reverse().map(f=><button key={f.id} className={'tool-feature '+(selected.includes(f.id)?'tool-feature-selected':'')} onClick={()=>{choose(f.id,true);const v=vertices(f);if(v.length)map?.easeTo({center:v[0],zoom:Math.max(12,map.getZoom()),duration:shouldReduce?0:700})}}><span className="feature-name">{f.properties.name}</span><span>{summarize(f)}</span></button>)}
            {features.length>100&&<span className="muted">Showing the 100 most recent features.</span>}
          </div>
          <div className="tool-buttons">
            <button disabled={!selected.length} onClick={removeSelected}><Trash2 size={15}/> Delete ({selected.length})</button>
            <button disabled={past.current.length===0} onClick={undo}><Undo2 size={15}/> Undo</button>
            <button disabled={future.current.length===0} onClick={redo}><Redo2 size={15}/> Redo</button>
          </div>
          {selected.length===1&&<>
            <div className="section-title">Selected geometry</div>
            <div className="tool-result"><strong>{selection[0]?.properties.name}</strong><span>{selection[0]&&summarize(selection[0])}</span></div>
            <div className="tool-buttons"><button onClick={()=>{setRenaming(selection[0]?.id||'');setNameInput(selection[0]?.properties.name||'')}}>Rename</button><button onClick={()=>changeMode('edit')}><Edit3 size={15}/> Edit shape</button><button onClick={addVertex}>Add vertex</button>{lineCanSplit&&<button onClick={splitSelected}><Scissors size={15}/> Split line</button>}</div>
            {renaming===selected[0]&&<div className="rename-row"><input aria-label="Annotation name" maxLength={100} value={nameInput} onChange={e=>setNameInput(e.target.value)}/><button onClick={rename}><Check size={15}/></button></div>}
          </>}
          {lineCanMerge&&<button className="tool-wide" onClick={mergeSelected}><Waypoints size={15}/> Merge selected lines (≤50 m gap)</button>}
          <div className="section-title">Overlay layer order</div>
          <p className="muted">Rearrange annotation overlays, without affecting base map labels.</p>
          {layerOrder.map((id,i)=><div className="layer-order-row" key={id}><span>{id===LAYERS[0]?'Polygons':id===LAYERS[1]?'Paths':'Points'}</span><button disabled={i===0} onClick={()=>changeOrder(id,-1)} aria-label="Move layer up"><MoveUp size={15}/></button><button disabled={i===layerOrder.length-1} onClick={()=>changeOrder(id,1)} aria-label="Move layer down"><MoveDown size={15}/></button></div>)}
          <div className="section-title">Export & share</div>
          <div className="tool-buttons"><button onClick={exportGeo} disabled={!features.length}><Download size={15}/> GeoJSON</button><button onClick={screenshot}><Download size={15}/> PNG map</button><button onClick={share}><Share2 size={15}/> Share view</button></div>
          {message&&<div className="tool-result" role="status">{message}</div>}
          <p className="muted">Nearest search checks your saved annotations only. Polygon merge and topological boolean operations require a dedicated geometry engine.</p>
        </div>
      </motion.section>}
    </AnimatePresence>
  </>;
}
