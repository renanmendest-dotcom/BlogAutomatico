import { defineConfig } from "astro/config";

export default defineConfig({
  // O domínio final entra como padrão para que build local e preview gerem os
  // mesmos canonical, sitemap e OG que a produção. As variáveis continuam
  // tendo prioridade, então preview de branch na Vercel segue apontando para
  // o próprio endereço.
  site:
    process.env.SITE_URL ||
    (process.env.VERCEL_PROJECT_PRODUCTION_URL
      ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
      : "https://www.curvaviva.com.br"),
  output: "static",
  build: {
    format: "directory"
  }
});
