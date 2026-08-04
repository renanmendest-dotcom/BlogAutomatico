import {
  produtosPublicados,
  type ProdutoPublicado
} from "./produtos";

export const caminhosConteudo = [
  "ondulados",
  "cacheados",
  "crespos",
  "descobrir-meu-cabelo"
] as const;

export type CaminhoConteudo = (typeof caminhosConteudo)[number];

const radicaisPorTipo = {
  ondulados: "ondulad",
  cacheados: "cachead",
  crespos: "cresp"
} as const;

function produtoIncluiTipo(
  produto: ProdutoPublicado,
  tipo: keyof typeof radicaisPorTipo
) {
  const radical = radicaisPorTipo[tipo];
  return produto.perfil.curvaturas.some((curvatura) =>
    curvatura.toLocaleLowerCase("pt-BR").includes(radical)
  );
}

export function produtosDoCaminho(caminho: CaminhoConteudo) {
  if (caminho === "descobrir-meu-cabelo") {
    return produtosPublicados.filter((produto) =>
      (Object.keys(radicaisPorTipo) as Array<keyof typeof radicaisPorTipo>).every(
        (tipo) => produtoIncluiTipo(produto, tipo)
      )
    );
  }

  return produtosPublicados.filter((produto) =>
    produtoIncluiTipo(produto, caminho)
  );
}
