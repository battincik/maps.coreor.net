import type { NextConfig } from 'next';
const nextConfig: NextConfig = { turbopack: { root: process.cwd() }, outputFileTracingIncludes: { '/api/maplibre/[asset]': ['./node_modules/maplibre-gl/dist/maplibre-gl-worker.mjs','./node_modules/maplibre-gl/dist/maplibre-gl-shared.mjs'] } };
export default nextConfig;
