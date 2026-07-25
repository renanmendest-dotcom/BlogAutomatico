/**
 * Tipos canônicos da camada de dados.
 *
 * Os arquivos em /data precisam validar contra estes tipos. Qualquer script da
 * Fase B que escreva em /data importa daqui — não redeclare formatos.
 */

// ---------------------------------------------------------------------------
// Compatibilidade — a matriz
// ---------------------------------------------------------------------------

/**
 * Estado de um dispositivo em relação a um assistente.
 *
 * `nao_verificado` é o padrão e é obrigatório quando a fonte não confirma.
 * Nunca inferir compatibilidade: lacuna honesta vale mais que palpite.
 */
export type EstadoAssistente = 'nativo' | 'via_hub' | 'nao' | 'nao_verificado';

export type Assistente = 'alexa' | 'google_home' | 'apple_home' | 'smartthings';

export type Protocolo =
  | 'wifi_2.4'
  | 'zigbee'
  | 'bluetooth'
  | 'matter'
  | 'thread'
  | 'nao_verificado';

export type Voltagem = '127' | '220' | 'bivolt' | 'nao_verificado';

export type FonteDado =
  | 'manual_fabricante'
  | 'ficha_ml'
  | 'site_oficial'
  | 'nao_verificado';

export interface EntradaCompatibilidade {
  produto_id: string;
  nome: string;
  protocolo: Protocolo;
  /** `null` quando não verificado — não confundir com `false`. */
  hub_necessario: boolean | null;
  hub_modelos: string[];
  assistentes: Record<Assistente, EstadoAssistente>;
  voltagem: Voltagem;
  /** `null` quando não verificado. */
  funciona_offline: boolean | null;
  app_fabricante: string | null;
  fonte: FonteDado;
  url_fonte: string | null;
  /** ISO `YYYY-MM-DD`. */
  verificado_em: string | null;
}

export interface ArquivoCompatibilidade {
  atualizado_em: string | null;
  observacao?: string;
  entradas: EntradaCompatibilidade[];
}

// ---------------------------------------------------------------------------
// Produtos e preço
// ---------------------------------------------------------------------------

export interface Vendedor {
  id: number;
  nome: string;
  reputacao: string | null;
  vendas_totais: number | null;
}

export interface Produto {
  /** Id do Mercado Livre, formato `MLB…`. */
  id: string;
  titulo: string;
  preco: number | null;
  preco_original: number | null;
  disponivel: boolean;
  quantidade_vendida: number | null;
  vendedor: Vendedor | null;
  atributos: Record<string, string>;
  permalink: string;
  thumbnail: string | null;
  /** ISO 8601 completo. Preço sem data de coleta é bloqueado pela trava de dado. */
  coletado_em: string;
}

export interface ArquivoProdutos {
  atualizado_em: string | null;
  fonte: string;
  observacao?: string;
  produtos: Produto[];
}

export interface PontoPreco {
  data: string;
  preco: number | null;
  disponivel: boolean;
}

export interface ArquivoPrecosHistorico {
  atualizado_em: string | null;
  observacao?: string;
  series: Record<string, PontoPreco[]>;
}

// ---------------------------------------------------------------------------
// Afiliados
// ---------------------------------------------------------------------------

export interface ArquivoLinksAfiliado {
  atualizado_em: string | null;
  observacao?: string;
  links: Record<string, string>;
}
