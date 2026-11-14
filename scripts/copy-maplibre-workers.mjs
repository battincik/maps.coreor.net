import {copyFileSync,mkdirSync,statSync,existsSync} from 'node:fs';
import {dirname,join,resolve} from 'node:path';
import {fileURLToPath} from 'node:url';

// Resolve the package's actual dist location; do not hardcode a guessed node_modules path.
const dist=dirname(fileURLToPath(import.meta.resolve('maplibre-gl')));
const dest=resolve('public/maplibre');
mkdirSync(dest,{recursive:true});

const files=['maplibre-gl-worker.mjs','maplibre-gl-shared.mjs'];
for (const file of files) {
  const source=join(dist,file);
  if (!existsSync(source)) throw new Error('MapLibre worker dependency missing: '+source);
  const target=join(dest,file);
  copyFileSync(source,target);
  const bytes=statSync(target).size;
  // MapLibre may ship an intentionally empty shared module; an empty JS module is valid.
  if (file==='maplibre-gl-worker.mjs' && bytes===0)
    throw new Error('MapLibre worker is empty: '+source);
  console.log('MapLibre asset ready:',file,'('+bytes+' bytes)');
}
