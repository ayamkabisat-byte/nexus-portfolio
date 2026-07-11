import type { APIRoute } from 'astro';
import { SITE } from '@/config/site';
import { withBase } from '@/lib/urls';

export const GET: APIRoute = () => {
  const manifest = {
    name: `${SITE.name} — Author Portfolio`,
    short_name: SITE.shortName,
    description: SITE.description,
    start_url: withBase(''),
    scope: withBase(''),
    display: 'standalone',
    background_color: '#05070d',
    theme_color: '#05070d',
    icons: [
      {
        src: withBase('apple-touch-icon.png'),
        sizes: '180x180',
        type: 'image/png',
      },
    ],
  };

  return new Response(JSON.stringify(manifest), {
    headers: { 'Content-Type': 'application/manifest+json; charset=utf-8' },
  });
};
