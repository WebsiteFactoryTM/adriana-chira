/**
 * Voalul — obiectul care rămâne cu cititorul. Server Component, zero JavaScript.
 *
 * CE ESTE ȘI CE NU ESTE. Nu e o mascotă și nu e un buton. E un corp de abur,
 * translucid, care stă fixat de ecran și însoțește cititorul prin toată pagina.
 * Rolul lui e de prezență, nu de instrucțiune: nu cere nimic, nu duce nicăieri,
 * nu are text. Un site de consultanță nu are voie să te trage de mânecă; are
 * voie să aibă pe cineva în cameră cu tine.
 *
 * DIFERENȚA FAȚĂ DE `PageLight`. Sunt două lucruri diferite, care coexistă:
 *  - `PageLight` e lumină ambientală. Stă SUB fundalurile secțiunilor, e mare,
 *    difuză, fără contur. Nu e un obiect, e atmosfera paginii.
 *  - Voalul ăsta e un OBIECT. Stă DEASUPRA conținutului, e mic, are contur,
 *    volum și margine. Se vede că e ceva, nu doar că e mai cald acolo.
 *
 * CE ÎL FACE SĂ PARĂ FIZIC. Trei lucruri, în ordinea importanței:
 *  1. `backdrop-filter` — refractă efectiv ce e în spatele lui. Asta e singura
 *     diferență reală dintre „un cerc colorat" și „un obiect": un desen stă
 *     peste pagină, un corp o deformează. Tehnica e deja folosită în proiect,
 *     pe header și pe bara de consimțământ.
 *  2. Lumina vine dintr-o direcție. Reflex cald sus-stânga, umbră caldă
 *     jos-dreapta, inel de margine — de aici citește ochiul volumul.
 *  3. Nu se mișcă mecanic. Plutește (bob), respiră (scale) și își rotește
 *     reflexul, toate pe durate diferite și fără numitor comun, ca să nu se
 *     sincronizeze niciodată într-un puls vizibil.
 *
 * UNDE STĂ ȘI DE CE ACOLO. Jos-stânga. Nu jos-dreapta, care e locul unde toată
 * lumea a învățat că stă widgetul de chat — exact conotația de evitat. Nu
 * sus-dreapta, unde e deja butonul din header. Jos-stânga e cel mai liniștit
 * colț al paginii și, fiind în afara coloanei de text pe ecrane late, obiectul
 * plutește peste marginea goală, nu peste litere.
 *
 * NOTĂ DESIGN: al treilea strat care nu vine din `design/homepage-approved.html`.
 * `position: fixed`, deci în afara fluxului — nu mută niciun nod de text.
 * Se stinge dintr-un singur loc: `--ac-veil-gain: 0`.
 */
export function Veil() {
  return (
    <div data-veil aria-hidden="true">
      <div data-veil-body>
        <span data-veil-skin />
        <span data-veil-sheen />
      </div>
    </div>
  )
}
