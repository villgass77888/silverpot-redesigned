import type { MetadataRoute } from 'next';

/** §11.4: name "Silverpot", theme #FFD21F, background #FFFFFF, icons from the foil-spiral O. */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Silverpot',
    short_name: 'Silverpot',
    description: 'Aluminium containers, platters and foil, pressed in Ajman since 1997.',
    start_url: '/',
    display: 'standalone',
    theme_color: '#FFD21F',
    background_color: '#FFFFFF',
    icons: [
      { src: '/icons/icon-192.png', sizes: '192x192', type: 'image/png' },
      { src: '/icons/icon-512.png', sizes: '512x512', type: 'image/png' },
      { src: '/icons/icon-maskable-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
    ],
  };
}
