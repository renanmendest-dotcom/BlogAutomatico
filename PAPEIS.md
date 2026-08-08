# Quem faz o quê no Curva Viva

O projeto é tocado por duas IAs, com áreas separadas. Este arquivo existe para
o proprietário poder falar com qualquer uma das duas sem que uma desfaça o
trabalho da outra.

| | **Claude Code** | **Codex** |
|---|---|---|
| Responsável por | Como o site **parece e funciona** | O que o site **publica** |
| Trabalha em | Design, layout, componentes | Conteúdo, produtos, imagens |
| Frequência | Quando o proprietário pede | Automático, segundas, quartas e sextas |

---

## Claude Code — design e front-end

**Manda em:**

- `src/styles/global.css`, o sistema visual inteiro
- `src/components/*.astro` e `src/layouts/*.astro`
- Estrutura das páginas em `src/pages/`, exceto o texto publicado
- Tipografia, paleta, espaçamento, sombra, raio, movimento
- Acessibilidade: contraste, foco, leitor de tela, `prefers-reduced-motion`
- Desempenho: peso de página, Core Web Vitals, carregamento de fonte
- Busca, navegação, trilha, dados estruturados de página
- `scripts/revisar-visual.cjs`, a verificação visual

**Não mexe em:**

- Texto de artigo em `src/data/posts/`
- Dados de produto em `src/data/produtos.json`
- Imagens de conteúdo em `public/ilustracoes/`
- Cadência e volume de publicação

**Quando cria um formato novo** (por exemplo o modelo `ranking`), entrega o
suporte completo: schema, validador, componente e estilo. Depois avisa o Codex
pelo `.github/INSTRUCOES-IA.md` que o formato existe e como preencher.

---

## Codex — conteúdo e publicação

**Manda em:**

- Artigos em `src/data/posts/`
- Produtos, preços e ofertas em `src/data/produtos.json`
- Ilustrações de artigo em `public/ilustracoes/`
- Avatares em `public/avatares/`
- Pesquisa de demanda, escolha de pauta e links de afiliado
- Cadência e volume, dentro das regras do `.github/INSTRUCOES-IA.md`

**Não mexe em:**

- `src/styles/global.css`
- Componentes e layouts
- Estrutura de página e navegação

**Se um artigo precisar de um formato que o site não tem**, o Codex não
improvisa layout: registra a necessidade e o proprietário pede o formato ao
Claude Code.

---

## Fronteira compartilhada

Três arquivos são tocados pelos dois. Quem mexe precisa avisar.

| Arquivo | Claude Code | Codex |
|---|---|---|
| `src/content.config.ts` | Cria e altera campos | Preenche os campos |
| `scripts/validar-conteudo.mjs` | Cria e altera regras | Obedece as regras |
| `src/lib/produtos.ts` | Funções e formatação | Cadastra rótulo de categoria nova |

---

## Regra de convivência

Os dois publicam direto na `main`. Para não haver atropelo:

1. **Sempre rodar `git fetch` e conferir o estado antes de commitar.** Já
   aconteceu de o Codex publicar um artigo no meio de uma sessão de design.
2. **Commitar só os próprios arquivos.** Se aparecer no `git status` algo que
   não é da sua área, deixe fora do commit e avise o proprietário.
3. **Nunca desfazer o commit do outro.** Em caso de conflito, preservar os dois
   lados e avisar.
4. **Verificações completas antes de publicar**, sempre:

```bash
pnpm validar && pnpm check && pnpm build
```

E, com o `pnpm preview` rodando em outro terminal:

```bash
node scripts/revisar-visual.cjs
```

Só publicar com `"aprovado": true`.

---

## Registrar o que mudou

Os dois, ao terminar um trabalho, acrescentam uma entrada no topo da lista de
mudanças do **`HISTORICO.md`**: data, quem fez, o que mudou e por quê. Curto.

Isso não é burocracia. É o que permite ao proprietário abrir uma conversa nova
com qualquer uma das duas IAs e dizer apenas "leia os arquivos do projeto",
sem reexplicar tudo. Decisão tomada em conversa também entra lá, senão a mesma
pergunta volta daqui a duas semanas.

Ler o `HISTORICO.md` é o primeiro passo de qualquer sessão.

---

## Onde está cada instrução

- **`HISTORICO.md`** — estado atual, decisões tomadas, o que está em aberto e o
  registro de mudanças. **Leia primeiro.**
- **`AGENTS.md`** — autonomia, autorização e limites gerais.
- **`.github/INSTRUCOES-IA.md`** — regras editoriais: volume, formato, tom,
  preço, imagem, avatares e dupla revisão. É o manual do Codex.
- **`PAPEIS.md`** — este arquivo, a divisão de responsabilidade.
- **`README.md`** — visão geral e comandos.

---

## Ambiente

Node e pnpm estão instalados em `%LOCALAPPDATA%\Programs\nodejs`, no PATH do
usuário. Os comandos do `README.md` funcionam em terminal novo. Se `pnpm` não
for reconhecido, o terminal foi aberto antes da instalação: basta abrir outro.
