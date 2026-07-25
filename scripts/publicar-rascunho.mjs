import fs from "node:fs/promises";
import path from "node:path";

const raiz = process.cwd();
const pastaPermitida = path.resolve(raiz, "src", "data", "posts");
const argumentos = process.argv.slice(2).filter((item) => item !== "--");

if (argumentos.length === 0) {
  console.error("Nenhum arquivo de rascunho foi informado.");
  process.exit(1);
}

for (const argumento of argumentos) {
  const arquivo = path.resolve(raiz, argumento);
  const dentroDaPasta =
    arquivo.startsWith(`${pastaPermitida}${path.sep}`) &&
    arquivo.endsWith(".md");

  if (!dentroDaPasta) {
    console.error(`Arquivo recusado por segurança: ${argumento}`);
    process.exit(1);
  }

  const conteudo = await fs.readFile(arquivo, "utf8");
  const ocorrencias = conteudo.match(/^rascunho:\s*true\s*$/gm) ?? [];

  if (ocorrencias.length !== 1) {
    console.error(
      `${argumento}: era esperado exatamente um campo "rascunho: true".`
    );
    process.exit(1);
  }

  const publicado = conteudo.replace(
    /^rascunho:\s*true\s*$/m,
    "rascunho: false"
  );
  await fs.writeFile(arquivo, publicado, "utf8");
  console.log(`Aprovado para publicação: ${argumento}`);
}
