/**
 * Constantes globais do site.
 *
 * Este arquivo é a única fonte da verdade para identidade e URL canônica.
 * astro.config.ts, o sitemap, o robots.txt e todos os schemas JSON-LD leem daqui.
 *
 * PENDENTE (SETUP.md, passo 1): trocar `url` pelo domínio real assim que
 * registrado. Enquanto estiver com o placeholder, o Cloudflare Pages serve o
 * site em <projeto>.pages.dev e os canonicals apontam para o placeholder.
 */
export const SITE = {
  url: 'https://casaconectada.com.br',
  nome: 'Casa Conectada',
  descricao:
    'Fichas de compatibilidade de dispositivos de casa inteligente vendidos no Brasil: assistentes suportados, protocolo, voltagem e necessidade de hub — com fonte e data de verificação em cada campo.',
  idioma: 'pt-BR',
  locale: 'pt_BR',
  email: 'correcoes@casaconectada.com.br',
} as const;

/** Categorias fechadas. Espelha o enum do frontmatter em src/content.config.ts. */
export const CATEGORIAS = {
  iluminacao: {
    slug: 'iluminacao',
    nome: 'Iluminação',
    descricao: 'Lâmpadas, fitas de LED, plafons e drivers inteligentes.',
  },
  tomadas: {
    slug: 'tomadas',
    nome: 'Tomadas e interruptores',
    descricao: 'Tomadas, plugues, interruptores e módulos de embutir.',
  },
  assistentes: {
    slug: 'assistentes',
    nome: 'Assistentes',
    descricao: 'Alexa, Google Home, Apple Home e SmartThings.',
  },
  sensores: {
    slug: 'sensores',
    nome: 'Sensores',
    descricao: 'Presença, abertura, temperatura, umidade e fumaça.',
  },
  hubs: {
    slug: 'hubs',
    nome: 'Hubs e pontes',
    descricao: 'Centrais Zigbee, Thread, Matter e pontes de fabricante.',
  },
} as const;

export type CategoriaSlug = keyof typeof CATEGORIAS;

/** Navegação principal. */
export const NAV = [
  { href: '/compatibilidade', texto: 'Matriz' },
  { href: '/categorias', texto: 'Categorias' },
  { href: '/como-fazemos', texto: 'Como fazemos' },
] as const;
