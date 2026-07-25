/**
 * Lógica compartilhada do chip de compatibilidade.
 *
 * O elemento assinatura do site e o schema JSON-LD saem daqui — as duas coisas
 * leem a mesma função, então é impossível o visual dizer uma coisa e o dado
 * estruturado dizer outra.
 */
import type {
  Assistente,
  EntradaCompatibilidade,
  EstadoAssistente,
  Protocolo,
  Voltagem,
} from './tipos';

/** As três posições do indicador: compatível, incompatível, não verificado. */
export type PosicaoIndicador = 'ok' | 'atencao' | 'nulo';

/**
 * `via_hub` é compatível — com ressalva, que o rótulo carrega. Não vira
 * `atencao`: quem já tem o hub tem compatibilidade de fato.
 */
export function posicao(estado: EstadoAssistente): PosicaoIndicador {
  switch (estado) {
    case 'nativo':
    case 'via_hub':
      return 'ok';
    case 'nao':
      return 'atencao';
    case 'nao_verificado':
      return 'nulo';
  }
}

export const ROTULO_ASSISTENTE: Record<Assistente, string> = {
  alexa: 'Alexa',
  google_home: 'Google Home',
  apple_home: 'Apple Home',
  smartthings: 'SmartThings',
};

export const ROTULO_ESTADO: Record<EstadoAssistente, string> = {
  nativo: 'nativo',
  via_hub: 'via hub',
  nao: 'não',
  nao_verificado: 'não verificado',
};

/** Texto lido por leitor de tela — o ícone sozinho não comunica estado. */
export const ESTADO_ACESSIVEL: Record<EstadoAssistente, string> = {
  nativo: 'compatível de forma nativa',
  via_hub: 'compatível, mas exige hub',
  nao: 'não compatível',
  nao_verificado: 'compatibilidade não verificada',
};

export const ROTULO_PROTOCOLO: Record<Protocolo, string> = {
  'wifi_2.4': 'Wi-Fi 2,4 GHz',
  zigbee: 'Zigbee',
  bluetooth: 'Bluetooth',
  matter: 'Matter',
  thread: 'Thread',
  nao_verificado: 'não verificado',
};

export const ROTULO_VOLTAGEM: Record<Voltagem, string> = {
  '127': '127 V',
  '220': '220 V',
  bivolt: 'Bivolt',
  nao_verificado: 'não verificado',
};

export const ROTULO_FONTE: Record<string, string> = {
  manual_fabricante: 'Manual do fabricante',
  ficha_ml: 'Ficha técnica no Mercado Livre',
  site_oficial: 'Site oficial do fabricante',
  nao_verificado: 'Sem fonte confirmada',
};

export const ASSISTENTES: Assistente[] = [
  'alexa',
  'google_home',
  'apple_home',
  'smartthings',
];

/** Estado de um assistente, com fallback seguro quando não há entrada na matriz. */
export function estadoDe(
  entrada: EntradaCompatibilidade | null,
  assistente: Assistente,
): EstadoAssistente {
  return entrada?.assistentes[assistente] ?? 'nao_verificado';
}

/** Data legível em pt-BR a partir de `YYYY-MM-DD`. */
export function dataLegivel(iso: string | null): string {
  if (!iso) return '—';
  const [ano, mes, dia] = iso.split('-');
  if (!ano || !mes || !dia) return iso;
  return `${dia}/${mes}/${ano}`;
}

/** Procedência exibida no chip e repetida no schema. */
export function procedencia(entrada: EntradaCompatibilidade | null): string {
  if (!entrada || entrada.fonte === 'nao_verificado') {
    return 'Sem fonte confirmada — este campo aguarda verificação.';
  }
  const rotulo = ROTULO_FONTE[entrada.fonte] ?? entrada.fonte;
  return `${rotulo} · verificado em ${dataLegivel(entrada.verificado_em)}`;
}

/**
 * A entrada da matriz vira `PropertyValue[]` para o `additionalProperty` do
 * schema `Product`.
 *
 * Campos não verificados ficam de fora: schema errado é pior que schema ausente,
 * e afirmar `nao_verificado` como propriedade estruturada é afirmar um dado
 * que não existe.
 */
export function propriedadesSchema(
  entrada: EntradaCompatibilidade | null,
): Array<Record<string, unknown>> {
  if (!entrada) return [];
  const props: Array<Record<string, unknown>> = [];

  if (entrada.protocolo !== 'nao_verificado') {
    props.push(prop('Protocolo', ROTULO_PROTOCOLO[entrada.protocolo], entrada));
  }
  if (entrada.voltagem !== 'nao_verificado') {
    props.push(prop('Voltagem', ROTULO_VOLTAGEM[entrada.voltagem], entrada));
  }
  if (entrada.hub_necessario !== null) {
    props.push(prop('Exige hub', entrada.hub_necessario ? 'sim' : 'não', entrada));
  }
  if (entrada.funciona_offline !== null) {
    props.push(
      prop('Funciona sem internet', entrada.funciona_offline ? 'sim' : 'não', entrada),
    );
  }

  for (const a of ASSISTENTES) {
    const estado = entrada.assistentes[a];
    if (estado === 'nao_verificado') continue;
    props.push(prop(`Compatível com ${ROTULO_ASSISTENTE[a]}`, ROTULO_ESTADO[estado], entrada));
  }

  return props;
}

function prop(
  nome: string,
  valor: string,
  entrada: EntradaCompatibilidade,
): Record<string, unknown> {
  const p: Record<string, unknown> = {
    '@type': 'PropertyValue',
    name: nome,
    value: valor,
  };
  // A procedência viaja junto com o dado, no schema como na tela.
  if (entrada.url_fonte) p.url = entrada.url_fonte;
  return p;
}
