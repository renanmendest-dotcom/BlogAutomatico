import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";
import { caminhosConteudo } from "./lib/caminhos";

const posts = defineCollection({
  loader: glob({
    pattern: "**/[^_]*.md",
    base: "./src/data/posts"
  }),
  schema: z.object({
    titulo: z.string(),
    pergunta_principal: z.string(),
    resposta_curta: z.string().min(80),
    descricao: z.string(),
    autor: z.string().default("Curadoria Curva Viva"),
    tipo_analise: z.enum(["documental", "teste_real"]).default("documental"),
    modelo_artigo: z.enum([
      "educativo",
      "analise",
      "comparativo",
      "ranking"
    ]),
    conclusao: z.string().min(100),
    publicado_em: z.coerce.date(),
    atualizado_em: z.coerce.date(),
    verificado_em: z.coerce.date(),
    categoria: z.enum([
      "curvatura",
      "porosidade",
      "finalizacao",
      "lavagem",
      "tratamento",
      "couro_cabeludo",
      "produtos"
    ]),
    caminhos: z.array(z.enum(caminhosConteudo)).min(1),
    produtos: z.array(z.string()).min(1),
    recomendacoes: z
      .array(
        z.object({
          produto: z.string(),
          melhor_indicacao: z.string().min(30),
          motivo: z.string().min(60),
          pontos_positivos: z.array(z.string()).min(2).max(4)
        })
      )
      .min(1)
      // O ranking usa a faixa maior; validar-conteudo.mjs cobra o mínimo de 3
      // para esse modelo e mantém o teto de 2 nos demais.
      .max(10),
    fontes: z
      .array(
        z.object({
          titulo: z.string(),
          url: z.url(),
          acessado_em: z.coerce.date()
        })
      )
      .min(1),
    origem: z
      .object({
        pergunta_encontrada: z.string(),
        motivo: z.string(),
        fontes_demanda: z
          .array(
            z.object({
              titulo: z.string(),
              url: z.url()
            })
          )
          .min(2)
      })
      .optional(),
    perguntas_frequentes: z
      .array(
        z.object({
          pergunta: z.string(),
          resposta: z.string().min(50)
        })
      )
      .min(2)
      .max(5),
    rascunho: z.boolean().default(true)
  })
});

export const collections = { posts };
