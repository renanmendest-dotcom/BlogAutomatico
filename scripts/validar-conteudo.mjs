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

  if (!dataValida(produto.verificadoEm)) {
    erro(`${prefixo}: "verificadoEm" deve usar AAAA-MM-DD.`);
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

    if (!urlSegura(fonte.url)) {
      erro(`${prefixo}: a fonte "${fonte.id}" precisa de URL HTTPS válida.`);
    }
    if (!dataValida(fonte.acessadoEm)) {
      erro(`${prefixo}: a fonte "${fonte.id}" precisa de data de acesso.`);
    }
  }

  if (!produto.campos || typeof produto.campos !== "object") {
    erro(`${prefixo}: faltam os campos de compatibilidade.`);
    continue;
  }

  const camposObrigatorios = [
    "protocolo",
    "hub",
    "alexa",
    "googleHome",
    "matter",
    "voltagem"
  ];

  for (const nomeCampo of camposObrigatorios) {
    const campo = produto.campos[nomeCampo];
    if (!campo) {
      erro(`${prefixo}: falta o campo "${nomeCampo}".`);
      continue;
    }

    if (!campo.valor || !campo.estado) {
      erro(`${prefixo}: o campo "${nomeCampo}" está incompleto.`);
    }

    if (
      campo.estado !== "nao_verificado" &&
      (!campo.fonteId || !fontes.has(campo.fonteId))
    ) {
      erro(
        `${prefixo}: o campo confirmado "${nomeCampo}" não aponta para uma fonte da ficha.`
      );
    }
  }

  if (!produto.afiliado || typeof produto.afiliado !== "object") {
    erro(`${prefixo}: falta o controle de link de afiliado.`);
  } else {
    if (!produto.afiliado.loja) {
      erro(`${prefixo}: falta o nome da loja afiliada.`);
    }
    if (produto.afiliado.url !== null) {
      if (!urlSegura(produto.afiliado.url)) {
        erro(`${prefixo}: o link de afiliado precisa de URL HTTPS válida.`);
      }
      if (!dataValida(produto.afiliado.atualizadoEm)) {
        erro(`${prefixo}: o link de afiliado precisa de data de atualização.`);
      }
    }
  }

  if (produto.preco?.valor !== null) {
    if (!produto.mercadoLivreId) {
      erro(`${prefixo}: preço informado sem ID do Mercado Livre.`);
    }
    if (!produto.preco?.coletadoEm || !dataValida(produto.preco.coletadoEm)) {
      erro(`${prefixo}: preço informado sem data de coleta válida.`);
    }
    if (!produto.preco?.url || !urlSegura(produto.preco.url)) {
      erro(`${prefixo}: preço informado sem URL HTTPS do anúncio.`);
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
    "publicado_em",
    "atualizado_em",
    "verificado_em",
    "categoria",
    "produtos",
    "fontes",
    "rascunho"
  ];

  for (const campo of camposObrigatorios) {
    if (data[campo] === undefined || data[campo] === null) {
      erro(`${prefixo}: falta o campo "${campo}" no início do arquivo.`);
    }
  }

  if (!Array.isArray(data.produtos) || data.produtos.length === 0) {
    erro(`${prefixo}: precisa citar pelo menos um produto.`);
  } else {
    for (const id of data.produtos) {
      const produto = produtos.find((item) => item.id === id);
      if (!produto) {
        erro(`${prefixo}: o produto "${id}" não existe na base.`);
      } else if (!produto.publicado) {
        erro(`${prefixo}: o produto "${id}" ainda está na fila de verificação.`);
      }
    }
  }

  if (!Array.isArray(data.fontes) || data.fontes.length === 0) {
    erro(`${prefixo}: precisa ter pelo menos uma fonte.`);
  } else {
    for (const fonte of data.fontes) {
      if (!urlSegura(fonte.url)) {
        erro(`${prefixo}: há uma fonte sem URL HTTPS válida.`);
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
    erro(`${prefixo}: o texto está curto demais para uma verificação útil.`);
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

    if (
      !Array.isArray(data.perguntas_frequentes) ||
      data.perguntas_frequentes.length < 2 ||
      data.perguntas_frequentes.length > 5
    ) {
      erro(`${prefixo}: artigo automático precisa de duas a cinco perguntas frequentes.`);
    }

    const textoEditorial = [
      data.titulo,
      data.pergunta_principal,
      data.resposta_curta,
      data.descricao,
      data.origem.pergunta_encontrada,
      data.origem.motivo,
      ...(data.perguntas_frequentes ?? []).flatMap((item) => [
        item.pergunta,
        item.resposta
      ]),
      content
    ].join("\n");

    if (/[—–]/u.test(textoEditorial)) {
      erro(`${prefixo}: artigo automático não pode usar travessão.`);
    }
  }

  if (/\bR\$\s?\d/i.test(content) && !/coletad[oa] em/i.test(content)) {
    erro(`${prefixo}: cita preço sem informar a data da coleta.`);
  }

  const afirmacoesPerigosas = [
    /aguenta (?:o |um )?(?:chuveiro|ar-condicionado)/i,
    /instale você mesmo/i,
    /ligue diretamente (?:na|à) rede/i
  ];

  for (const padrao of afirmacoesPerigosas) {
    if (padrao.test(content)) {
      erro(`${prefixo}: contém uma orientação elétrica bloqueada.`);
    }
  }
}

if (erros.length > 0) {
  console.error(`\nValidação recusada: ${erros.length} problema(s).\n`);
  for (const mensagem of erros) console.error(`- ${mensagem}`);
  process.exit(1);
}

const publicos = produtos.filter((produto) => produto.publicado).length;
const rascunhos = arquivos.length;
console.log(
  `Conteúdo válido: ${publicos} produto(s) público(s) e ${rascunhos} artigo(s) conferido(s).`
);
