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
    mascara: "Máscara"
  };

  return rotulos[categoria] ?? categoria;
}

export function resumoCurvaturas(curvaturas: string[]) {
  if (curvaturas.length > 6) return "Ondulados, cacheados e crespos";
  return curvaturas.join(", ");
}
