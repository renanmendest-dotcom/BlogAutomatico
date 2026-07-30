import fs from "node:fs/promises";
import path from "node:path";
import process from "node:process";

const argumentos = process.argv.slice(2);

function argumento(nome) {
  const indice = argumentos.indexOf(`--${nome}`);
  return indice >= 0 ? argumentos[indice + 1] : undefined;
}

function slug(texto) {
  return texto
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 78);
}

function yamlSeguro(texto) {
  return `"${String(texto).replaceAll("\\", "\\\\").replaceAll('"', '\\"')}"`;
}

const produtoId = argumento("produto") || process.env.PRODUTO_ID;
const pergunta = argumento("pergunta") || process.env.PERGUNTA;

if (!produtoId || !pergunta) {
  console.error(
    'Uso: pnpm novo-rascunho -- --produto "id-do-produto" --pergunta "Minha pergunta?"'
  );
  process.exit(1);
}

const raiz = process.cwd();
const produtos = JSON.parse(
  await fs.readFile(path.join(raiz, "src", "data", "produtos.json"), "utf8")
);
const produto = produtos.find(
  (item) => item.id === produtoId && item.publicado === true
);

if (!produto) {
  console.error(
    `O produto "${produtoId}" não existe ou ainda não foi verificado.`
  );
  process.exit(1);
}

const nomeArquivo = `${slug(pergunta)}.md`;
const caminho = path.join(raiz, "src", "data", "posts", nomeArquivo);

try {
  await fs.access(caminho);
  console.error(`Já existe um artigo com o nome ${nomeArquivo}.`);
  process.exit(1);
} catch {
  // Caminho livre.
}

const hoje = new Date().toISOString().slice(0, 10);
const fontesYaml = produto.fontes
  .map(
    (fonte) =>
      `  - titulo: ${yamlSeguro(fonte.titulo)}\n` +
      `    url: ${yamlSeguro(fonte.url)}\n` +
      `    acessado_em: ${fonte.acessadoEm}`
  )
  .join("\n");

const linhasTabela = produto.destaques
  .map((item) => `| ${item.rotulo} | ${item.valor} |`)
  .join("\n");

const conteudo = `---
titulo: ${yamlSeguro(pergunta)}
pergunta_principal: ${yamlSeguro(pergunta)}
resposta_curta: ${yamlSeguro(
    `Rascunho aguardando revisão. A resposta sobre ${produto.nome} deve usar apenas as fontes registradas e deixar claro o que ainda não foi testado.`
  )}
descricao: ${yamlSeguro(`Rascunho de análise sobre ${produto.nome}.`)}
autor: "Curadoria Curva Viva"
tipo_analise: documental
publicado_em: ${hoje}
atualizado_em: ${hoje}
verificado_em: ${produto.verificadoEm}
categoria: produtos
produtos:
  - ${produto.id}
fontes:
${fontesYaml}
perguntas_frequentes:
  - pergunta: "Primeira dúvida frequente?"
    resposta: "Escreva uma resposta simples com pelo menos cinquenta caracteres e baseada nas fontes."
  - pergunta: "Segunda dúvida frequente?"
    resposta: "Escreva uma resposta simples com pelo menos cinquenta caracteres e baseada nas fontes."
rascunho: true
---

> **Rascunho:** este texto ainda não está publicado. Revise a resposta,
> os limites e as fontes antes da aprovação.

## Resposta direta

Escreva aqui uma resposta curta e útil. Diferencie alegação da marca, análise
documental e teste real.

## O que a ficha confirma?

| Campo | Informação |
| --- | --- |
${linhasTabela}

## Para quem pode fazer sentido?

Explique a indicação publicada, sem ampliar a faixa de curvaturas por conta
própria.

## O que ainda precisa ser testado?

Liste peso, rendimento, duração, acabamento e outras dúvidas que dependem de
experiência real.

## O que conferir antes da compra?

Inclua um checklist curto e prático.

## Fontes

${produto.fontes.map((fonte) => `- [${fonte.titulo}](${fonte.url})`).join("\n")}
`;

await fs.writeFile(caminho, conteudo, "utf8");
console.log(`Rascunho criado: ${path.relative(raiz, caminho)}`);
