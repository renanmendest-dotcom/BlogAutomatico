/**
 * Leitura e escrita dos arquivos de /data.
 *
 * Escrita é atômica: grava num temporário e renomeia. Um coletor morto no meio
 * da escrita não pode deixar `produtos.json` truncado — sem banco, esse arquivo
 * é a única cópia.
 */
import { readFileSync, renameSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const AQUI = dirname(fileURLToPath(import.meta.url));
export const RAIZ = join(AQUI, '..', '..');
export const PASTA_DADOS = join(RAIZ, 'data');

export function caminhoDados(nome: string): string {
  return join(PASTA_DADOS, nome);
}

export function lerJson<T>(nome: string): T {
  return JSON.parse(readFileSync(caminhoDados(nome), 'utf8')) as T;
}

/**
 * Grava com 2 espaços e quebra de linha final — o diff do git é a interface de
 * auditoria deste projeto, então o formato precisa ser estável e legível.
 */
export function gravarJson(nome: string, dados: unknown): void {
  const destino = caminhoDados(nome);
  const temporario = `${destino}.tmp`;
  writeFileSync(temporario, `${JSON.stringify(dados, null, 2)}\n`, 'utf8');
  renameSync(temporario, destino);
}

/** Data de hoje em `YYYY-MM-DD`, no fuso de São Paulo. */
export function hoje(): string {
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: 'America/Sao_Paulo',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(new Date());
}

/** Instante atual em ISO 8601 com segundos. */
export function agora(): string {
  return new Date().toISOString().replace(/\.\d{3}Z$/, 'Z');
}

/** O kill switch da Seção 11, checado também fora do CI. */
export function pausado(): boolean {
  try {
    readFileSync(join(RAIZ, 'PAUSE'), 'utf8');
    return true;
  } catch {
    return false;
  }
}
