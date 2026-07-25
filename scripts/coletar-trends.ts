#!/usr/bin/env node
/**
 * Coletor de demanda — Seção 6.2.
 *
 * Expande as sementes do nicho pelo autocomplete do Google em pt-BR e devolve a
 * cauda longa real: o que gente de verdade digita, com a grafia que usa.
 *
 * Fonte principal: `suggestqueries.google.com`. É gratuito, estável, devolve
 * JSON e não precisa de chave.
 *
 * Sobre o "As pessoas também perguntam": ele não é raspado do resultado de
 * busca. A página do Google devolve HTML ofuscado que muda toda semana, e
 * raspar de dentro do CI arrisca bloquear o IP do runner e derrubar todo o
 * pipeline. Em vez disso, a expansão por prefixo de pergunta ("funciona com",
 * "precisa de", "qual", "como") faz o autocomplete devolver a mesma família de
 * pergunta, com uma fração da fragilidade. Se um dia valer a pena o PAA de
 * verdade, o caminho é uma API de SERP paga — e já existe slot para isso,
 * desligado por padrão.
 *
 * Uso:
 *   node scripts/coletar-trends.ts
 *   node scripts/coletar-trends.ts --sem-alfabeto   # mais rápido, menos cauda
 */
import { agora, gravarJson, hoje, lerJson, pausado } from './lib/arquivo.ts';
import { buscarTexto } from './lib/http.ts';

interface Sementes {
  sementes_demanda: string[];
  marcas: string[];
}

interface Sugestao {
  termo: string;
  /** Semente que gerou. Serve para agrupar e para depurar expansão ruim. */
  origem: string;
  /** Quantas expansões diferentes trouxeram este termo. Proxy fraco de força. */
  ocorrencias: number;
  formato: 'pergunta' | 'comparacao' | 'transacional' | 'generico';
  /** Marcas do nicho citadas no termo. */
  marcas: string[];
}

const args = process.argv.slice(2);
const SEM_ALFABETO = args.includes('--sem-alfabeto');

// Espaço entre chamadas. O endpoint é tolerante, mas centenas de requisições
// seguidas de um runner de CI merecem educação.
const INTERVALO_MS = 220;

/**
 * Prefixos e sufixos que puxam pergunta em vez de navegação.
 *
 * Foram escolhidos a partir das dores da Seção 2 — compatibilidade, hub,
 * frequência do Wi-Fi, voltagem, Matter e operação offline.
 */
const SUFIXOS = [
  'funciona com alexa',
  'funciona com google home',
  'precisa de hub',
  'precisa de wifi',
  'e 5ghz',
  'bivolt',
  '220v',
  'suporta matter',
  'funciona sem internet',
  'como configurar',
  'qual a melhor',
  'vale a pena',
  'nao conecta',
];

const PREFIXOS = ['como', 'qual', 'por que', 'quando'];

const ALFABETO = 'abcdefghijklmnopqrstuvwxyz'.split('');

const dormir = (ms: number) => new Promise((r) => setTimeout(r, ms));

/**
 * Uma consulta ao autocomplete. Falha vira lista vazia, nunca exceção.
 *
 * `oe=utf-8` não é opcional: sem ele o endpoint responde em ISO-8859-1 e todo
 * termo acentuado chega corrompido — e em português isso é quase tudo que
 * importa ("presença", "lâmpada", "tomada 220v não conecta").
 */
async function sugerir(consulta: string): Promise<string[]> {
  const url =
    'https://suggestqueries.google.com/complete/search' +
    `?client=firefox&hl=pt-BR&gl=BR&ie=utf-8&oe=utf-8&q=${encodeURIComponent(consulta)}`;

  const r = await buscarTexto(url, { maxTentativas: 2, timeoutMs: 8000 });
  if (!r.ok || !r.dados) return [];

  try {
    const bruto = JSON.parse(r.dados) as [string, string[]];
    return Array.isArray(bruto[1]) ? bruto[1] : [];
  } catch {
    return [];
  }
}

/**
 * Classificação grosseira de intenção.
 *
 * Serve para o filtro da Seção 7.1 descartar termo sem intenção clara, e para o
 * score de "formato citável por IA": pergunta factual e fechada vale mais que
 * termo amplo e opinativo.
 */
function classificar(termo: string): Sugestao['formato'] {
  // Pergunta: começa com interrogativo, ou contém um verbo de compatibilidade.
  // São as que valem mais no score, porque respondem a uma dúvida fechada.
  const abrePergunta = /^(como|qual|quais|quando|onde|por que|porque|quanto)\b/;
  const verboDeCompatibilidade =
    /\b(funciona com|funciona sem|funciona em|precisa de|suporta|é compatível|e compativel|da pra|dá pra|pode ligar)\b/;
  if (abrePergunta.test(termo) || verboDeCompatibilidade.test(termo)) return 'pergunta';

  if (/\b(vs|versus|ou|melhor que|comparativo|diferença|diferenca|qual a melhor)\b/.test(termo)) {
    return 'comparacao';
  }
  if (/\b(preço|preco|barat\w*|comprar|promoção|promocao|oferta|mercado livre)\b/.test(termo)) {
    return 'transacional';
  }
  return 'generico';
}

function marcasCitadas(termo: string, marcas: string[]): string[] {
  const t = termo.toLowerCase();
  return marcas.filter((m) => new RegExp(`\\b${m.toLowerCase().split(' ')[0]!}\\b`).test(t));
}

/**
 * O termo pertence ao nicho?
 *
 * A expansão por alfabeto e por prefixo é cega: a semente "alexa" com prefixo
 * "como" trouxe "como alexandre de moraes chegou ao stf". Filtrar aqui, na
 * coleta, evita carregar lixo até a Fase C.
 *
 * As fronteiras de palavra são essenciais — sem `\b`, "alexa" casa dentro de
 * "alexander" e o ruído volta.
 */
const TERMOS_DO_NICHO = [
  'inteligente',
  'inteligentes',
  'smart',
  'alexa',
  'echo',
  'google home',
  'nest',
  'apple home',
  'homekit',
  'smartthings',
  'zigbee',
  'thread',
  'matter',
  'tuya',
  'sonoff',
  'tapo',
  'hue',
  'sengled',
  'wifi',
  'wi-fi',
  'wi fi',
  'lampada',
  'lâmpada',
  'tomada',
  'interruptor',
  'sensor',
  'hub',
  'automacao',
  'automação',
  'domotica',
  'domótica',
  'bivolt',
  '127v',
  '220v',
  'assistente',
];

const REGEX_NICHO = new RegExp(
  `\\b(${TERMOS_DO_NICHO.map((t) => t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|')})\\b`,
);

function pertenceAoNicho(termo: string): boolean {
  return REGEX_NICHO.test(termo);
}

async function principal(): Promise<void> {
  if (pausado()) {
    console.log('PAUSE existe na raiz — coletor de demanda abortado pelo operador.');
    return;
  }

  const sementes = lerJson<Sementes>('sementes.json');
  const encontrados = new Map<string, Sugestao>();
  let consultas = 0;
  let falhas = 0;
  let descartados = 0;

  for (const semente of sementes.sementes_demanda) {
    const expansoes = [
      semente,
      ...SUFIXOS.map((s) => `${semente} ${s}`),
      ...PREFIXOS.map((p) => `${p} ${semente}`),
      ...(SEM_ALFABETO ? [] : ALFABETO.map((l) => `${semente} ${l}`)),
    ];

    for (const consulta of expansoes) {
      const sugestoes = await sugerir(consulta);
      consultas++;
      if (sugestoes.length === 0) falhas++;

      for (const bruto of sugestoes) {
        const termo = bruto.trim().toLowerCase();
        if (termo.length < 8) continue;
        if (!pertenceAoNicho(termo)) {
          descartados++;
          continue;
        }

        const existente = encontrados.get(termo);
        if (existente) {
          existente.ocorrencias++;
          continue;
        }

        encontrados.set(termo, {
          termo,
          origem: semente,
          ocorrencias: 1,
          formato: classificar(termo),
          marcas: marcasCitadas(termo, sementes.marcas),
        });
      }

      await dormir(INTERVALO_MS);
    }

    console.log(`[demanda] "${semente}": ${encontrados.size} termo(s) acumulado(s)`);
  }

  const sugestoes = [...encontrados.values()].sort(
    (a, b) => b.ocorrencias - a.ocorrencias || a.termo.localeCompare(b.termo, 'pt-BR'),
  );

  const porFormato = sugestoes.reduce<Record<string, number>>((acc, s) => {
    acc[s.formato] = (acc[s.formato] ?? 0) + 1;
    return acc;
  }, {});

  gravarJson('demanda.json', {
    atualizado_em: hoje(),
    coletado_em: agora(),
    observacao:
      'Cauda longa crua do autocomplete do Google em pt-BR. Entrada do agente de descoberta (Fase C), que pontua e vira pautas.json. Não é volume de busca — é o que o Google sugere, o que indica demanda sem medir.',
    fonte: 'google_autocomplete',
    consultas,
    falhas,
    descartados_fora_do_nicho: descartados,
    total: sugestoes.length,
    por_formato: porFormato,
    // Slot da Seção 6.2 para API paga de keyword. Desligado por padrão; quando
    // ligado, quem consumir deve preferir o volume real ao proxy do autocomplete.
    api_paga: {
      ativa: Boolean(process.env.KEYWORD_API_KEY),
      provedor: process.env.KEYWORD_API_PROVEDOR ?? null,
    },
    sugestoes,
  });

  console.log(
    `\n[demanda] ${sugestoes.length} termo(s) únicos em ${consultas} consulta(s), ${falhas} sem retorno.`,
  );
  console.log(`[demanda] por formato: ${JSON.stringify(porFormato)}`);
}

principal().catch((e) => {
  console.error('[demanda] erro inesperado, dados anteriores mantidos:', e);
});
