#!/usr/bin/env node
/**
 * Coletor do Mercado Livre — agente coletor da Seção 7.2.
 *
 * Este script não escreve prosa. Só move dados: busca produtos do nicho,
 * atualiza preço e disponibilidade, grava o ponto do dia na série histórica e
 * levanta alerta quando preço muda mais de 15% ou o produto sai do ar.
 *
 * Falha nunca derruba o pipeline. Sem credencial, sem rede ou com a API fora, o
 * script registra o motivo, mantém o último dado bom e sai com código 0 — o
 * dado de ontem é velho, mas é verdadeiro; dado vazio quebraria o site.
 *
 * Uso:
 *   node scripts/coletar-ml.ts             # coleta completa
 *   node scripts/coletar-ml.ts --diagnostico   # só checa autenticação
 *   node scripts/coletar-ml.ts --limite 20     # teto de produtos novos
 */
import { agora, gravarJson, hoje, lerJson, pausado } from './lib/arquivo.ts';
import {
  buscar,
  credenciaisDoAmbiente,
  detalhes,
  diagnosticar,
  vendedor,
  type ItemML,
} from './lib/mercadolivre.ts';
import type {
  ArquivoPrecosHistorico,
  ArquivoProdutos,
  Produto,
  Vendedor,
} from '../src/lib/tipos.ts';

interface Sementes {
  buscas_ml: Array<{ termo: string; categoria: string }>;
}

interface Alerta {
  tipo: 'preco' | 'indisponivel' | 'reaparecido';
  produto_id: string;
  titulo: string;
  detalhe: string;
  detectado_em: string;
}

const LIMIAR_VARIACAO = 0.15; // Seção 7.2: mudança acima de 15% dispara atualização.

// --- argumentos ---------------------------------------------------------------

const args = process.argv.slice(2);
const soDiagnostico = args.includes('--diagnostico');
const limiteArg = args.indexOf('--limite');
const LIMITE_PRODUTOS = limiteArg >= 0 ? Number(args[limiteArg + 1]) : 120;

// --- normalização -------------------------------------------------------------

/**
 * Converte o item cru da API no nosso formato.
 *
 * Tudo é opcional do lado deles e o contrato já mudou antes. Campo ausente vira
 * `null`, nunca zero nem string vazia: `null` significa "não coletado", e a
 * diferença entre isso e "coletado como zero" é exatamente o que a trava de dado
 * precisa enxergar.
 */
function normalizar(item: ItemML, dadosVendedor: Vendedor | null): Produto | null {
  if (!item.id || !item.title) return null;

  const atributos: Record<string, string> = {};
  for (const a of item.attributes ?? []) {
    if (a.name && a.value_name) atributos[a.name] = a.value_name;
  }

  const disponivel =
    item.status === 'active' && (item.available_quantity ?? 0) > 0;

  return {
    id: item.id,
    titulo: item.title,
    preco: typeof item.price === 'number' ? item.price : null,
    preco_original: typeof item.original_price === 'number' ? item.original_price : null,
    disponivel,
    // Melhor proxy gratuito de demanda que existe — quando a API entrega.
    quantidade_vendida: typeof item.sold_quantity === 'number' ? item.sold_quantity : null,
    vendedor: dadosVendedor,
    atributos,
    permalink: item.permalink ?? '',
    thumbnail: item.secure_thumbnail ?? item.thumbnail ?? null,
    coletado_em: agora(),
  };
}

// --- principal ----------------------------------------------------------------

async function principal(): Promise<void> {
  if (pausado()) {
    console.log('PAUSE existe na raiz — coletor abortado pelo operador.');
    return;
  }

  const diagnostico = await diagnosticar();
  console.log(
    `[ml] endpoint público: ${diagnostico.publico ? 'sim' : `não (HTTP ${diagnostico.status})`} · ` +
      `credenciais: ${diagnostico.temCredenciais ? 'presentes' : 'AUSENTES'} · ` +
      `token: ${diagnostico.tokenOk === null ? 'n/a' : diagnostico.tokenOk ? 'ok' : 'FALHOU'}`,
  );

  if (soDiagnostico) return;

  const cred = credenciaisDoAmbiente();
  if (!cred) {
    console.error(
      '\n[ml] ML_CLIENT_ID e ML_CLIENT_SECRET não estão no ambiente, e a API do\n' +
        '     Mercado Livre não responde mais sem token. Nada foi coletado e nada\n' +
        '     foi apagado: os dados anteriores continuam intactos.\n' +
        '     Como resolver: SETUP.md, passo 5.',
    );
    return;
  }

  const sementes = lerJson<Sementes>('sementes.json');
  const arquivoProdutos = lerJson<ArquivoProdutos>('produtos.json');
  const arquivoPrecos = lerJson<ArquivoPrecosHistorico>('precos-historico.json');

  const anteriores = new Map(arquivoProdutos.produtos.map((p) => [p.id, p]));

  // 1. Descobrir ids: os que já acompanhamos + o que as buscas do nicho trazem.
  const ids = new Set<string>(anteriores.keys());

  for (const semente of sementes.buscas_ml) {
    const resultados = await buscar(cred, semente.termo, 50);
    console.log(`[ml] "${semente.termo}": ${resultados.length} resultado(s)`);
    for (const item of resultados) {
      if (item.id && ids.size < LIMITE_PRODUTOS) ids.add(item.id);
    }
  }

  if (ids.size === 0) {
    console.error('[ml] nenhum id para consultar. Dados anteriores mantidos.');
    return;
  }

  // 2. Detalhes em lote.
  const itens = await detalhes(cred, [...ids]);
  console.log(`[ml] detalhes obtidos: ${itens.length}/${ids.size}`);

  if (itens.length === 0) {
    console.error('[ml] a API não devolveu nenhum item. Dados anteriores mantidos.');
    return;
  }

  // 3. Vendedores, com cache interno por id.
  const produtos: Produto[] = [];
  for (const item of itens) {
    const idVendedor = item.seller?.id ?? item.seller_id;
    let dadosVendedor: Vendedor | null = null;

    if (typeof idVendedor === 'number') {
      const v = await vendedor(cred, idVendedor);
      if (v) {
        dadosVendedor = {
          id: v.id ?? idVendedor,
          nome: v.nickname ?? '',
          reputacao: v.seller_reputation?.level_id ?? null,
          vendas_totais: v.seller_reputation?.transactions?.total ?? null,
        };
      }
    }

    const p = normalizar(item, dadosVendedor);
    if (p) produtos.push(p);
  }

  // 4. Produtos que já acompanhávamos e sumiram da resposta: marca indisponível,
  //    não apaga. Histórico de produto morto ainda é histórico.
  const vistos = new Set(produtos.map((p) => p.id));
  for (const [id, anterior] of anteriores) {
    if (!vistos.has(id)) {
      produtos.push({ ...anterior, disponivel: false });
    }
  }

  // 5. Alertas e série de preço.
  const alertas: Alerta[] = [];
  const data = hoje();

  for (const p of produtos) {
    const anterior = anteriores.get(p.id);

    if (anterior && anterior.preco != null && p.preco != null && anterior.preco > 0) {
      const variacao = (p.preco - anterior.preco) / anterior.preco;
      if (Math.abs(variacao) >= LIMIAR_VARIACAO) {
        alertas.push({
          tipo: 'preco',
          produto_id: p.id,
          titulo: p.titulo,
          detalhe: `${anterior.preco.toFixed(2)} para ${p.preco.toFixed(2)} (${(variacao * 100).toFixed(1)}%)`,
          detectado_em: data,
        });
      }
    }

    if (anterior?.disponivel && !p.disponivel) {
      alertas.push({
        tipo: 'indisponivel',
        produto_id: p.id,
        titulo: p.titulo,
        detalhe: 'saiu do ar ou zerou estoque',
        detectado_em: data,
      });
    }

    if (anterior && !anterior.disponivel && p.disponivel) {
      alertas.push({
        tipo: 'reaparecido',
        produto_id: p.id,
        titulo: p.titulo,
        detalhe: 'voltou a ficar disponível',
        detectado_em: data,
      });
    }

    // Série append-only, uma amostra por dia. Reexecutar no mesmo dia sobrescreve
    // o ponto de hoje em vez de duplicar.
    const serie = arquivoPrecos.series[p.id] ?? [];
    const indiceHoje = serie.findIndex((ponto) => ponto.data === data);
    const ponto = { data, preco: p.preco, disponivel: p.disponivel };
    if (indiceHoje >= 0) serie[indiceHoje] = ponto;
    else serie.push(ponto);
    arquivoPrecos.series[p.id] = serie;
  }

  produtos.sort((a, b) => a.id.localeCompare(b.id));

  gravarJson('produtos.json', {
    atualizado_em: data,
    fonte: 'api_mercadolivre',
    observacao: arquivoProdutos.observacao,
    produtos,
  } satisfies ArquivoProdutos);

  gravarJson('precos-historico.json', {
    atualizado_em: data,
    observacao: arquivoPrecos.observacao,
    series: arquivoPrecos.series,
  } satisfies ArquivoPrecosHistorico);

  gravarJson('alertas.json', {
    atualizado_em: data,
    observacao:
      'Mudanças que pedem revisão de artigo. Consumido pelo agente publicador (Fase D). Regravado a cada coleta.',
    alertas,
  });

  const comPreco = produtos.filter((p) => p.preco != null).length;
  console.log(
    `\n[ml] ${produtos.length} produto(s), ${comPreco} com preço, ${alertas.length} alerta(s).`,
  );
}

principal().catch((e) => {
  // Nem uma exceção inesperada pode derrubar o pipeline: o site continua no ar
  // com o dado anterior, e o erro fica registrado no log do workflow.
  console.error('[ml] erro inesperado, dados anteriores mantidos:', e);
});
