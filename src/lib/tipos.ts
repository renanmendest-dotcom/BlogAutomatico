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
  /**
   * Chave estável da entrada: `marca-modelo` em kebab-case.
   *
   * O PROJETO.md previa o id do Mercado Livre aqui. Trocamos por um slug de
   * modelo porque anúncio do ML morre e é recriado o tempo todo — a matriz
   * perderia o histórico de verificação junto. O que é compatível é o
   * *dispositivo*, não o anúncio. Os anúncios entram em `ml_ids`.
   */
  produto_id: string;
  nome: string;
  marca: string;
  modelo: string;
  /**
   * Anúncios do ML que vendem este dispositivo. É por aqui que a entrada
   * encontra preço em `produtos.json`. Vazio até a coleta rodar.
   */
  ml_ids: string[];
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
  /**
   * Ressalvas que a fonte deixa explícitas e que mudam a decisão de compra —
   * "só a versão P110 mede consumo", "descontinuado, substituído pelo 02P".
   * Exibidas na ficha. Nunca use para especular.
   */
  notas?: string[];
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
