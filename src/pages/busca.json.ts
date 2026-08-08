import type { APIRoute } from "astro";
import { getCollection } from "astro:content";
import {
  produtosPublicados,
  resumoObjetivos,
  rotuloCategoria
} from "../lib/produtos";

/** Índice de busca gerado no build. O site é estático, então a busca roda
 *  inteira no navegador a partir deste arquivo. Sem servidor, sem serviço
 *  externo e sem cookie de terceiro. */
export const GET: APIRoute = async () => {
  const posts = (await getCollection("posts")).filter(
    (post) => !post.data.rascunho
  );

  const artigos = posts.map((post) => ({
    tipo: "guia" as const,
    titulo: post.data.titulo,
    resumo: post.data.resposta_curta,
    url: `/artigos/${post.id}/`,
    etiqueta: rotuloCategoria(post.data.categoria),
    // Termos extras entram na busca mas não aparecem na tela.
    termos: [
      post.data.pergunta_principal,
      post.data.descricao,
      ...post.data.caminhos,
      ...post.data.perguntas_frequentes.map((item) => item.pergunta)
    ].join(" ")
  }));

  const produtos = produtosPublicados.map((produto) => ({
    tipo: "produto" as const,
    titulo: produto.nome,
    resumo: produto.descricao,
    url: `/produtos/${produto.id}/`,
    etiqueta: rotuloCategoria(produto.categoria),
    termos: [
      produto.marca,
      produto.perfil.textura,
      resumoObjetivos(produto.perfil.objetivos, 10),
      produto.perfil.curvaturas.join(" ")
    ].join(" ")
  }));

  return new Response(JSON.stringify([...artigos, ...produtos]), {
    headers: { "Content-Type": "application/json; charset=utf-8" }
  });
};
