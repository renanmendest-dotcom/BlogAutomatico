import type { APIRoute } from 'astro';

import { SITE } from '../consts';

/**
 * Crawlers de IA são bem-vindos: ser citado como fonte por ChatGPT, Gemini e
 * Perplexity é objetivo declarado do projeto, não um efeito colateral tolerado.
 * Por isso nada de bloqueio a GPTBot, PerplexityBot e afins.
 */
export const GET: APIRoute = () =>
  new Response(
    `User-agent: *
Allow: /

Sitemap: ${new URL('/sitemap-index.xml', SITE.url).href}
`,
    { headers: { 'Content-Type': 'text/plain; charset=utf-8' } },
  );
