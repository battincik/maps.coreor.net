import {copyFileSync,mkdirSync,existsSync,readFileSync} from 'node:fs';
import {dirname,join,resolve} from 'node:path';
import {fileURLToPath} from 'node:url';

const dist=dirname(fileURLToPath(import.meta.resolve('maplibre-gl')));
const dest=resolve('public/maplibre');
mkdirSync(dest,{recursive:true});

for (const file of ['maplibre-gl-worker.mjs','maplibre-gl-shared.mjs']) {
  const source=join(dist,file);
  if (!existsSync(source)) throw new Error('MapLibre worker dependency is missing: '+source);
  copyFileSync(source,join(dest,file));
  const content=readFileSync(join(dest,file),'utf8');
  if (!content.trim()) throw new Error('Empty MapLibre module: '+file);
  console.log('Copied '+file+' -> public/maplibre');
}
