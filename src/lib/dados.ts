/**
 * Acesso de leitura à camada de dados.
 *
 * Tudo aqui roda em build time. O site é estático: nenhum destes dados é lido
 * no navegador.
 */
import compatibilidadeJson from '../../data/compatibilidade.json';
import produtosJson from '../../data/produtos.json';
import precosJson from '../../data/precos-historico.json';
import linksJson from '../../data/links-afiliado.json';

import type {
  ArquivoCompatibilidade,
  ArquivoLinksAfiliado,
  ArquivoPrecosHistorico,
  ArquivoProdutos,
  EntradaCompatibilidade,
  PontoPreco,
  Produto,
} from './tipos';

const compatibilidade = compatibilidadeJson as ArquivoCompatibilidade;
const produtos = produtosJson as ArquivoProdutos;
const precos = precosJson as unknown as ArquivoPrecosHistorico;
const afiliados = linksJson as unknown as ArquivoLinksAfiliado;

/** Entrada da matriz para um id do ML, ou `null` se ainda não foi verificada. */
export function entradaCompat(produtoId: string): EntradaCompatibilidade | null {
  return compatibilidade.entradas.find((e) => e.produto_id === produtoId) ?? null;
}

export function todasEntradasCompat(): EntradaCompatibilidade[] {
  return compatibilidade.entradas;
}

export function produto(produtoId: string): Produto | null {
  return produtos.produtos.find((p) => p.id === produtoId) ?? null;
}

export function todosProdutos(): Produto[] {
  return produtos.produtos;
}

/** Série de preço, em ordem cronológica. Vazia enquanto o coletor não rodou. */
export function serieDePreco(produtoId: string): PontoPreco[] {
  return precos.series[produtoId] ?? [];
}

/**
 * Anúncios do ML que vendem um dispositivo da matriz, já resolvidos em produtos.
 *
 * Um dispositivo é vendido por dezenas de anunciantes com preços diferentes.
 * Resolver por `ml_ids` em vez de fixar um anúncio evita que a ficha morra
 * junto com um anúncio encerrado.
 */
export function produtosDoDispositivo(produtoId: string): Produto[] {
  const entrada = entradaCompat(produtoId);
  if (!entrada) {
    // Pode ser um id de anúncio usado direto, sem entrada na matriz.
    const direto = produto(produtoId);
    return direto ? [direto] : [];
  }
  return entrada.ml_ids
    .map((id) => produto(id))
    .filter((p): p is Produto => p !== null);
}

/** Anúncio mais barato entre os disponíveis. É o que a tabela mostra. */
export function melhorOferta(produtoId: string): Produto | null {
  const candidatos = produtosDoDispositivo(produtoId).filter(
    (p) => p.disponivel && p.preco != null,
  );
  if (candidatos.length === 0) return produtosDoDispositivo(produtoId)[0] ?? null;
  return candidatos.reduce((menor, p) => (p.preco! < menor.preco! ? p : menor));
}

export interface FaixaDePreco {
  minimo: number;
  maximo: number;
  amostras: number;
  primeiro_em: string;
  ultimo_em: string;
}

/**
 * Faixa observada ao longo do tempo, somando todos os anúncios do dispositivo.
 *
 * Esta é a vantagem estrutural do projeto sobre sites humanos: ninguém
 * reverifica centenas de preços toda semana, então ninguém mais consegue dizer
 * "esse produto oscilou entre R$ 39 e R$ 78 nos últimos três meses".
 */
export function faixaDePreco(produtoId: string): FaixaDePreco | null {
  const ids = produtosDoDispositivo(produtoId).map((p) => p.id);
  const alvos = ids.length > 0 ? ids : [produtoId];

  const serie = alvos
    .flatMap((id) => serieDePreco(id))
    .filter((p): p is PontoPreco & { preco: number } => typeof p.preco === 'number')
    .sort((a, b) => a.data.localeCompare(b.data));

  if (serie.length === 0) return null;

  const valores = serie.map((p) => p.preco);
  return {
    minimo: Math.min(...valores),
    maximo: Math.max(...valores),
    amostras: serie.length,
    primeiro_em: serie[0]!.data,
    ultimo_em: serie[serie.length - 1]!.data,
  };
}

/**
 * URL de destino de um produto.
 *
 * Cai no permalink normal quando não há link de afiliado mapeado: a utilidade do
 * artigo vem antes da comissão, então produto nunca é omitido por falta de link.
 */
export function urlDoProduto(p: Produto): { url: string; afiliado: boolean } {
  const link = afiliados.links[p.id];
  return link ? { url: link, afiliado: true } : { url: p.permalink, afiliado: false };
}

/** Quantos pontos de dado coletado por máquina existem para um produto. */
export function pontosDeDado(produtoId: string): number {
  const p = melhorOferta(produtoId);
  const c = entradaCompat(produtoId);
  let n = 0;

  if (p?.preco != null) n++;
  if (p?.quantidade_vendida != null) n++;
  if (p?.vendedor?.reputacao) n++;
  if ((faixaDePreco(produtoId)?.amostras ?? 0) > 1) n++;
  if (c && c.protocolo !== 'nao_verificado') n++;
  if (c && c.voltagem !== 'nao_verificado') n++;
  if (c && Object.values(c.assistentes).some((v) => v !== 'nao_verificado')) n++;

  return n;
}
