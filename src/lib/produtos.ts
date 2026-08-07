import produtosJson from "../data/produtos.json";

export type FonteProduto = {
  id: string;
  titulo: string;
  url: string;
  acessadoEm: string;
};

export type DestaqueProduto = {
  rotulo: string;
  valor: string;
  fonteId: string | null;
};

export type ProdutoPublicado = {
  id: string;
  nome: string;
  descricao: string;
  marca: string;
  categoria: string;
  publicado: true;
  verificadoEm: string;
  perfil: {
    curvaturas: string[];
    textura: string;
    intensidade: string;
    objetivos: string[];
  };
  imagem?: {
    src: string;
    alt: string;
    credito: string;
    fonteUrl: string;
  };
  /** Opcional. Sem preço cadastrado o bloco some da página, em vez de
   *  mostrar aviso de campo vazio. */
  preco?: {
    min: number;
    max: number;
    moeda: "BRL";
    verificadoEm: string;
  };
  destaques: DestaqueProduto[];
  oferta: {
    loja: string;
    url: string | null;
    atualizadoEm: string | null;
  };
  analise: {
    tipo: "documental" | "teste_real";
    testado: boolean;
    nota: string;
  };
  fontes: FonteProduto[];
};

type ProdutoNaFila = {
  id: string;
  nome: string;
  marca: string;
  categoria: string;
  publicado: false;
  status: string;
};

export const todosOsProdutos = produtosJson as unknown as Array<
  ProdutoPublicado | ProdutoNaFila
>;

export const produtosPublicados = todosOsProdutos.filter(
  (produto) => produto.publicado
) as ProdutoPublicado[];

export const produtosNaFila = todosOsProdutos.filter(
  (produto) => !produto.publicado
) as ProdutoNaFila[];

export function buscarProduto(id: string) {
  return produtosPublicados.find((produto) => produto.id === id);
}

export function formatarData(data: string | Date) {
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
    timeZone: "UTC"
  }).format(typeof data === "string" ? new Date(`${data}T12:00:00Z`) : data);
}

export function rotuloCategoria(categoria: string) {
  const rotulos: Record<string, string> = {
    curvatura: "Curvatura",
    porosidade: "Porosidade",
    finalizacao: "Finalização",
    lavagem: "Lavagem",
    tratamento: "Tratamento",
    couro_cabeludo: "Couro cabeludo",
    produtos: "Produtos",
    creme_para_pentear: "Creme para pentear",
    gelatina: "Gelatina",
    mousse: "Mousse",
    bruma: "Bruma",
    mascara: "Máscara",
    protetor_termico: "Protetor térmico",
    ativador: "Ativador de cachos",
    leave_in: "Leave-in",
    oleo: "Óleo",
    shampoo: "Shampoo",
    condicionador: "Condicionador"
  };

  // Sem rótulo cadastrado, mostrar a chave crua exporia "protetor_termico"
  // no lugar de "Protetor térmico". Formatar é melhor do que vazar o dado interno.
  return (
    rotulos[categoria] ??
    categoria
      .replace(/_/g, " ")
      .replace(/^./, (letra) => letra.toUpperCase())
  );
}

export function resumoCurvaturas(curvaturas: string[]) {
  const curvaturasPublicaveis = curvaturas
    .map((curvatura) => curvatura.replace(/,\s*sem\s+.+$/i, "").trim())
    .filter(informacaoProdutoPublicavel);

  if (curvaturasPublicaveis.length > 6) {
    return "Ondulados, cacheados e crespos";
  }

  return curvaturasPublicaveis.join(", ");
}

export function informacaoProdutoPublicavel(valor: string | null | undefined) {
  if (!valor?.trim()) return false;
  return !/^(?:não\s+informad|não\s+encontrad|indisponível|não\s+disponível)/i.test(
    valor.trim()
  );
}

const formatadorReal = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
  minimumFractionDigits: 0,
  maximumFractionDigits: 0
});

/** "R$ 25 a R$ 40", ou só "R$ 32" quando a faixa é um valor único. */
export function faixaDePreco(produto: ProdutoPublicado) {
  const preco = produto.preco;
  if (!preco || !(preco.min > 0) || !(preco.max > 0)) return null;

  return preco.min === preco.max
    ? formatadorReal.format(preco.min)
    : `${formatadorReal.format(preco.min)} a ${formatadorReal.format(preco.max)}`;
}

/** Tamanho vindo do fim do nome, por exemplo "... 550 g" -> 550 g. */
export function tamanhoDoProduto(produto: ProdutoPublicado) {
  const encontrado = produto.nome.match(
    /\s(\d+(?:[.,]\d+)?)\s?(g|kg|ml|l)\s*$/i
  );
  if (!encontrado) return null;

  const numero = Number(encontrado[1].replace(",", "."));
  const unidade = encontrado[2].toLocaleLowerCase("pt-BR");
  if (!Number.isFinite(numero) || numero <= 0) return null;

  // Normalizar para g/ml deixa o custo comparável entre embalagens.
  if (unidade === "kg") return { quantidade: numero * 1000, unidade: "g" };
  if (unidade === "l") return { quantidade: numero * 1000, unidade: "ml" };
  return { quantidade: numero, unidade };
}

/** Custo por 100 g/ml: o número que deixa comparar embalagens de tamanhos
 *  diferentes e que quase nenhum concorrente calcula. */
export function custoPorCemProduto(produto: ProdutoPublicado) {
  const preco = produto.preco;
  const tamanho = tamanhoDoProduto(produto);
  if (!preco || !tamanho) return null;

  const medio = (preco.min + preco.max) / 2;
  if (!(medio > 0)) return null;

  const valor = (medio / tamanho.quantidade) * 100;
  return `${new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL"
  }).format(valor)} a cada 100 ${tamanho.unidade}`;
}

/** O que o produto resolve. Diferencia os cartões muito melhor do que a lista
 *  de curvaturas, que hoje repete "Ondulados, Cacheados, Crespos" em quase todos. */
export function resumoObjetivos(objetivos: string[], limite = 3) {
  return objetivos.filter(informacaoProdutoPublicavel).slice(0, limite).join(", ");
}

export function linkCompraProduto(produto: ProdutoPublicado) {
  if (produto.oferta.url) return produto.oferta.url;

  return (
    produto.fontes.find((fonte) =>
      fonte.titulo.toLocaleLowerCase("pt-BR").includes("mercado livre")
    )?.url ?? null
  );
}
