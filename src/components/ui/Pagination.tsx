import Link from 'next/link'

/**
 * Paginarea listelor de articole.
 *
 * Rute reale, nu `?pagina=`: `/blog`, `/blog/pagina/2`, … Motivul e practic —
 * un parametru de căutare ar face întreaga pagină dinamică, iar `/blog` trebuie
 * să rămână prerandată. În plus, adresele sunt indexabile ca atare.
 *
 * `rel="prev"` / `rel="next"` rămân utile pentru crawlerele care le citesc și
 * nu costă nimic. Pagina curentă nu e link: `aria-current` o anunță.
 */
type Props = {
  page: number
  totalPages: number
  /** Construiește adresa unei pagini. Diferă între blog și categorie. */
  hrefFor: (page: number) => string
}

export function Pagination({ page, totalPages, hrefFor }: Props) {
  if (totalPages <= 1) return null

  const pages = Array.from({ length: totalPages }, (_, index) => index + 1)

  return (
    <nav
      aria-label="Paginare articole"
      className="mt-[clamp(48px,6vw,80px)] flex flex-wrap items-center justify-between gap-6 border-t border-ac-line pt-8"
    >
      {page > 1 ? (
        <Link
          href={hrefFor(page - 1)}
          rel="prev"
          className="ac-underline flex min-h-11 items-center font-medium text-btn uppercase leading-[normal]"
        >
          ← Pagina anterioară
        </Link>
      ) : (
        <span />
      )}

      <ol className="flex flex-wrap items-center gap-2">
        {pages.map((number) => (
          <li key={number}>
            {number === page ? (
              <span
                aria-current="page"
                className="flex size-11 items-center justify-center rounded-pill border border-ac-ink font-medium text-btn"
              >
                {number}
              </span>
            ) : (
              <Link
                href={hrefFor(number)}
                className="flex size-11 items-center justify-center rounded-pill border border-ac-line font-medium text-btn transition-colors duration-[320ms] ease-ac hover:border-ac-ink"
              >
                <span className="ac-sr-only">Pagina </span>
                {number}
              </Link>
            )}
          </li>
        ))}
      </ol>

      {page < totalPages ? (
        <Link
          href={hrefFor(page + 1)}
          rel="next"
          className="ac-underline flex min-h-11 items-center font-medium text-btn uppercase leading-[normal]"
        >
          Pagina următoare →
        </Link>
      ) : (
        <span />
      )}
    </nav>
  )
}
