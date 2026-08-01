import fs from "node:fs/promises";
import path from "node:path";
import matter from "gray-matter";

const raiz = process.cwd();
const arquivoProdutos = path.join(raiz, "src", "data", "produtos.json");
const pastaPosts = path.join(raiz, "src", "data", "posts");
const erros = [];

function erro(mensagem) {
  erros.push(mensagem);
}

function dataValida(valor) {
  return (
    typeof valor === "string" &&
    /^\d{4}-\d{2}-\d{2}$/.test(valor) &&
    !Number.isNaN(new Date(`${valor}T12:00:00Z`).getTime())
  );
}

function urlSegura(valor) {
  try {
    return new URL(valor).protocol === "https:";
  } catch {
    return false;
  }
}

function possuiTravessao(texto) {
  return /[—–]/u.test(String(texto ?? ""));
}

const produtos = JSON.parse(await fs.readFile(arquivoProdutos, "utf8"));
const ids = new Set();

for (const produto of produtos) {
  const prefixo = `Produto "${produto.id ?? "sem-id"}"`;

  if (!produto.id || typeof produto.id !== "string") {
    erro(`${prefixo}: falta um ID.`);
    continue;
  }

  if (ids.has(produto.id)) {
    erro(`${prefixo}: ID duplicado.`);
  }
  ids.add(produto.id);

  if (!produto.nome || !produto.marca || !produto.categoria) {
    erro(`${prefixo}: nome, marca e categoria são obrigatórios.`);
  }

  if (!produto.publicado) continue;

  if (!produto.descricao || !dataValida(produto.verificadoEm)) {
    erro(`${prefixo}: descrição e data de verificação são obrigatórias.`);
  }

  if (!Array.isArray(produto.fontes) || produto.fontes.length === 0) {
    erro(`${prefixo}: uma ficha pública precisa de pelo menos uma fonte.`);
    continue;
  }

  const fontes = new Set();
  for (const fonte of produto.fontes) {
    if (!fonte.id || fontes.has(fonte.id)) {
      erro(`${prefixo}: fonte sem ID ou com ID duplicado.`);
    }
    fontes.add(fonte.id);

    if (!fonte.titulo || !urlSegura(fonte.url)) {
      erro(`${prefixo}: toda fonte precisa de título e URL HTTPS.`);
    }
    if (!dataValida(fonte.acessadoEm)) {
      erro(`${prefixo}: toda fonte precisa de data de acesso.`);
    }
  }

  const perfil = produto.perfil;
  if (
    !perfil ||
    !Array.isArray(perfil.curvaturas) ||
    perfil.curvaturas.length === 0 ||
    !perfil.textura ||
    !perfil.intensidade ||
    !Array.isArray(perfil.objetivos) ||
    perfil.objetivos.length === 0
  ) {
    erro(`${prefixo}: o perfil capilar está incompleto.`);
  }

  if (!Array.isArray(produto.destaques) || produto.destaques.length < 3) {
    erro(`${prefixo}: a ficha precisa de pelo menos três destaques.`);
  } else {
    for (const destaque of produto.destaques) {
      if (!destaque.rotulo || !destaque.valor) {
        erro(`${prefixo}: há um destaque incompleto.`);
      }
      if (destaque.fonteId && !fontes.has(destaque.fonteId)) {
        erro(`${prefixo}: um destaque aponta para uma fonte inexistente.`);
      }
    }
  }

  if (
    !produto.analise ||
    !["documental", "teste_real"].includes(produto.analise.tipo) ||
    typeof produto.analise.testado !== "boolean" ||
    !produto.analise.nota
  ) {
    erro(`${prefixo}: falta informar o tipo e o limite da análise.`);
  }

  if (
    produto.analise?.tipo === "teste_real" &&
    produto.analise?.testado !== true
  ) {
    erro(`${prefixo}: teste real precisa estar marcado como realizado.`);
  }

  if (!produto.oferta || !produto.oferta.loja) {
    erro(`${prefixo}: falta o controle de oferta afiliada.`);
  } else if (produto.oferta.url !== null) {
    if (!urlSegura(produto.oferta.url)) {
      erro(`${prefixo}: a oferta precisa de URL HTTPS válida.`);
    }
    if (
      produto.oferta.loja === "Mercado Livre" &&
      !produto.oferta.url.startsWith("https://meli.la/")
    ) {
      erro(`${prefixo}: a oferta do Mercado Livre precisa usar o link de afiliado gerado na conta.`);
    }
    if (!dataValida(produto.oferta.atualizadoEm)) {
      erro(`${prefixo}: a oferta precisa de data de atualização.`);
    }
    if (
      !produto.imagem ||
      !produto.imagem.src ||
      !produto.imagem.alt ||
      !produto.imagem.credito ||
      !urlSegura(produto.imagem.fonteUrl)
    ) {
      erro(`${prefixo}: uma oferta ativa precisa de imagem real, descrição e fonte.`);
    }
  }
}

const arquivos = (await fs.readdir(pastaPosts))
  .filter((nome) => nome.endsWith(".md"))
  .sort();

for (const nome of arquivos) {
  const caminho = path.join(pastaPosts, nome);
  const conteudo = await fs.readFile(caminho, "utf8");
  const { data, content } = matter(conteudo);
  const prefixo = `Artigo "${nome}"`;

  const camposObrigatorios = [
    "titulo",
    "pergunta_principal",
    "resposta_curta",
    "descricao",
    "autor",
    "tipo_analise",
    "publicado_em",
    "atualizado_em",
    "verificado_em",
    "categoria",
    "produtos",
    "fontes",
    "perguntas_frequentes",
    "rascunho"
  ];

  for (const campo of camposObrigatorios) {
    if (data[campo] === undefined || data[campo] === null) {
      erro(`${prefixo}: falta o campo "${campo}" no início do arquivo.`);
    }
  }

  if (!["documental", "teste_real"].includes(data.tipo_analise)) {
    erro(`${prefixo}: o tipo de análise é inválido.`);
  }

  if (!Array.isArray(data.produtos) || data.produtos.length === 0) {
    erro(`${prefixo}: precisa citar pelo menos um produto.`);
  } else {
    for (const id of data.produtos) {
      const produto = produtos.find((item) => item.id === id);
      if (!produto) {
        erro(`${prefixo}: o produto "${id}" não existe na base.`);
      } else if (!produto.publicado) {
        erro(`${prefixo}: o produto "${id}" ainda está na fila.`);
      }
    }
  }

  if (!Array.isArray(data.fontes) || data.fontes.length === 0) {
    erro(`${prefixo}: precisa ter pelo menos uma fonte.`);
  } else {
    for (const fonte of data.fontes) {
      if (!fonte.titulo || !urlSegura(fonte.url)) {
        erro(`${prefixo}: há uma fonte sem título ou URL HTTPS válida.`);
      }
      const dataAcesso =
        fonte.acessado_em instanceof Date
          ? fonte.acessado_em.toISOString().slice(0, 10)
          : fonte.acessado_em;
      if (!dataValida(dataAcesso)) {
        erro(`${prefixo}: há uma fonte sem data de acesso válida.`);
      }
    }
  }

  if (typeof data.resposta_curta !== "string" || data.resposta_curta.length < 80) {
    erro(`${prefixo}: a resposta curta precisa ter ao menos 80 caracteres.`);
  }

  if (content.trim().length < 800) {
    erro(`${prefixo}: o texto está curto demais para ser útil.`);
  }

  if (
    !Array.isArray(data.perguntas_frequentes) ||
    data.perguntas_frequentes.length < 2 ||
    data.perguntas_frequentes.length > 5
  ) {
    erro(`${prefixo}: precisa de duas a cinco perguntas frequentes.`);
  }

  const textoEditorial = [
    data.titulo,
    data.pergunta_principal,
    data.resposta_curta,
    data.descricao,
    ...(data.perguntas_frequentes ?? []).flatMap((item) => [
      item.pergunta,
      item.resposta
    ]),
    content
  ].join("\n");

  if (possuiTravessao(textoEditorial)) {
    erro(`${prefixo}: o texto não pode usar travessão.`);
  }

  if (
    data.tipo_analise === "documental" &&
    /\b(em nosso teste|nós testamos|eu testei|usei por \d+ dias)\b/iu.test(
      textoEditorial
    )
  ) {
    erro(`${prefixo}: uma análise documental não pode inventar teste real.`);
  }

  const promessasBloqueadas = [
    /\bcura (?:a )?queda\b/iu,
    /\btrata alopecia\b/iu,
    /\bfaz (?:o )?cabelo crescer\b/iu,
    /\bresultado garantido\b/iu,
    /\bserve para todo cabelo\b/iu
  ];

  for (const padrao of promessasBloqueadas) {
    if (padrao.test(textoEditorial)) {
      erro(`${prefixo}: contém uma promessa de saúde ou resultado bloqueada.`);
    }
  }

  if (data.origem) {
    if (
      !data.origem.pergunta_encontrada ||
      !data.origem.motivo ||
      !Array.isArray(data.origem.fontes_demanda) ||
      data.origem.fontes_demanda.length < 2
    ) {
      erro(`${prefixo}: a descoberta automática precisa explicar a oportunidade.`);
    } else {
      for (const fonte of data.origem.fontes_demanda) {
        if (!fonte.titulo || !urlSegura(fonte.url)) {
          erro(`${prefixo}: há uma fonte de demanda inválida.`);
        }
      }
    }
  }
}

if (erros.length > 0) {
  console.error(`\nValidação recusada: ${erros.length} problema(s).\n`);
  for (const mensagem of erros) console.error(`- ${mensagem}`);
  process.exit(1);
}

const publicos = produtos.filter((produto) => produto.publicado).length;
console.log(
  `Conteúdo válido: ${publicos} produto(s) e ${arquivos.length} artigo(s) conferido(s).`
);
