import { getCollection } from "astro:content";
import type { APIRoute } from "astro";
import { produtosPublicados } from "../lib/produtos";
import { site as site_ } from "../lib/site";

function escaparXml(valor: string) {
  return valor
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");
}

export const GET: APIRoute = async ({ site }) => {
  const posts = (await getCollection("posts")).filter(
    (post) => !post.data.rascunho
  );

  const paginasFixas = [
    { rota: "/", atualizadoEm: null },
    { rota: "/artigos/", atualizadoEm: null },
    { rota: "/produtos/", atualizadoEm: null },
    { rota: "/ondulados/", atualizadoEm: null },
    { rota: "/cacheados/", atualizadoEm: null },
    { rota: "/crespos/", atualizadoEm: null },
    { rota: "/descobrir-meu-cabelo/", atualizadoEm: null },
    { rota: "/como-verificamos/", atualizadoEm: null },
    { rota: "/sobre/", atualizadoEm: null },
    { rota: "/contato/", atualizadoEm: null },
    { rota: "/politica-de-privacidade/", atualizadoEm: site_.atualizadoEm },
    { rota: "/termos-de-uso/", atualizadoEm: site_.atualizadoEm },
    { rota: "/isencao-de-responsabilidade/", atualizadoEm: site_.atualizadoEm },
    { rota: "/divulgacao-de-afiliados/", atualizadoEm: site_.atualizadoEm }
  ];

  const paginasDeProduto = produtosPublicados.map((produto) => ({
    rota: `/produtos/${produto.id}/`,
    atualizadoEm: produto.verificadoEm
  }));

  const paginasDeArtigo = posts.map((post) => ({
    rota: `/artigos/${post.id}/`,
    atualizadoEm: post.data.atualizado_em.toISOString().slice(0, 10)
  }));

  const urls = [
    ...paginasFixas,
    ...paginasDeProduto,
    ...paginasDeArtigo
  ]
    .map(({ rota, atualizadoEm }) => {
      const local = escaparXml(new URL(rota, site).toString());
      const ultimaAlteracao = atualizadoEm
        ? `<lastmod>${atualizadoEm}</lastmod>`
        : "";
      return `<url><loc>${local}</loc>${ultimaAlteracao}</url>`;
    })
    .join("");

  const xml =
    `<?xml version="1.0" encoding="UTF-8"?>` +
    `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls}</urlset>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8"
    }
  });
};
