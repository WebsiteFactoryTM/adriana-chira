/**
 * Concatenare de clase. Zero dependințe — nu justificăm 3 KB de `clsx` pentru
 * o funcție de patru rânduri într-un proiect cu buget de 110 KB first-load JS.
 */
export function cn(...parts: (string | false | null | undefined)[]): string {
  return parts.filter(Boolean).join(' ')
}
