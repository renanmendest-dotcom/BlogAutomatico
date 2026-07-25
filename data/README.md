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

A matriz. Formato de cada entrada em `entradas[]` conforme Seção 6.3 do `PROJETO.md`.
**Todo campo de compatibilidade só pode sair de `nao_verificado` com `fonte` e
`url_fonte` preenchidos.** O site exibe fonte e data ao lado do dado — é isso que
torna o conteúdo citável.

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
