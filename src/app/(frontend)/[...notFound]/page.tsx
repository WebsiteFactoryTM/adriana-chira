import { notFound } from 'next/navigation'

/**
 * Captează orice rută necunoscută în grupul `(frontend)` și o trimite către
 * `not-found.tsx`. Fără această rută, un URL inexistent ar cădea pe pagina 404
 * implicită a Next-ului — în engleză și fără layout-ul site-ului — pentru că
 * layout-ul rădăcină trăiește în grupul `(frontend)`, nu în `app/`.
 *
 * Structura de grupuri se păstrează pentru că Payload își montează admin-ul
 * în `app/(payload)/`, cu layout propriu (faza 2).
 */
export default function CatchAllNotFound(): never {
  notFound()
}
