import type { ComparisonTable, FaqItem } from '@/content/types'

/**
 * Lista de întrebări frecvente, pe `<details>`/`<summary>` nativ.
 *
 * Motorul AEO al site-ului: zero JavaScript, iar răspunsurile rămân în DOM și
 * când acordeonul e închis. Crawlerele de AI, spre deosebire de Googlebot, în
 * general nu execută JS — un acordeon pe React ar face conținutul invizibil
 * exact pentru motoarele pe care le țintim (brief §9.2).
 *
 * Trăia în `sections/Faq.tsx` până la faza 3b; l-am scos aici pentru că pagina
 * de servicii și paginile de pachet folosesc aceeași listă. Markup-ul e
 * neatins față de varianta verificată la pixel (STATUS §6).
 */
export function FaqList({ items }: { items: FaqItem[] }) {
  return (
    <div>
      {items.map((item, index) => (
        <FaqEntry key={item.question} item={item} last={index === items.length - 1} />
      ))}
    </div>
  )
}

function FaqEntry({ item, last }: { item: FaqItem; last: boolean }) {
  return (
    <details
      open={item.defaultOpen}
      className={`border-t border-ac-line ${last ? 'border-b' : ''}`}
    >
      <summary className="flex min-h-11 items-baseline justify-between gap-6 py-7">
        <h3 className="font-display text-summary font-normal">{item.question}</h3>
        <span data-plus aria-hidden="true" className="text-xl leading-none text-ac-accent">
          +
        </span>
      </summary>

      <div className="pb-8">
        <p className="max-w-[64ch] text-body text-ac-ink-70">{item.answer}</p>
        {item.table && <ComparisonGrid table={item.table} />}
      </div>
    </details>
  )
}

/**
 * Tabelul psihoterapie / coaching / performanță umană.
 *
 * `<table>` semantic, nu grilă de div-uri și nu imagine: este cel mai probabil
 * fragment de preluat integral de un motor de răspuns (brief §9.1.5).
 */
function ComparisonGrid({ table }: { table: ComparisonTable }) {
  return (
    <div className="mt-8 overflow-x-auto">
      <table className="w-full min-w-[600px] border-collapse text-left">
        <caption className="ac-sr-only">{table.caption}</caption>
        <thead>
          <tr>
            <th scope="col" className="border-b border-ac-line py-[14px] pr-[14px]" />
            {table.columns.map((column) => (
              <th
                key={column}
                scope="col"
                className="border-b border-ac-line p-[14px] font-medium text-[11px] tracking-[0.18em] uppercase text-ac-accent-ink"
              >
                {column}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {table.rows.map((row, rowIndex) => {
            const lastRow = rowIndex === table.rows.length - 1
            const border = lastRow ? '' : 'border-b border-ac-line'
            return (
              <tr key={row.label}>
                <th
                  scope="row"
                  className={`py-[14px] pr-[14px] font-medium text-body-sm leading-[normal] ${border}`}
                >
                  {row.label}
                </th>
                {row.cells.map((cell, cellIndex) => (
                  <td
                    key={cellIndex}
                    className={`p-[14px] text-body-sm leading-[1.65] text-ac-ink-70 ${border}`}
                  >
                    {cell}
                  </td>
                ))}
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
