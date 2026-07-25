import produtosJson from "../data/produtos.json";

export type EstadoCampo =
  | "compativel"
  | "incompativel"
  | "nao_verificado"
  | "confirmado";

export type CampoProduto = {
  valor: string;
  estado: EstadoCampo;
  fonteId: string | null;
};

export type FonteProduto = {
  id: string;
  titulo: string;
  url: string;
  acessadoEm: string;
};

export type ProdutoPublicado = {
  id: string;
  nome: string;
  descricao: string;
  marca: string;
  categoria: string;
  publicado: true;
  verificadoEm: string;
  mercadoLivreId: string | null;
  preco: {
    valor: number | null;
    moeda: string;
    coletadoEm: string | null;
    url: string | null;
    status: string;
  };
  campos: {
    protocolo: CampoProduto;
    hub: CampoProduto;
    alexa: CampoProduto;
    googleHome: CampoProduto;
    matter: CampoProduto;
    voltagem: CampoProduto;
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
  }).format(typeof data === "string" ? new Date(`${data}T12:00:00`) : data);
}

export function formatarPreco(valor: number, moeda = "BRL") {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: moeda
  }).format(valor);
}

export function rotuloCategoria(categoria: string) {
  const rotulos: Record<string, string> = {
    iluminacao: "Iluminação",
    tomadas: "Tomadas",
    assistentes: "Assistentes",
    sensores: "Sensores",
    hubs: "Hubs"
  };

  return rotulos[categoria] ?? categoria;
}
