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
    publicado_em: z.coerce.date(),
    atualizado_em: z.coerce.date(),
    verificado_em: z.coerce.date(),
    categoria: z.enum(["iluminacao", "tomadas", "assistentes", "sensores", "hubs"]),
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
          .min(1)
      })
      .optional(),
    perguntas_frequentes: z
      .array(
        z.object({
          pergunta: z.string(),
          resposta: z.string()
        })
      )
      .min(2)
      .max(5)
      .optional(),
    rascunho: z.boolean().default(true)
  })
});

export const collections = { posts };
