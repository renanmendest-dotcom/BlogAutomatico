import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

import { SITE } from './src/consts';

// O domínio ainda não foi registrado (ver SETUP.md, passo 1).
// `SITE.url` em src/consts.ts é a única fonte da verdade: canonical, sitemap,
// robots.txt e todos os schemas JSON-LD leem de lá.
export default defineConfig({
  site: SITE.url,
  trailingSlash: 'never',
  integrations: [
    sitemap({
      filter: (page) => !page.includes('/404'),
    }),
  ],
  vite: {
    build: {
      // O site é CSS puro e quase sem JS; inlinar evita requisições extras.
      assetsInlineLimit: 4096,
    },
  },
});
