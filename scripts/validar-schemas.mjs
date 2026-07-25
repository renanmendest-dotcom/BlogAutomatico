#!/usr/bin/env node
/**
 * Valida o JSON-LD emitido em dist/.
 *
 * "Schema errado é pior que schema ausente" (Seção 8.2) só vira trava se algo
 * checar de verdade. O Rich Results Test do Google precisa de URL pública e
 * roda depois do deploy; este script roda antes, no CI, e pega a classe de erro
 * que mais aparece: JSON quebrado, campo obrigatório faltando, data inválida,
 * Offer sem preço, referência @id apontando para nó que não existe.
 *
 * Uso: node scripts/validar-schemas.mjs [diretorio]  (padrão: dist)
 */
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';

const raiz = process.argv[2] ?? 'dist';

const erros = [];
const avisos = [];
let paginas = 0;
let nos = 0;

function falhar(arquivo, msg) {
  erros.push(`${arquivo}: ${msg}`);
}

function avisar(arquivo, msg) {
  avisos.push(`${arquivo}: ${msg}`);
}

function htmls(dir) {
  const saida = [];
  for (const nome of readdirSync(dir)) {
    const caminho = join(dir, nome);
    if (statSync(caminho).isDirectory()) saida.push(...htmls(caminho));
    else if (nome.endsWith('.html')) saida.push(caminho);
  }
  return saida;
}

const BLOCO = /<script[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/gi;

const dataISO = (v) =>
  typeof v === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(v) && !Number.isNaN(Date.parse(v));

const urlAbsoluta = (v) => typeof v === 'string' && /^https?:\/\//.test(v);

const palavras = (t) => String(t).trim().split(/\s+/).filter(Boolean).length;

/** Campo presente, string não vazia e sem placeholder esquecido. */
function texto(arquivo, no, campo, tipo) {
  const v = no[campo];
  if (typeof v !== 'string' || v.trim() === '') {
    falhar(arquivo, `${tipo}: campo "${campo}" ausente ou vazio`);
    return false;
  }
  if (/\b(lorem|placeholder|TODO|undefined|null)\b/i.test(v)) {
    falhar(arquivo, `${tipo}: campo "${campo}" contém placeholder: ${JSON.stringify(v)}`);
    return false;
  }
  return true;
}

const validadores = {
  Organization(arquivo, no) {
    texto(arquivo, no, 'name', 'Organization');
    if (!urlAbsoluta(no.url)) falhar(arquivo, 'Organization: "url" precisa ser absoluta');
  },

  WebSite(arquivo, no) {
    texto(arquivo, no, 'name', 'WebSite');
    if (!urlAbsoluta(no.url)) falhar(arquivo, 'WebSite: "url" precisa ser absoluta');
  },

  Article(arquivo, no) {
    texto(arquivo, no, 'headline', 'Article');
    texto(arquivo, no, 'description', 'Article');
    for (const campo of ['datePublished', 'dateModified']) {
      if (!dataISO(no[campo])) {
        falhar(arquivo, `Article: "${campo}" precisa ser data ISO válida, veio ${JSON.stringify(no[campo])}`);
      }
    }
    if (Date.parse(no.dateModified) < Date.parse(no.datePublished)) {
      falhar(arquivo, 'Article: dateModified é anterior a datePublished');
    }
    if (!no.author) falhar(arquivo, 'Article: "author" ausente');
    if (!no.publisher) falhar(arquivo, 'Article: "publisher" ausente');
  },

  FAQPage(arquivo, no) {
    const perguntas = Array.isArray(no.mainEntity) ? no.mainEntity : [];
    if (perguntas.length === 0) {
      falhar(arquivo, 'FAQPage: sem perguntas — não deveria ter sido emitido');
      return;
    }
    for (const q of perguntas) {
      if (q['@type'] !== 'Question') falhar(arquivo, 'FAQPage: item não é Question');
      if (!texto(arquivo, q, 'name', 'Question')) continue;
      const r = q.acceptedAnswer;
      if (!r || r['@type'] !== 'Answer' || !texto(arquivo, r, 'text', 'Answer')) continue;
      // 40 a 60 palavras é o comprimento que motores generativos extraem melhor.
      const n = palavras(r.text);
      if (n < 40 || n > 60) {
        falhar(arquivo, `Answer com ${n} palavras (precisa de 40 a 60): "${String(q.name).slice(0, 60)}"`);
      }
    }
  },

  Product(arquivo, no) {
    texto(arquivo, no, 'name', 'Product');
    const oferta = no.offers;
    if (!oferta) {
      falhar(arquivo, 'Product: sem "offers" — produto sem preço não deveria emitir schema');
      return;
    }
    if (typeof oferta.price !== 'number' || !Number.isFinite(oferta.price) || oferta.price <= 0) {
      falhar(arquivo, `Product/Offer: "price" inválido: ${JSON.stringify(oferta.price)}`);
    }
    if (oferta.priceCurrency !== 'BRL') {
      falhar(arquivo, `Product/Offer: "priceCurrency" precisa ser BRL, veio ${JSON.stringify(oferta.priceCurrency)}`);
    }
    if (!/^https:\/\/schema\.org\/(In|OutOf|PreOrder|SoldOut|BackOrder)/.test(String(oferta.availability))) {
      falhar(arquivo, `Product/Offer: "availability" inválido: ${JSON.stringify(oferta.availability)}`);
    }
    if (!urlAbsoluta(oferta.url)) falhar(arquivo, 'Product/Offer: "url" precisa ser absoluta');
  },

  ItemList(arquivo, no) {
    const itens = Array.isArray(no.itemListElement) ? no.itemListElement : [];
    if (itens.length === 0) falhar(arquivo, 'ItemList: vazio');
    itens.forEach((item, i) => {
      if (item.position !== i + 1) {
        falhar(arquivo, `ItemList: position fora de ordem (esperado ${i + 1}, veio ${item.position})`);
      }
      texto(arquivo, item, 'name', 'ListItem');
    });
  },

  BreadcrumbList(arquivo, no) {
    const itens = Array.isArray(no.itemListElement) ? no.itemListElement : [];
    if (itens.length === 0) falhar(arquivo, 'BreadcrumbList: vazio');
    itens.forEach((item, i) => {
      if (item.position !== i + 1) {
        falhar(arquivo, `BreadcrumbList: position fora de ordem (esperado ${i + 1}, veio ${item.position})`);
      }
      texto(arquivo, item, 'name', 'ListItem');
      if (!urlAbsoluta(item.item)) {
        falhar(arquivo, `BreadcrumbList: "item" precisa ser URL absoluta, veio ${JSON.stringify(item.item)}`);
      }
    });
  },
};

// --- percorre o build ---------------------------------------------------------

let arquivos;
try {
  arquivos = htmls(raiz);
} catch {
  console.error(`Não encontrei "${raiz}/". Rode o build antes: npm run build`);
  process.exit(1);
}

for (const caminho of arquivos) {
  const arquivo = relative(process.cwd(), caminho);
  const html = readFileSync(caminho, 'utf8');
  const blocos = [...html.matchAll(BLOCO)];

  if (blocos.length === 0) {
    avisar(arquivo, 'nenhum bloco JSON-LD');
    continue;
  }
  if (blocos.length > 1) {
    // Um @graph por página evita nó de Organization duplicado, que confunde
    // desambiguação de entidade.
    avisar(arquivo, `${blocos.length} blocos JSON-LD — o esperado é 1 @graph`);
  }

  paginas++;

  for (const [, bruto] of blocos) {
    let dados;
    try {
      dados = JSON.parse(bruto);
    } catch (e) {
      falhar(arquivo, `JSON-LD não parseia: ${e.message}`);
      continue;
    }

    if (dados['@context'] !== 'https://schema.org') {
      falhar(arquivo, `@context inválido: ${JSON.stringify(dados['@context'])}`);
    }

    const grafo = Array.isArray(dados['@graph']) ? dados['@graph'] : [dados];
    const ids = new Set(grafo.map((n) => n['@id']).filter(Boolean));

    for (const no of grafo) {
      nos++;
      const tipo = no['@type'];
      if (!tipo) {
        falhar(arquivo, 'nó sem @type');
        continue;
      }
      const validador = validadores[tipo];
      if (validador) validador(arquivo, no);

      // Referência interna do tipo {"@id": "..."} precisa existir no grafo.
      for (const [chave, valor] of Object.entries(no)) {
        if (valor && typeof valor === 'object' && !Array.isArray(valor)) {
          const chaves = Object.keys(valor);
          if (chaves.length === 1 && chaves[0] === '@id' && !ids.has(valor['@id'])) {
            falhar(arquivo, `${tipo}: "${chave}" referencia @id inexistente: ${valor['@id']}`);
          }
        }
      }
    }
  }
}

// --- relatório ----------------------------------------------------------------

for (const a of avisos) console.warn(`aviso  ${a}`);
for (const e of erros) console.error(`ERRO   ${e}`);

console.log(`\n${paginas} página(s), ${nos} nó(s) de schema, ${erros.length} erro(s), ${avisos.length} aviso(s)`);

if (erros.length > 0) {
  console.error('\nSchema inválido. Schema errado é pior que schema ausente — corrija antes de publicar.');
  process.exit(1);
}

console.log('JSON-LD válido.');
