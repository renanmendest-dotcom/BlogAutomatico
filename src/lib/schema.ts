/**
 * Construtores de JSON-LD.
 *
 * Regra da Seção 8.2 do PROJETO.md: schema errado é pior que schema ausente.
 * Por isso nenhuma função aqui inventa campo — dado ausente vira propriedade
 * omitida, nunca string vazia, nunca placeholder.
 *
 * Tudo sai num único `@graph` por página, com `@id` estáveis, para não repetir
 * o nó da Organization em cada bloco.
 */
import { SITE } from '../consts';
import { propriedadesSchema } from './compat';
import { entradaCompat, urlDoProduto } from './dados';
import type { Produto } from './tipos';

export type No = Record<string, unknown>;

const ID_ORG = `${SITE.url}/#organizacao`;
const ID_SITE = `${SITE.url}/#site`;

function absoluta(caminho: string): string {
  return new URL(caminho, SITE.url).href;
}

/** Identidade editorial. Não é uma pessoa — ver Seção 8.3. */
export function organizacao(): No {
  return {
    '@type': 'Organization',
    '@id': ID_ORG,
    name: SITE.nome,
    url: SITE.url,
    description: SITE.descricao,
    email: SITE.email,
    // A página que explica como o dado é compilado é parte da identidade.
    publishingPrinciples: absoluta('/como-fazemos'),
    areaServed: { '@type': 'Country', name: 'Brasil' },
  };
}

export function website(): No {
  return {
    '@type': 'WebSite',
    '@id': ID_SITE,
    url: SITE.url,
    name: SITE.nome,
    description: SITE.descricao,
    inLanguage: SITE.idioma,
    publisher: { '@id': ID_ORG },
  };
}

export interface DadosArtigo {
  url: string;
  titulo: string;
  descricao: string;
  publicadoEm: string;
  atualizadoEm: string;
  secao?: string;
}

export function artigo(d: DadosArtigo): No {
  const no: No = {
    '@type': 'Article',
    '@id': `${d.url}#artigo`,
    headline: d.titulo,
    description: d.descricao,
    // Datas reais: `publicado_em` e `atualizado_em` do frontmatter, que o
    // coletor move quando o dado do artigo muda.
    datePublished: d.publicadoEm,
    dateModified: d.atualizadoEm,
    inLanguage: SITE.idioma,
    mainEntityOfPage: { '@type': 'WebPage', '@id': d.url },
    // Autoria organizacional transparente, nunca uma pessoa inventada.
    author: { '@id': ID_ORG },
    publisher: { '@id': ID_ORG },
  };
  if (d.secao) no.articleSection = d.secao;
  return no;
}

export interface ParFaq {
  pergunta: string;
  resposta: string;
}

export function faqPage(url: string, pares: ParFaq[]): No | null {
  if (pares.length === 0) return null;
  return {
    '@type': 'FAQPage',
    '@id': `${url}#faq`,
    mainEntity: pares.map((p) => ({
      '@type': 'Question',
      name: p.pergunta,
      acceptedAnswer: { '@type': 'Answer', text: p.resposta },
    })),
  };
}

/**
 * `Product` + `Offer` de um produto coletado.
 *
 * Retorna `null` sem preço ou sem data de coleta: uma Offer sem preço com
 * procedência é exatamente o schema errado que a Seção 8.2 proíbe.
 */
export function produtoSchema(p: Produto): No | null {
  if (p.preco == null || !p.coletado_em) return null;

  const { url } = urlDoProduto(p);
  const compat = entradaCompat(p.id);

  const oferta: No = {
    '@type': 'Offer',
    url,
    price: p.preco,
    priceCurrency: 'BRL',
    availability: p.disponivel
      ? 'https://schema.org/InStock'
      : 'https://schema.org/OutOfStock',
  };
  if (p.vendedor?.nome) {
    oferta.seller = { '@type': 'Organization', name: p.vendedor.nome };
  }

  const no: No = {
    '@type': 'Product',
    '@id': `${SITE.url}/#produto-${p.id}`,
    name: p.titulo,
    offers: oferta,
  };
  if (p.thumbnail) no.image = p.thumbnail;
  if (p.atributos?.marca) {
    no.brand = { '@type': 'Brand', name: p.atributos.marca };
  }
  if (p.atributos?.modelo) no.model = p.atributos.modelo;
  if (p.id) no.sku = p.id;

  const props = propriedadesSchema(compat);
  if (props.length > 0) no.additionalProperty = props;

  return no;
}

export interface ItemDaLista {
  nome: string;
  url?: string;
}

/** Só para posts que são ranking de fato. */
export function itemList(url: string, itens: ItemDaLista[]): No | null {
  if (itens.length === 0) return null;
  return {
    '@type': 'ItemList',
    '@id': `${url}#lista`,
    itemListOrder: 'https://schema.org/ItemListOrderDescending',
    numberOfItems: itens.length,
    itemListElement: itens.map((item, i) => {
      const el: No = { '@type': 'ListItem', position: i + 1, name: item.nome };
      if (item.url) el.url = item.url;
      return el;
    }),
  };
}

export interface Migalha {
  nome: string;
  caminho: string;
}

export function breadcrumb(migalhas: Migalha[]): No | null {
  if (migalhas.length === 0) return null;
  return {
    '@type': 'BreadcrumbList',
    itemListElement: migalhas.map((m, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: m.nome,
      item: absoluta(m.caminho),
    })),
  };
}

/** Empacota os nós no envelope final. Nós `null` somem. */
export function grafo(nos: Array<No | null>): No {
  return {
    '@context': 'https://schema.org',
    '@graph': nos.filter((n): n is No => n !== null),
  };
}
