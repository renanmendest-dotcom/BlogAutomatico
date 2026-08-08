/** Dados institucionais usados nas páginas legais e no rodapé.
 *  Estão centralizados aqui para não haver duas versões do mesmo contato
 *  espalhadas pelo site. */
export const site = {
  nome: "Curva Viva",
  dominio: "curvaviva.com.br",

  /** Precisa ser uma caixa que realmente recebe mensagens: é o canal de
   *  contato do titular de dados previsto na LGPD. */
  email: "contato@curvaviva.com.br",

  /** Quem responde pelo site. Aparece na política de privacidade como
   *  controlador dos dados. */
  responsavel: "Curva Viva",

  /** Data da última revisão dos textos legais. */
  atualizadoEm: "2026-08-07",

  /** Verificação de propriedade no Google Search Console.
   *  Não remover depois de verificado: o Google revalida de tempos em tempos
   *  e a propriedade cai se a tag sumir. */
  googleSiteVerification: "Vn_7Nv72lPSUu3x5joNZ_99_DC3REPoOX0NDXUKcYVQ"
} as const;

export function dataPorExtenso(data: string) {
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
    timeZone: "UTC"
  }).format(new Date(`${data}T12:00:00Z`));
}
