import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";

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
    produtos: z.array(z.string()).min(1),
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
