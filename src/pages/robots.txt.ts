import type { APIRoute } from "astro";

/** Rastreadores de IA liberados de propósito. Um dos objetivos do projeto é ser
 *  citado como fonte por ChatGPT, Claude, Perplexity e Gemini, e bloquear esses
 *  agentes seria trabalhar contra o próprio objetivo.
 *
 *  Estão explícitos, e não só cobertos pelo "*", para a intenção ficar clara e
 *  para ninguém remover o acesso por engano numa mudança futura. */
const agentesDeIa = [
  "GPTBot",
  "OAI-SearchBot",
  "ChatGPT-User",
  "ClaudeBot",
  "Claude-User",
  "Claude-SearchBot",
  "PerplexityBot",
  "Perplexity-User",
  "Google-Extended",
  "Applebot-Extended",
  "Amazonbot",
  "meta-externalagent",
  "CCBot"
];

export const GET: APIRoute = ({ site }) => {
  const sitemap = new URL("/sitemap.xml", site);

  // A página de busca não é bloqueada aqui de propósito: ela já manda noindex
  // no HTML, e um Disallow impediria o rastreador de ler essa instrução, o que
  // deixaria a URL elegível a aparecer sem conteúdo.
  const linhas = [
    "User-agent: *",
    "Allow: /",
    "",
    ...agentesDeIa.flatMap((agente) => [`User-agent: ${agente}`, "Allow: /", ""]),
    `Sitemap: ${sitemap}`
  ];

  return new Response(`${linhas.join("\n")}\n`, {
    headers: { "Content-Type": "text/plain; charset=utf-8" }
  });
};
