/**
 * Contador de ids para componentes que precisam ligar `aria-describedby` a um
 * elemento próprio. Vive num módulo porque o frontmatter de um `.astro` roda
 * uma vez por instância — um contador lá dentro reiniciaria sempre.
 *
 * Determinístico dentro de um build, que é o que importa para o diff do HTML.
 */
let n = 0;

export function idUnico(prefixo: string): string {
  n += 1;
  return `${prefixo}-${n}`;
}
