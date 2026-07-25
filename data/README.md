# Camada de dados

Sem banco. JSON versionado em git — o histórico vem de graça e todo dado é diffável
e auditável em code review. Os tipos TypeScript canônicos estão em
[`src/lib/tipos.ts`](../src/lib/tipos.ts); estes arquivos precisam sempre validar
contra eles.

Na Fase A todos os arquivos estão vazios com a estrutura já definida. A população
é tarefa da Fase B.

## Formatos

### `produtos.json`

```jsonc
{
  "atualizado_em": "2026-07-25",
  "fonte": "api_mercadolivre",
  "produtos": [
    {
      "id": "MLB1234567890",
      "titulo": "...",
      "preco": 49.9,
      "preco_original": 79.9,
      "disponivel": true,
      "quantidade_vendida": 5000,        // melhor proxy gratuito de demanda
      "vendedor": { "id": 0, "nome": "...", "reputacao": "gold", "vendas_totais": 0 },
      "atributos": { "marca": "...", "modelo": "...", "voltagem": "...", "conectividade": "..." },
      "permalink": "https://...",
      "thumbnail": "https://...",
      "coletado_em": "2026-07-25T03:11:00Z"
    }
  ]
}
```

### `compatibilidade.json`

A matriz. **Todo campo só pode sair de `nao_verificado` com `fonte` e `url_fonte`
preenchidos**, e `scripts/validar-matriz.ts` derruba o CI quando isso é violado.
O site exibe fonte e data ao lado do dado — é isso que torna o conteúdo citável.

Uma diferença em relação à Seção 6.3 do `PROJETO.md`: a chave `produto_id` é um
slug `marca-modelo` (`intelbras-ews-1001`), não o id do Mercado Livre. Anúncio do
ML é encerrado e recriado o tempo todo; se a chave fosse o anúncio, a matriz
perderia o histórico de verificação a cada troca. O que é compatível é o
dispositivo, não o anúncio. Os anúncios que vendem cada dispositivo ficam em
`ml_ids[]`, e é por ali que a entrada encontra preço em `produtos.json`.

O campo opcional `notas[]` guarda ressalvas que a fonte deixa explícitas
("só a P110 mede consumo", "descontinuado, substituído pelo 02P"). Aparecem na
ficha. Nunca use para especular.

### `sementes.json`

Termos de busca do nicho, sementes de demanda e marcas relevantes. Entrada dos
dois coletores.

### `demanda.json`

Saída de `coletar-trends.ts`: cauda longa crua do autocomplete do Google em
pt-BR, classificada por formato (pergunta, comparação, transacional, genérico).
Não é volume de busca — é o que o Google sugere, o que indica demanda sem medir.
Entrada do agente de descoberta da Fase C.

### `alertas.json`

Saída de `coletar-ml.ts`: produtos que mudaram de preço acima de 15%, sumiram ou
voltaram. Regravado a cada coleta. Consumido pelo agente publicador na Fase D.

### `precos-historico.json`

`series` é um mapa `id do ML -> array append-only`, uma amostra por dia:

```jsonc
{ "series": { "MLB1234567890": [{ "data": "2026-07-25", "preco": 49.9, "disponivel": true }] } }
```

Append-only. Reescrever ponto antigo apaga a série temporal, que é a vantagem
estrutural do projeto sobre sites humanos.

### `pautas.json`

Fila priorizada pelo score da Seção 7.1, ordenada por `score` decrescente.

### `publicados.json`

Estado do agendador: contagem contra o teto anual de 180, data da última
publicação (para a regra das 18 horas) e o log do que já saiu.

### `links-afiliado.json`

`links` é um mapa `id do ML -> URL de afiliado`.
