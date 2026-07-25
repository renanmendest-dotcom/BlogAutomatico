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
    'Uso: npm run novo-rascunho -- --produto "tapo-l530e" --pergunta "Minha pergunta?"'
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

const linhasTabela = Object.entries(produto.campos)
  .map(
    ([campo, valor]) =>
      `| ${campo} | ${valor.valor} | ${valor.estado.replaceAll("_", " ")} |`
  )
  .join("\n");

const conteudo = `---
titulo: ${yamlSeguro(pergunta)}
pergunta_principal: ${yamlSeguro(pergunta)}
resposta_curta: ${yamlSeguro(
    `Rascunho aguardando revisão. Os dados disponíveis para ${produto.nome} devem ser explicados somente a partir das fontes oficiais registradas nesta ficha.`
  )}
descricao: ${yamlSeguro(`Rascunho de verificação sobre ${produto.nome}.`)}
publicado_em: ${hoje}
atualizado_em: ${hoje}
verificado_em: ${produto.verificadoEm}
categoria: ${produto.categoria}
produtos:
  - ${produto.id}
fontes:
${fontesYaml}
rascunho: true
---

> **Rascunho automático:** este texto ainda não está publicado. Revise a resposta,
> os dados e as fontes antes de trocar o campo \`rascunho\` para \`false\`.

## Resposta direta

Escreva aqui uma resposta curta, usando somente os dados confirmados abaixo. Se
o campo estiver como não verificado, diga isso de forma explícita.

## O que a ficha confirma?

| Campo | Valor | Situação |
| --- | --- | --- |
${linhasTabela}

## O que ainda precisa ser conferido?

Liste os campos não verificados e explique que ausência de confirmação não é o
mesmo que incompatibilidade.

## O que conferir antes da compra?

Confirme o código exato do modelo e compare a ficha com o anúncio escolhido. Não
forneça orientação de instalação ou dimensionamento elétrico.

## Fontes

${produto.fontes.map((fonte) => `- [${fonte.titulo}](${fonte.url})`).join("\n")}
`;

await fs.writeFile(caminho, conteudo, "utf8");
console.log(`Rascunho criado: ${path.relative(raiz, caminho)}`);
