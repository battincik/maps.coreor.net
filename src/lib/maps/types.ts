export type Locale = 'tr' | 'en';
export type Theme = 'dark' | 'fiord' | 'liberty' | 'bright' | 'positron' | '3d';
export type MapFilters = {
  roads: boolean; minorRoads: boolean; parks: boolean;
  water: boolean; poi: boolean; labels: boolean; buildings: boolean;
};
export const initialFilters: MapFilters = {
  roads: true, minorRoads: true, parks: true,
  water: true, poi: true, labels: true, buildings: true,
};
export const themes: {id:Theme; title:string; accent:string}[] = [
  {id:'dark',title:'Dark',accent:'#263442'},
  {id:'fiord',title:'Fiord',accent:'#254658'},
  {id:'liberty',title:'Liberty',accent:'#b9c4a9'},
  {id:'bright',title:'Bright',accent:'#e7cb9a'},
  {id:'positron',title:'Positron',accent:'#e3e9ea'},
  {id:'3d',title:'OpenFreeMap 3D',accent:'#a9c1cb'}
];
export function styleURL(id:Theme) { return 'https://tiles.openfreemap.org/styles/'+id; }
