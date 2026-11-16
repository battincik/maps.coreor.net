/** Small browser-safe geodesic helpers. Coordinates are always [longitude, latitude]. */
export type Position = [number,number];
export type Shape =
  | {type:'Point';coordinates:Position}
  | {type:'LineString';coordinates:Position[]}
  | {type:'Polygon';coordinates:Position[][]};
export type MapFeature = {type:'Feature';id:string;properties:{kind:'point'|'line'|'polygon'|'circle'|'bookmark';name:string;radiusMeters?:number};geometry:Shape};
export type FeatureSet = {type:'FeatureCollection';features:MapFeature[]};
export const EMPTY_FEATURES:FeatureSet={type:'FeatureCollection',features:[]};
const R=6371008.8;
const RAD=Math.PI/180;
const toRad=(n:number)=>n*RAD;
export const createId=()=>typeof crypto!=='undefined'&&'randomUUID'in crypto?crypto.randomUUID():`shape-${Date.now()}-${Math.random().toString(36).slice(2)}`;
export function distanceMeters(a:Position,b:Position):number {
  const dLat=toRad(b[1]-a[1]);const dLon=toRad(b[0]-a[0]);
  const h=Math.sin(dLat/2)**2+Math.cos(toRad(a[1]))*Math.cos(toRad(b[1]))*Math.sin(dLon/2)**2;
  return 2*R*Math.asin(Math.min(1,Math.sqrt(h)));
}
export function lineLength(points:Position[]):number {
  return points.slice(1).reduce((s,p,i)=>s+distanceMeters(points[i],p),0);
}
export function closedRing(points:Position[]):Position[] {
  if(points.length===0)return [];
  const ring=points.map(p=>[...p] as Position);
  if(ring.at(-1)![0]!==ring[0][0]||ring.at(-1)![1]!==ring[0][1])ring.push([...ring[0]] as Position);
  return ring;
}
export function polygonAreaMeters(points:Position[]):number {
  const ring=closedRing(points);
  if(ring.length<4)return 0;
  let sum=0;
  for(let i=0;i<ring.length-1;i++){
    const a=ring[i],b=ring[i+1];
    sum+=toRad(b[0]-a[0])*(2+Math.sin(toRad(a[1]))+Math.sin(toRad(b[1])));
  }
  return Math.abs(sum*R*R/2);
}
export function circlePolygon(center:Position,radiusMeters:number,steps=72):Position[] {
  const dist=Math.max(1,Math.min(1000000,radiusMeters))/R;
  const lat1=toRad(center[1]),lon1=toRad(center[0]);
  const points:Position[]=[];
  for(let i=0;i<steps;i++){
    const bearing=2*Math.PI*i/steps;
    const lat2=Math.asin(Math.sin(lat1)*Math.cos(dist)+Math.cos(lat1)*Math.sin(dist)*Math.cos(bearing));
    const lon2=lon1+Math.atan2(Math.sin(bearing)*Math.sin(dist)*Math.cos(lat1),Math.cos(dist)-Math.sin(lat1)*Math.sin(lat2));
    points.push([((lon2/RAD+540)%360)-180,lat2/RAD]);
  }
  return closedRing(points);
}
export function formatDistance(m:number):string {return m<1000?`${Math.round(m)} m`:`${(m/1000).toFixed(2)} km`;}
export function formatArea(m:number):string {return m<1e6?`${Math.round(m).toLocaleString('en-US')} m²`:`${(m/1e6).toFixed(2)} km²`;}
export function summarize(feature:MapFeature):string {
  const g=feature.geometry;
  if(g.type==='Point')return `${g.coordinates[1].toFixed(5)}, ${g.coordinates[0].toFixed(5)}`;
  if(g.type==='LineString')return formatDistance(lineLength(g.coordinates));
  const ring=g.coordinates[0]||[];
  return feature.properties.kind==='circle'
    ? `r ${formatDistance(feature.properties.radiusMeters??0)} · ${formatArea(polygonAreaMeters(ring))}`
    : `${formatArea(polygonAreaMeters(ring))} · ${formatDistance(lineLength(ring))} perimeter`;
}
export function createFeature(kind:MapFeature['properties']['kind'],points:Position[],name?:string):MapFeature {
  const geometry:Shape=kind==='point'||kind==='bookmark'
    ?{type:'Point',coordinates:points[0]}
    :kind==='line'?{type:'LineString',coordinates:points}
    :{type:'Polygon',coordinates:[closedRing(points)]};
  return {type:'Feature',id:createId(),properties:{kind,name:name??kind[0].toUpperCase()+kind.slice(1)},geometry};
}
export function createCircle(center:Position,radiusMeters:number):MapFeature{
  const feature=createFeature('circle',circlePolygon(center,radiusMeters),'Radius area');
  feature.properties.radiusMeters=radiusMeters;
  return feature;
}
function squaredXY(a:Position,b:Position,refLat:number):number {
  const dx=toRad(a[0]-b[0])*R*Math.cos(toRad(refLat));
  const dy=toRad(a[1]-b[1])*R;
  return dx*dx+dy*dy;
}
function nearestSegment(point:Position,a:Position,b:Position):{point:Position;distance:number}{
  const cos=Math.max(.01,Math.cos(toRad(point[1])));
  const ax=a[0]*cos,ay=a[1],bx=b[0]*cos,by=b[1],px=point[0]*cos,py=point[1];
  const vx=bx-ax,vy=by-ay;
  const t=Math.max(0,Math.min(1,((px-ax)*vx+(py-ay)*vy)/Math.max(1e-16,vx*vx+vy*vy)));
  const nearest:Position=[(ax+t*vx)/cos,ay+t*vy];
  return {point:nearest,distance:Math.sqrt(squaredXY(point,nearest,point[1]))};
}
export function nearestFeature(point:Position,features:MapFeature[]):{feature:MapFeature;distance:number;coordinate:Position}|null{
  let best:{feature:MapFeature;distance:number;coordinate:Position}|null=null;
  for(const feature of features){
    const g=feature.geometry;
    const positions=g.type==='Point'?[g.coordinates]:g.type==='LineString'?g.coordinates:g.coordinates.flat();
    if(positions.length===0)continue;
    let match:{point:Position;distance:number}={point:positions[0],distance:distanceMeters(point,positions[0])};
    for(let i=1;i<positions.length;i++){
      const result=nearestSegment(point,positions[i-1],positions[i]);
      if(result.distance<match.distance)match=result;
    }
    if(!best||match.distance<best.distance)best={feature,distance:match.distance,coordinate:match.point};
  }
  return best;
}
export function moveVertex(feature:MapFeature,index:number,position:Position):MapFeature {
  const clone=structuredClone(feature);
  if(clone.geometry.type==='Point')clone.geometry.coordinates=position;
  else if(clone.geometry.type==='LineString'){
    if(index>=0&&index<clone.geometry.coordinates.length)clone.geometry.coordinates[index]=position;
  }else{
    const ring=clone.geometry.coordinates[0]||[];
    if(index>=0&&index<ring.length-1){ring[index]=position;if(index===0)ring[ring.length-1]=position;}
  }
  return clone;
}
export function vertices(feature:MapFeature):Position[] {
  const g=feature.geometry;
  return g.type==='Point'?[g.coordinates]:g.type==='LineString'?g.coordinates:g.coordinates[0]?.slice(0,-1)||[];
}
export function splitLine(feature:MapFeature,vertexIndex:number):[MapFeature,MapFeature]|null {
  if(feature.geometry.type!=='LineString')return null;
  const coords=feature.geometry.coordinates;
  if(vertexIndex<=0||vertexIndex>=coords.length-1)return null;
  const first=createFeature('line',coords.slice(0,vertexIndex+1),feature.properties.name+' A');
  const second=createFeature('line',coords.slice(vertexIndex),feature.properties.name+' B');
  return [first,second];
}
export function mergeLines(first:MapFeature,second:MapFeature):MapFeature|null {
  if(first.geometry.type!=='LineString'||second.geometry.type!=='LineString')return null;
  const a=first.geometry.coordinates,b=second.geometry.coordinates;
  if(a.length<2||b.length<2)return null;
  const plans=[
    {cost:distanceMeters(a.at(-1)!,b[0]),first:a,second:b},
    {cost:distanceMeters(a.at(-1)!,b.at(-1)!),first:a,second:[...b].reverse()},
    {cost:distanceMeters(a[0],b[0]),first:[...a].reverse(),second:b},
    {cost:distanceMeters(a[0],b.at(-1)!),first:[...a].reverse(),second:[...b].reverse()}
  ].sort((x,y)=>x.cost-y.cost);
  const best=plans[0];
  if(best.cost>50)return null; // Never silently join distant routes.
  const joined=best.cost<.3?[...best.first,...best.second.slice(1)]:[...best.first,...best.second];
  return createFeature('line',joined,first.properties.name+' + '+second.properties.name);
}
