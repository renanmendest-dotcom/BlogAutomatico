/**
 * Cliente HTTP com backoff exponencial.
 *
 * Regra da Seção 6.1: se um coletor falhar, ele não pode derrubar o pipeline
 * inteiro. Por isso nada aqui lança por padrão em erro de rede — quem chama
 * decide o que fazer, e a decisão certa quase sempre é registrar o erro, usar o
 * último dado bom e seguir.
 */

export interface RespostaHttp<T> {
  ok: boolean;
  status: number;
  dados: T | null;
  erro: string | null;
  /** Quantas tentativas foram gastas, incluindo a que deu certo. */
  tentativas: number;
}

export interface OpcoesHttp {
  cabecalhos?: Record<string, string>;
  metodo?: 'GET' | 'POST';
  corpo?: string;
  /** Tentativas totais, incluindo a primeira. */
  maxTentativas?: number;
  /** Espera da primeira repetição, em ms. Dobra a cada falha. */
  esperaInicialMs?: number;
  timeoutMs?: number;
}

const UA = 'casaconectada-coletor/0.1 (+https://casaconectada.com.br/como-fazemos)';

const dormir = (ms: number) => new Promise((r) => setTimeout(r, ms));

/** 429 e 5xx merecem nova tentativa. 4xx restante é erro nosso — repetir não conserta. */
function valeRepetir(status: number): boolean {
  return status === 429 || status === 408 || status >= 500;
}

export async function buscarJson<T = unknown>(
  url: string,
  opcoes: OpcoesHttp = {},
): Promise<RespostaHttp<T>> {
  const {
    cabecalhos = {},
    metodo = 'GET',
    corpo,
    maxTentativas = 4,
    esperaInicialMs = 800,
    timeoutMs = 15_000,
  } = opcoes;

  let ultimoErro = 'erro desconhecido';
  let ultimoStatus = 0;

  for (let tentativa = 1; tentativa <= maxTentativas; tentativa++) {
    const abortar = AbortSignal.timeout(timeoutMs);

    try {
      const resposta = await fetch(url, {
        method: metodo,
        body: corpo,
        signal: abortar,
        headers: { 'User-Agent': UA, Accept: 'application/json', ...cabecalhos },
      });

      ultimoStatus = resposta.status;

      if (resposta.ok) {
        const texto = await resposta.text();
        try {
          return {
            ok: true,
            status: resposta.status,
            dados: (texto ? JSON.parse(texto) : null) as T,
            erro: null,
            tentativas: tentativa,
          };
        } catch {
          return {
            ok: false,
            status: resposta.status,
            dados: null,
            erro: 'resposta não é JSON válido',
            tentativas: tentativa,
          };
        }
      }

      const texto = (await resposta.text()).slice(0, 300).replace(/\s+/g, ' ');
      ultimoErro = `HTTP ${resposta.status}: ${texto}`;

      if (!valeRepetir(resposta.status)) {
        return {
          ok: false,
          status: resposta.status,
          dados: null,
          erro: ultimoErro,
          tentativas: tentativa,
        };
      }

      // O servidor mandando esperar tem prioridade sobre o nosso cálculo.
      const retryAfter = Number(resposta.headers.get('retry-after'));
      const espera = Number.isFinite(retryAfter) && retryAfter > 0
        ? retryAfter * 1000
        : esperaInicialMs * 2 ** (tentativa - 1);

      if (tentativa < maxTentativas) {
        // Jitter para várias chamadas em paralelo não repetirem no mesmo instante.
        await dormir(espera + Math.random() * 400);
      }
    } catch (e) {
      ultimoErro = e instanceof Error ? e.message : String(e);
      if (tentativa < maxTentativas) {
        await dormir(esperaInicialMs * 2 ** (tentativa - 1) + Math.random() * 400);
      }
    }
  }

  return {
    ok: false,
    status: ultimoStatus,
    dados: null,
    erro: `${ultimoErro} (após ${maxTentativas} tentativas)`,
    tentativas: maxTentativas,
  };
}

/** Igual, mas devolve texto cru — o autocomplete do Google não manda JSON limpo. */
export async function buscarTexto(
  url: string,
  opcoes: OpcoesHttp = {},
): Promise<RespostaHttp<string>> {
  const { cabecalhos = {}, maxTentativas = 4, esperaInicialMs = 800, timeoutMs = 15_000 } = opcoes;

  let ultimoErro = 'erro desconhecido';
  let ultimoStatus = 0;

  for (let tentativa = 1; tentativa <= maxTentativas; tentativa++) {
    try {
      const resposta = await fetch(url, {
        signal: AbortSignal.timeout(timeoutMs),
        headers: { 'User-Agent': UA, ...cabecalhos },
      });
      ultimoStatus = resposta.status;

      if (resposta.ok) {
        return {
          ok: true,
          status: resposta.status,
          dados: await resposta.text(),
          erro: null,
          tentativas: tentativa,
        };
      }

      ultimoErro = `HTTP ${resposta.status}`;
      if (!valeRepetir(resposta.status)) {
        return { ok: false, status: resposta.status, dados: null, erro: ultimoErro, tentativas: tentativa };
      }
    } catch (e) {
      ultimoErro = e instanceof Error ? e.message : String(e);
    }

    if (tentativa < maxTentativas) {
      await dormir(esperaInicialMs * 2 ** (tentativa - 1) + Math.random() * 400);
    }
  }

  return {
    ok: false,
    status: ultimoStatus,
    dados: null,
    erro: `${ultimoErro} (após ${maxTentativas} tentativas)`,
    tentativas: maxTentativas,
  };
}
