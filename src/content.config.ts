import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

import { CATEGORIAS } from './consts';

const slugsCategoria = Object.keys(CATEGORIAS) as [string, ...string[]];

/**
 * 40 a 60 palavras é o comprimento que motores generativos extraem melhor
 * (Seção 7.3). Fica no schema de conteúdo — e não só em `validar-post.ts` —
 * porque assim o build quebra na hora, antes de virar HTML publicado.
 */
const palavras = (texto: string) => texto.trim().split(/\s+/).filter(Boolean).length;

const respostaExtraivel = z
  .string()
  .refine((t) => palavras(t) >= 40 && palavras(t) <= 60, (t) => ({
    message: `resposta precisa ter entre 40 e 60 palavras (tem ${palavras(t)})`,
  }));

const fonte = z.object({
  titulo: z.string().min(1),
  url: z.string().url(),
  acessado_em: z.coerce.date(),
});

const posts = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/posts' }),
  schema: z.object({
    titulo: z.string().min(1),
    /** A query exata que o post responde. Vira o `<h1>` e o alvo do artigo. */
    pergunta_principal: z.string().min(1),
    /** Resposta direta. Vira o FAQPage schema e o bloco de resposta no topo. */
    resposta_curta: respostaExtraivel,
    slug: z
      .string()
      .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'slug em kebab-case, sem acento'),
    publicado_em: z.coerce.date(),
    atualizado_em: z.coerce.date(),
    categoria: z.enum(slugsCategoria),
    /**
     * Ids do Mercado Livre citados. Cruzados com /data no build.
     *
     * O prefixo `REF-` marca um item genérico usado só nos posts de referência
     * da Fase A, que não existe no catálogo e nunca emite schema `Product`.
     * `validar-post.ts` (Fase C) recusa `REF-` em post gerado por agente.
     */
    produtos: z.array(z.string()).default([]),

    /** Nome de exibição por id, para itens que ainda não estão em produtos.json. */
    nomes_produtos: z.record(z.string(), z.string()).default({}),
    fontes: z.array(fonte).default([]),
    verificado_em: z.coerce.date(),

    /** Bloco de FAQ. Renderizado e emitido como schema a partir daqui — fonte única. */
    faq: z
      .array(z.object({ pergunta: z.string().min(1), resposta: respostaExtraivel }))
      .default([]),

    /** Marca o post como ranking, o que habilita o `ItemList`. */
    ranking: z.boolean().default(false),

    /**
     * Post escrito à mão na Fase A como referência de formato, antes da camada
     * de dados existir. Renderiza um aviso no topo e não conta no teto anual.
     * Nenhum post gerado por agente pode usar esta flag.
     */
    referencia_formato: z.boolean().default(false),
  }),
});

export const collections = { posts };
