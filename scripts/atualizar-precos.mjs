import fs from "node:fs/promises";
import path from "node:path";

const raiz = process.cwd();
const pausa = path.join(raiz, "PAUSE");
const arquivoProdutos = path.join(raiz, "src", "data", "produtos.json");

try {
  await fs.access(pausa);
  console.log("PAUSE encontrado. Nenhum preço foi consultado.");
  process.exit(0);
} catch {
  // O arquivo não existe; a atualização pode seguir.
}

const produtos = JSON.parse(await fs.readFile(arquivoProdutos, "utf8"));
const monitorados = produtos.filter(
  (produto) => produto.publicado && produto.mercadoLivreId
);

if (monitorados.length === 0) {
  console.log(
    "Nenhum produto possui mercadoLivreId. O site continua funcionando sem preços."
  );
  process.exit(0);
}

const token = process.env.ML_ACCESS_TOKEN?.trim();
const headers = {
  Accept: "application/json",
  "User-Agent": "CombinaCasa/0.1 (price-verifier)"
};

if (token) headers.Authorization = `Bearer ${token}`;

function separarEmLotes(lista, tamanho) {
  const lotes = [];
  for (let indice = 0; indice < lista.length; indice += tamanho) {
    lotes.push(lista.slice(indice, indice + tamanho));
  }
  return lotes;
}

const respostas = [];
for (const lote of separarEmLotes(monitorados, 20)) {
  const ids = lote.map((produto) => produto.mercadoLivreId).join(",");
  const endpoint = `https://api.mercadolibre.com/items?ids=${encodeURIComponent(ids)}`;
  const resposta = await fetch(endpoint, { headers });

  if (!resposta.ok) {
    const dica =
      resposta.status === 401 || resposta.status === 403
        ? " Cadastre ou renove o secret ML_ACCESS_TOKEN."
        : "";
    throw new Error(
      `Mercado Livre respondeu ${resposta.status}.${dica} O último preço bom foi preservado.`
    );
  }

  const dados = await resposta.json();
  respostas.push(...dados);
}

const hoje = new Date().toISOString().slice(0, 10);
let atualizados = 0;

for (const item of respostas) {
  if (item.code !== 200 || !item.body) continue;

  const produto = produtos.find(
    (candidato) => candidato.mercadoLivreId === item.body.id
  );
  if (!produto) continue;

  produto.preco = {
    valor: item.body.price,
    moeda: item.body.currency_id || "BRL",
    coletadoEm: hoje,
    url: item.body.permalink,
    status: item.body.status === "active" ? "disponivel" : "indisponivel"
  };
  atualizados += 1;
}

await fs.writeFile(
  arquivoProdutos,
  `${JSON.stringify(produtos, null, 2)}\n`,
  "utf8"
);

console.log(`${atualizados} preço(s) atualizado(s) em ${hoje}.`);
