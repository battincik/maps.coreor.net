'use client';
import {useEffect,useRef,useState} from 'react';
import type {Map as MapInstance} from 'maplibre-gl';
import {ArrowDown,ArrowUp,ChevronDown,ChevronUp,Layers,RotateCcw,Search} from 'lucide-react';
type Entry={id:string;type:string;source:string;visible:boolean};
export default function LayerManager({map}:{map:MapInstance|null}){
 const [expanded,setExpanded]=useState(false);
 const [list,setList]=useState<Entry[]>([]);
 const [filter,setFilter]=useState('');
 const [kind,setKind]=useState('all');
 const original=useRef<string[]>([]);
 const refresh=()=>{
  if(!map?.isStyleLoaded())return;
  setList(map.getStyle().layers.map(l=>({id:l.id,type:l.type,source:'source'in l?String(l.source||''):'',visible:map.getLayoutProperty(l.id,'visibility')!=='none'})));
 };
 useEffect(()=>{
  if(!map)return;
  const loaded=()=>{if(map.isStyleLoaded()){original.current=map.getStyle().layers.map(l=>l.id);refresh();}};
  map.on('style.load',loaded);loaded();
  return()=>{map.off('style.load',loaded);};
 },[map]);
 const move=(id:string,up:boolean)=>{
  if(!map?.isStyleLoaded())return;
  const ids=map.getStyle().layers.map(x=>x.id),i=ids.indexOf(id);
  if(i<0)return;
  try{if(up&&i<ids.length-1)map.moveLayer(id,ids[i+2]);else if(!up&&i>0)map.moveLayer(id,ids[i-1]);refresh();}
  catch(err){console.warn('Layer reorder rejected',err);}
 };
 const toggle=(id:string)=>{
  if(!map?.getLayer(id))return;
  map.setLayoutProperty(id,'visibility',map.getLayoutProperty(id,'visibility')==='none'?'visible':'none');
  refresh();
 };
 const reset=()=>{
  if(!map?.isStyleLoaded())return;
  for(const id of original.current){if(map.getLayer(id)){try{map.moveLayer(id);}catch{}}}
  refresh();
 };
 const visible=list.filter(l=>(kind==='all'||l.type===kind)&&(l.id+' '+l.source).toLowerCase().includes(filter.toLowerCase())).reverse();
 return <div className="advanced-layers">
  <button className="choice" onClick={()=>setExpanded(x=>!x)} aria-expanded={expanded}><Layers size={16}/> Advanced layer order <span>{list.length} layers {expanded?<ChevronUp size={14}/>:<ChevronDown size={14}/>}</span></button>
  {expanded&&<div className="advanced-layers-body">
   <p className="muted">Layers appear top-to-bottom in render order. Filter, show/hide and rearrange individual basemap layers. Changes reset with the map style.</p>
   <label className="advanced-search"><Search size={15}/><input placeholder="Filter layers..." aria-label="Filter layers" value={filter} onChange={e=>setFilter(e.target.value)}/></label>
   <div className="advanced-filter">{['all','symbol','line','fill','fill-extrusion','raster','circle','background'].map(t=><button key={t} className={kind===t?'active':''} onClick={()=>setKind(t)}>{t}</button>)}</div>
   <div className="advanced-list">{visible.map(l=>{
    const index=list.findIndex(x=>x.id===l.id);
    return <div className="advanced-layer-row" key={l.id}>
     <button className="layer-visibility" aria-label={(l.visible?'Hide ':'Show ')+l.id} onClick={()=>toggle(l.id)}>{l.visible?'●':'○'}</button>
     <div className="advanced-layer-label"><strong title={l.id}>{l.id}</strong><small>{l.type}{l.source?' · '+l.source:''}</small></div>
     <button aria-label={'Move '+l.id+' up'} disabled={index===list.length-1} onClick={()=>move(l.id,true)}><ArrowUp size={14}/></button>
     <button aria-label={'Move '+l.id+' down'} disabled={index===0} onClick={()=>move(l.id,false)}><ArrowDown size={14}/></button>
    </div>;
   })}{visible.length===0&&<p className="muted">No matching layers.</p>}</div>
   <button className="reset" onClick={reset}><RotateCcw size={14}/> Reset layer ordering</button>
  </div>}
 </div>;
}
