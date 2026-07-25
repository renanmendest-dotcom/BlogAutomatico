/**
 * Cliente da API do Mercado Livre.
 *
 * Estado da autenticação, verificado em 25/07/2026: a API **não responde mais
 * sem token**. Endpoints que já foram públicos — inclusive `/sites/MLB` — devolvem
 * 403 com `PA_UNAUTHORIZED_RESULT_FROM_POLICIES`. O fluxo `client_credentials` é
 * obrigatório, e `ML_CLIENT_ID`/`ML_CLIENT_SECRET` precisam existir no ambiente.
 *
 * O token de `client_credentials` é de aplicação, não de usuário: não há refresh
 * token: quando expira, pede-se outro. É o que `tokenValido()` faz, com margem.
 */
import { buscarJson } from './http.ts';

const BASE = 'https://api.mercadolibre.com';

// Renova com folga: um token que expira no meio de uma coleta de 60 produtos
// derrubaria a metade final.
const MARGEM_EXPIRACAO_MS = 60_000;

export interface Credenciais {
  clientId: string;
  clientSecret: string;
}

/** Lê as credenciais do ambiente. `null` quando não configuradas. */
export function credenciaisDoAmbiente(): Credenciais | null {
  const clientId = process.env.ML_CLIENT_ID?.trim();
  const clientSecret = process.env.ML_CLIENT_SECRET?.trim();
  if (!clientId || !clientSecret) return null;
  return { clientId, clientSecret };
}

interface TokenEmCache {
  valor: string;
  expiraEm: number;
}

let cache: TokenEmCache | null = null;

interface RespostaToken {
  access_token: string;
  expires_in: number;
}

/** Token de aplicação, reaproveitado enquanto vale. */
export async function tokenValido(cred: Credenciais): Promise<string | null> {
  if (cache && cache.expiraEm - MARGEM_EXPIRACAO_MS > Date.now()) {
    return cache.valor;
  }

  const corpo = new URLSearchParams({
    grant_type: 'client_credentials',
    client_id: cred.clientId,
    client_secret: cred.clientSecret,
  }).toString();

  const r = await buscarJson<RespostaToken>(`${BASE}/oauth/token`, {
    metodo: 'POST',
    corpo,
    cabecalhos: { 'Content-Type': 'application/x-www-form-urlencoded' },
  });

  if (!r.ok || !r.dados?.access_token) {
    console.error(`[ml] falha ao obter token: ${r.erro ?? 'resposta sem access_token'}`);
    return null;
  }

  cache = {
    valor: r.dados.access_token,
    expiraEm: Date.now() + (r.dados.expires_in ?? 21_600) * 1000,
  };
  return cache.valor;
}

/** Invalida o cache. Usado quando a API devolve 401 no meio da coleta. */
export function esquecerToken(): void {
  cache = null;
}

// ---------------------------------------------------------------------------
// Chamadas
// ---------------------------------------------------------------------------

/** Formato cru da API. Só o que é usado, e tudo opcional: o contrato muda. */
export interface ItemML {
  id?: string;
  title?: string;
  price?: number;
  original_price?: number | null;
  available_quantity?: number;
  sold_quantity?: number;
  status?: string;
  condition?: string;
  permalink?: string;
  thumbnail?: string;
  secure_thumbnail?: string;
  seller_id?: number;
  seller?: { id?: number; nickname?: string };
  attributes?: Array<{ id?: string; name?: string; value_name?: string | null }>;
}

interface RespostaBusca {
  results?: ItemML[];
  paging?: { total?: number };
}

async function comToken<T>(
  cred: Credenciais,
  chamada: (token: string) => Promise<{ ok: boolean; status: number; dados: T | null; erro: string | null }>,
): Promise<T | null> {
  const token = await tokenValido(cred);
  if (!token) return null;

  let r = await chamada(token);

  // 401 no meio da coleta = token morreu antes da hora. Pede outro, uma vez só.
  if (!r.ok && r.status === 401) {
    esquecerToken();
    const novo = await tokenValido(cred);
    if (!novo) return null;
    r = await chamada(novo);
  }

  if (!r.ok) {
    console.error(`[ml] ${r.erro}`);
    return null;
  }
  return r.dados;
}

/** Busca por termo. `limit` máximo aceito pela API é 50. */
export async function buscar(
  cred: Credenciais,
  termo: string,
  limite = 50,
): Promise<ItemML[]> {
  const url = `${BASE}/sites/MLB/search?q=${encodeURIComponent(termo)}&limit=${Math.min(limite, 50)}`;
  const dados = await comToken<RespostaBusca>(cred, (token) =>
    buscarJson<RespostaBusca>(url, { cabecalhos: { Authorization: `Bearer ${token}` } }),
  );
  return dados?.results ?? [];
}

/** Detalhes em lote. A API aceita até 20 ids por chamada. */
export async function detalhes(cred: Credenciais, ids: string[]): Promise<ItemML[]> {
  const saida: ItemML[] = [];

  for (let i = 0; i < ids.length; i += 20) {
    const lote = ids.slice(i, i + 20);
    const url = `${BASE}/items?ids=${lote.join(',')}`;
    const dados = await comToken<Array<{ code?: number; body?: ItemML }>>(cred, (token) =>
      buscarJson<Array<{ code?: number; body?: ItemML }>>(url, {
        cabecalhos: { Authorization: `Bearer ${token}` },
      }),
    );
    if (!dados) continue;
    for (const entrada of dados) {
      if (entrada.code === 200 && entrada.body) saida.push(entrada.body);
    }
  }

  return saida;
}

export interface VendedorML {
  id?: number;
  nickname?: string;
  seller_reputation?: {
    level_id?: string | null;
    power_seller_status?: string | null;
    transactions?: { total?: number };
  };
}

const cacheVendedor = new Map<number, VendedorML | null>();

/** Dados do vendedor, com cache: vários produtos dividem o mesmo vendedor. */
export async function vendedor(cred: Credenciais, id: number): Promise<VendedorML | null> {
  if (cacheVendedor.has(id)) return cacheVendedor.get(id) ?? null;

  const dados = await comToken<VendedorML>(cred, (token) =>
    buscarJson<VendedorML>(`${BASE}/users/${id}`, {
      cabecalhos: { Authorization: `Bearer ${token}` },
    }),
  );

  cacheVendedor.set(id, dados);
  return dados;
}

/**
 * Diagnóstico do estado da autenticação.
 *
 * Primeira tarefa da Fase B (Seção 6.1) e vale reexecutar: se o ML voltar a
 * abrir os endpoints, o pipeline pode dispensar credencial.
 */
export async function diagnosticar(): Promise<{
  publico: boolean;
  status: number;
  temCredenciais: boolean;
  tokenOk: boolean | null;
}> {
  const r = await buscarJson(`${BASE}/sites/MLB/search?q=teste&limit=1`, { maxTentativas: 1 });
  const cred = credenciaisDoAmbiente();
  return {
    publico: r.ok,
    status: r.status,
    temCredenciais: cred !== null,
    tokenOk: cred ? (await tokenValido(cred)) !== null : null,
  };
}
