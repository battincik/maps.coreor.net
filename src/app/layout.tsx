import type { Metadata } from 'next';
import 'maplibre-gl/dist/maplibre-gl.css';
import './globals.css';
export const metadata: Metadata = { title: 'Coreor Maps', description: 'Open-source map exploration' };
export default function RootLayout({children}:{children:React.ReactNode}) {return <html lang="tr"><body>{children}</body></html>}
