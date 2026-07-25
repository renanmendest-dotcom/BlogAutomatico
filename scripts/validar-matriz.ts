#!/usr/bin/env node
/**
 * Trava da matriz de compatibilidade.
 *
 * A regra "nunca infira compatibilidade" só vale alguma coisa se algo recusar o
 * commit quando ela é quebrada. É isso aqui: **todo campo afirmado precisa ter
 * fonte com URL e data**. Campo sem fonte tem um único valor legal —
 * `nao_verificado`, ou `null` nos booleanos.
 *
 * Roda no CI junto com o build. Falha derruba o commit.
 */
import { lerJson } from './lib/arquivo.ts';
import type { ArquivoCompatibilidade, EntradaCompatibilidade } from '../src/lib/tipos.ts';

const PROTOCOLOS = ['wifi_2.4', 'zigbee', 'bluetooth', 'matter', 'thread', 'nao_verificado'];
const VOLTAGENS = ['127', '220', 'bivolt', 'nao_verificado'];
const ESTADOS = ['nativo', 'via_hub', 'nao', 'nao_verificado'];
const ASSISTENTES = ['alexa', 'google_home', 'apple_home', 'smartthings'] as const;
const FONTES = ['manual_fabricante', 'ficha_ml', 'site_oficial', 'nao_verificado'];

/** Seção 14: campo parado há mais de 14 dias entra na lista de revisão. */
const DIAS_ATE_ENVELHECER = 14;

const erros: string[] = [];
const avisos: string[] = [];

const falhar = (id: string, msg: string) => erros.push(`${id}: ${msg}`);
const avisar = (id: string, msg: string) => avisos.push(`${id}: ${msg}`);

const dataValida = (v: unknown): v is string =>
  typeof v === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(v) && !Number.isNaN(Date.parse(v));

/** A entrada afirma alguma coisa, ou é só um esqueleto de lacunas? */
function afirmaAlgo(e: EntradaCompatibilidade): boolean {
  return (
    e.protocolo !== 'nao_verificado' ||
    e.voltagem !== 'nao_verificado' ||
    e.hub_necessario !== null ||
    e.funciona_offline !== null ||
    ASSISTENTES.some((a) => e.assistentes?.[a] !== 'nao_verificado')
  );
}

const arquivo = lerJson<ArquivoCompatibilidade>('compatibilidade.json');
const entradas = arquivo.entradas ?? [];
const vistos = new Set<string>();

const hojeISO = new Date().toISOString().slice(0, 10);

for (const e of entradas) {
  const id = e.produto_id ?? '(sem produto_id)';

  // --- identidade ---
  if (!e.produto_id || !/^[a-z0-9]+(?:-[a-z0-9.]+)*$/.test(e.produto_id)) {
    falhar(id, 'produto_id precisa ser slug kebab-case (marca-modelo)');
  }
  if (vistos.has(e.produto_id)) falhar(id, 'produto_id duplicado');
  vistos.add(e.produto_id);

  for (const campo of ['nome', 'marca', 'modelo'] as const) {
    if (!e[campo] || typeof e[campo] !== 'string') falhar(id, `"${campo}" ausente`);
  }

  // --- domínios fechados ---
  if (!PROTOCOLOS.includes(e.protocolo)) falhar(id, `protocolo inválido: ${e.protocolo}`);
  if (!VOLTAGENS.includes(e.voltagem)) falhar(id, `voltagem inválida: ${e.voltagem}`);
  if (!FONTES.includes(e.fonte)) falhar(id, `fonte inválida: ${e.fonte}`);

  for (const a of ASSISTENTES) {
    const v = e.assistentes?.[a];
    if (v === undefined) falhar(id, `assistente "${a}" ausente — os quatro são obrigatórios`);
    else if (!ESTADOS.includes(v)) falhar(id, `estado inválido em "${a}": ${v}`);
  }

  if (e.hub_necessario !== null && typeof e.hub_necessario !== 'boolean') {
    falhar(id, 'hub_necessario precisa ser true, false ou null');
  }
  if (e.funciona_offline !== null && typeof e.funciona_offline !== 'boolean') {
    falhar(id, 'funciona_offline precisa ser true, false ou null');
  }
  if (!Array.isArray(e.ml_ids)) falhar(id, 'ml_ids precisa ser um array');
  else {
    for (const ml of e.ml_ids) {
      if (!/^MLB\d+$/.test(ml)) falhar(id, `ml_id fora do formato MLB…: ${ml}`);
    }
  }

  // --- A TRAVA: afirmação exige procedência ---
  if (afirmaAlgo(e)) {
    if (e.fonte === 'nao_verificado') {
      falhar(id, 'afirma campo verificado mas a fonte é "nao_verificado"');
    }
    if (!e.url_fonte || !/^https:\/\//.test(e.url_fonte)) {
      falhar(id, 'afirma campo verificado mas não tem url_fonte https');
    }
    if (!dataValida(e.verificado_em)) {
      falhar(id, 'afirma campo verificado mas verificado_em não é data válida');
    }
  }

  if (dataValida(e.verificado_em)) {
    if (e.verificado_em > hojeISO) falhar(id, `verificado_em está no futuro: ${e.verificado_em}`);
    else {
      const dias = Math.floor(
        (Date.parse(hojeISO) - Date.parse(e.verificado_em)) / 86_400_000,
      );
      if (dias > DIAS_ATE_ENVELHECER) {
        avisar(id, `verificado há ${dias} dias — passou dos ${DIAS_ATE_ENVELHECER}, revalide`);
      }
    }
  }

  // --- coerência ---
  if (e.hub_necessario === true && (e.hub_modelos ?? []).length === 0) {
    avisar(id, 'exige hub mas não diz quais modelos servem');
  }
  if (e.hub_necessario === false && ASSISTENTES.some((a) => e.assistentes[a] === 'via_hub')) {
    falhar(id, 'diz que não exige hub mas marca assistente como "via_hub"');
  }
  if (
    e.protocolo === 'zigbee' &&
    e.hub_necessario === false
  ) {
    avisar(id, 'Zigbee sem hub é incomum — confira se a fonte diz isso mesmo');
  }
}

// --- relatório -----------------------------------------------------------------

const totalCampos = entradas.length * 8; // 4 assistentes + protocolo, voltagem, hub, offline
const lacunas = entradas.reduce((n, e) => {
  let k = 0;
  if (e.protocolo === 'nao_verificado') k++;
  if (e.voltagem === 'nao_verificado') k++;
  if (e.hub_necessario === null) k++;
  if (e.funciona_offline === null) k++;
  k += ASSISTENTES.filter((a) => e.assistentes?.[a] === 'nao_verificado').length;
  return n + k;
}, 0);

for (const a of avisos) console.warn(`aviso  ${a}`);
for (const e of erros) console.error(`ERRO   ${e}`);

const preenchidos = totalCampos - lacunas;
const pct = totalCampos > 0 ? ((preenchidos / totalCampos) * 100).toFixed(0) : '0';

console.log(
  `\n${entradas.length} dispositivo(s) na matriz · ${preenchidos}/${totalCampos} campos verificados (${pct}%) · ` +
    `${lacunas} lacuna(s) · ${erros.length} erro(s), ${avisos.length} aviso(s)`,
);

// A meta da Fase B é 40. Não é erro estar abaixo — é trabalho em aberto, e o
// número precisa ficar visível para não ser esquecido.
if (entradas.length < 40) {
  console.log(
    `\nFase B em aberto: faltam ${40 - entradas.length} dispositivo(s) para a meta de 40.`,
  );
}

if (erros.length > 0) {
  console.error(
    '\nMatriz inválida. Campo afirmado sem fonte é o único erro que este projeto não pode cometer.',
  );
  process.exit(1);
}

console.log('Matriz válida: nenhum campo afirmado sem fonte e data.');
