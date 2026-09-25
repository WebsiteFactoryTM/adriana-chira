/**
 * Butonul „Înapoi sus", pe paginile lungi.
 *
 * **Server Component, zero JavaScript** — nu e a cincea componentă de client.
 *
 * - Ținta e `#top`: fragmentul `top` duce, prin specificația HTML, la începutul
 *   documentului chiar dacă niciun element nu are `id="top"`. Derularea lină
 *   vine din `scroll-behavior: smooth` de pe `html` (oprită, corect, la
 *   `prefers-reduced-motion`).
 * - Apare abia după primul ecran derulat, dintr-o animație legată de derulare
 *   (`animation-timeline: scroll(root)`), în blocul „ÎNAPOI SUS" din
 *   `globals.css`. Unde browserul nu are timeline de derulare, sau cititorul a
 *   cerut mai puțină mișcare, butonul e pur și simplu vizibil tot timpul:
 *   starea de bază e cea vizibilă, iar ascunderea e doar o îmbunătățire.
 *   Invers ar fi fost capcana din STATUS §10 — un element care pornește de la
 *   `opacity: 0` și rămâne invizibil când animația e oprită.
 *
 * Se montează o dată pe pagină, oriunde în `<main>`: e `position: fixed`.
 */
export function BackToTop({ label = 'Înapoi sus' }: { label?: string }) {
  return (
    <a
      href="#top"
      data-back-to-top
      className="fixed right-[clamp(16px,3vw,40px)] bottom-[clamp(16px,3vw,40px)] z-40 flex size-12 items-center justify-center rounded-pill border border-ac-ink bg-ac-paper text-ac-ink transition-colors duration-[320ms] ease-ac hover:bg-ac-ink hover:text-ac-paper"
    >
      <span className="ac-sr-only">{label}</span>
      {/* Săgeata, desenată în limbajul pictogramelor: linie de 1px, fără umplere. */}
      <svg
        aria-hidden="true"
        viewBox="0 0 24 24"
        className="size-[18px]"
        fill="none"
        stroke="currentColor"
        strokeWidth="1"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M12 19V5M6 11l6-6 6 6" vectorEffect="non-scaling-stroke" />
      </svg>
    </a>
  )
}
