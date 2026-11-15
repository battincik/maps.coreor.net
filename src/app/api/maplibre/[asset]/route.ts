import {readFile} from 'node:fs/promises';
import {join} from 'node:path';
import {NextResponse} from 'next/server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const allowed = new Set(['maplibre-gl-worker.mjs', 'maplibre-gl-shared.mjs']);

export async function GET(_request:Request, context:{params:Promise<{asset:string}>}) {
  const {asset} = await context.params;
  if(!allowed.has(asset))return new NextResponse('Not found',{status:404});

  try {
    const source=join(process.cwd(),'node_modules','maplibre-gl','dist',asset);
    const content=await readFile(source);
    return new NextResponse(content,{
      status:200,
      headers:{
        'Content-Type':'application/javascript; charset=utf-8',
        'X-Content-Type-Options':'nosniff',
        'Cache-Control':'public, max-age=3600'
      }
    });
  } catch(error) {
    console.error('[coreor-maps] MapLibre asset not found:',asset,error);
    return NextResponse.json({error:'MAPLIBRE_ASSET_UNAVAILABLE'},{status:503});
  }
}
