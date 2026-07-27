import { execFileSync } from "node:child_process";
import fs from "node:fs/promises";
import path from "node:path";
import matter from "gray-matter";

const raiz = process.cwd();
const erros = [];
let tituloArtigo = "";

function executarGit(argumentos) {
  return execFileSync("git", argumentos, {
    cwd: raiz,
    encoding: "utf8"
  }).trim();
}

function registrarErro(mensagem) {
  erros.push(mensagem);
}

function urlHttps(valor) {
  try {
    return new URL(valor).protocol === "https:";
  } catch {
    return false;
  }
}

function possuiTravessao(texto) {
  return /[—–]/u.test(String(texto ?? ""));
}

const alterados = executarGit(["diff", "--name-only"])
  .split(/\r?\n/)
  .filter(Boolean);
const naoRastreados = executarGit([
  "ls-files",
  "--others",
  "--exclude-standard"
])
  .split(/\r?\n/)
  .filter(Boolean);
const arquivos = [...new Set([...alterados, ...naoRastreados])];
const artigos = arquivos.filter((arquivo) =>
  /^src\/data\/posts\/[^/]+\.md$/u.test(arquivo)
);
const permitidos = arquivos.filter(
  (arquivo) =>
    arquivo === "src/data/produtos.json" ||
    /^src\/data\/posts\/[^/]+\.md$/u.test(arquivo)
);

if (arquivos.length !== permitidos.length) {
  const recusados = arquivos.filter((arquivo) => !permitidos.includes(arquivo));
  registrarErro(`A IA alterou arquivo(s) não permitido(s): ${recusados.join(", ")}.`);
}

if (artigos.length !== 1) {
  registrarErro(`Era esperado exatamente um artigo novo, mas foram encontrados ${artigos.length}.`);
}

const novosArtigos = artigos.filter((arquivo) => naoRastreados.includes(arquivo));
if (artigos.length === 1 && novosArtigos.length !== 1) {
  registrarErro("A IA deve criar um artigo novo, sem reescrever um artigo publicado.");
}

const caminhoResumo = path.join(raiz, "tmp", "resumo-aprovacao.md");
let resumo = "";
try {
  resumo = await fs.readFile(caminhoResumo, "utf8");
} catch {
  registrarErro("Falta o resumo simples para aprovação.");
}

for (const secao of [
  "## Oportunidade encontrada",
  "## Produto e oferta",
  "## Fontes usadas",
  "## Sua decisão"
]) {
  if (resumo && !resumo.includes(secao)) {
    registrarErro(`O resumo não contém a seção "${secao}".`);
  }
}

if (possuiTravessao(resumo)) {
  registrarErro("O resumo usa travessão.");
}

if (artigos.length === 1) {
  const caminhoArtigo = path.join(raiz, artigos[0]);
  const conteudo = await fs.readFile(caminhoArtigo, "utf8");
  const { data, content } = matter(conteudo);
  tituloArtigo = String(data.titulo ?? "").trim();
  const textosEditoriais = [
    data.titulo,
    data.pergunta_principal,
    data.resposta_curta,
    data.descricao,
    data.origem?.pergunta_encontrada,
    data.origem?.motivo,
    ...(data.perguntas_frequentes ?? []).flatMap((item) => [
      item.pergunta,
      item.resposta
    ]),
    content
  ];

  if (data.rascunho !== true) {
    registrarErro("O artigo automático precisa permanecer como rascunho.");
  }

  if (!String(data.pergunta_principal ?? "").includes("?")) {
    registrarErro("A pergunta principal precisa terminar como uma pergunta real.");
  }

  const palavras = content
    .replace(/[#>*_[\]()`|]/gu, " ")
    .trim()
    .split(/\s+/u)
    .filter(Boolean).length;
  if (palavras < 700 || palavras > 1200) {
    registrarErro(`O artigo possui ${palavras} palavras. O intervalo aceito é de 700 a 1.200.`);
  }

  if (textosEditoriais.some(possuiTravessao)) {
    registrarErro("O artigo usa travessão.");
  }

  const titulos = content.match(/^##\s+.+$/gmu) ?? [];
  if (titulos.length < 3) {
    registrarErro("O artigo precisa de pelo menos três seções principais.");
  }

  if (!data.origem?.motivo || !Array.isArray(data.origem?.fontes_demanda)) {
    registrarErro("Faltam os dados que explicam como a oportunidade foi encontrada.");
  } else {
    if (data.origem.fontes_demanda.length < 2) {
      registrarErro("A oportunidade precisa de pelo menos duas fontes de demanda.");
    }
    for (const fonte of data.origem.fontes_demanda) {
      if (!fonte.titulo || !urlHttps(fonte.url)) {
        registrarErro("Há uma fonte de demanda sem título ou URL HTTPS válida.");
      }
    }
  }

  if (
    !Array.isArray(data.perguntas_frequentes) ||
    data.perguntas_frequentes.length < 2 ||
    data.perguntas_frequentes.length > 5
  ) {
    registrarErro("O artigo precisa de duas a cinco perguntas frequentes.");
  } else {
    for (const item of data.perguntas_frequentes) {
      if (!String(item.pergunta ?? "").includes("?")) {
        registrarErro("Toda pergunta frequente precisa conter um ponto de interrogação.");
      }
      if (String(item.resposta ?? "").length < 50) {
        registrarErro("Toda resposta frequente precisa ter pelo menos 50 caracteres.");
      }
    }
  }

  if (/compre agora|oferta imperdível|garantia de economia/iu.test(content)) {
    registrarErro("O artigo usa pressão comercial bloqueada.");
  }
}

const caminhoProdutos = path.join(raiz, "src", "data", "produtos.json");
const produtosAtuais = JSON.parse(await fs.readFile(caminhoProdutos, "utf8"));
const produtosAnteriores = JSON.parse(
  executarGit(["show", "HEAD:src/data/produtos.json"])
);
const anterioresPorId = new Map(
  produtosAnteriores.map((produto) => [produto.id, produto])
);

for (const produto of produtosAtuais) {
  const anterior = anterioresPorId.get(produto.id);
  const urlAnterior = anterior?.afiliado?.url ?? null;
  const urlAtual = produto.afiliado?.url ?? null;
  if (urlAtual && urlAtual !== urlAnterior) {
    registrarErro(
      `A IA tentou ativar um link de afiliado no produto "${produto.id}". Esse link exige autorização humana.`
    );
  }
}

if (erros.length > 0) {
  console.error(`\nRascunho automático recusado: ${erros.length} problema(s).\n`);
  for (const erro of erros) console.error(`- ${erro}`);
  process.exit(1);
}

await fs.writeFile(
  path.join(raiz, "tmp", "titulo-pr.txt"),
  tituloArtigo.slice(0, 90),
  "utf8"
);
console.log(`Rascunho automático seguro: ${artigos[0]}.`);
