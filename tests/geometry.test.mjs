import test from 'node:test';
import assert from 'node:assert/strict';
import {distanceMeters,polygonAreaMeters,lineLength,circlePolygon,createFeature,createCircle,nearestFeature,moveVertex,splitLine,mergeLines,formatDistance} from '../src/lib/maps/geometry.ts';

test('geodesic distance is zero for same point and approximately one kilometer',()=>{
  assert.equal(distanceMeters([32.85,39.93],[32.85,39.93]),0);
  const d=distanceMeters([0,0],[0,.008993]);
  assert.ok(Math.abs(d-1000)<3,d);
});

test('polygon area and closed circle rings remain positive',()=>{
  const ring=[[0,0],[.01,0],[.01,.01],[0,.01]];
  const area=polygonAreaMeters(ring);
  assert.ok(area>1000000 && area<1400000,area);
  const circle=circlePolygon([32.85,39.93],500);
  assert.equal(circle.length,73);
  assert.deepEqual(circle[0],circle.at(-1));
  assert.ok(Math.abs(polygonAreaMeters(circle)-Math.PI*500**2)<6000);
});

test('line lengths and nearest annotation geometry are correct',()=>{
  const f=createFeature('line',[[0,0],[.01,0]]);
  assert.ok(lineLength(f.geometry.coordinates)>1000);
  const result=nearestFeature([.005,.001],[f]);
  assert.equal(result?.feature.id,f.id);
  assert.ok((result?.distance??1000)<115);
  assert.equal(nearestFeature([0,0],[]),null);
});

test('vertex editing, splitting and line joining are nonmutating',()=>{
  const f=createFeature('line',[[0,0],[.005,0],[.01,0]]);
  const moved=moveVertex(f,1,[.005,.001]);
  assert.deepEqual(f.geometry.coordinates[1],[.005,0]);
  assert.deepEqual(moved.geometry.coordinates[1],[.005,.001]);
  const pieces=splitLine(f,1);
  assert.ok(pieces);
  assert.equal(pieces[0].geometry.coordinates.length,2);
  const merged=mergeLines(pieces[0],pieces[1]);
  assert.ok(merged);
  assert.equal(merged.geometry.coordinates.length,3);
});

test('line joining must reject distant endpoints',()=>{
  const a=createFeature('line',[[0,0],[.001,0]]);
  const b=createFeature('line',[[1,1],[1.001,1]]);
  assert.equal(mergeLines(a,b),null);
});
