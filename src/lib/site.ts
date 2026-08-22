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

  /** Verificação de propriedade nas ferramentas de busca.
   *  Não remover depois de verificado: os dois revalidam de tempos em tempos
   *  e a propriedade cai se a tag sumir.
   *  O Bing importa para o índice que alimenta o ChatGPT e o Copilot. */
  googleSiteVerification: "Vn_7Nv72lPSUu3x5joNZ_99_DC3REPoOX0NDXUKcYVQ",
  bingSiteVerification: "5FE5B1AA8E27A6DB8BDC9EFF4BBA1C87",

  /** Reivindicação do site no Pinterest. Com ela, todo Pin que aponta para o
   *  domínio sai com o nome e a foto da Curva Viva, inclusive os que outras
   *  pessoas salvarem do site, e as estatísticas passam a cobrir o domínio
   *  inteiro. */
  pinterestSiteVerification: "0eef9493199d0de1746639421e32105a"
} as const;

export function dataPorExtenso(data: string) {
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
    timeZone: "UTC"
  }).format(new Date(`${data}T12:00:00Z`));
}
