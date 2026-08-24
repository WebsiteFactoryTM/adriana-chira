/**
 * Lumina paginii — un singur corp de lumină caldă care traversează pagina
 * odată cu derularea. Server Component, zero JavaScript.
 *
 * RELAȚIA CU `SectionAura`. Sunt același sistem, la două scări. Aura e legată
 * de o secțiune: se aprinde când secțiunea ajunge în centrul ecranului și se
 * stinge după ea. Lumina asta nu aparține niciunei secțiuni — e fixată de
 * ecran și se mută prin el pe măsură ce cititorul coboară, ca o singură sursă
 * care însoțește lectura de la primul rând până la subsol. Aura spune „aici
 * încetinește"; lumina spune „mai e drum".
 *
 * DE CE STĂ ÎN SPATELE CONȚINUTULUI. `z-index: -1` la nivelul lui <body>, deci
 * sub fundalurile secțiunilor, dar peste fundalul paginii. Secțiunile `paper`
 * n-au fundal propriu (vezi `TONES` din `Section.tsx`), deci lumina se vede
 * prin ele; blocurile `cream`, `cream-100` și cel `ink` sunt opace și o
 * ascund. Nu e o scăpare, e efectul dorit: blocurile colorate sunt materie,
 * lumina trece pe după ele și reapare. Alternativa — un strat peste conținut,
 * cu `mix-blend-mode`, ca textura de hârtie — ar fi însemnat lumină peste
 * fiecare literă din pagină, adică exact riscul de contrast pe care sistemul
 * ăsta îl evită prin construcție.
 *
 * NOTĂ DESIGN: ca și aura, stratul acesta nu există în
 * `design/homepage-approved.html`. E `position: fixed`, în afara fluxului: nu
 * mută niciun nod de text și nu schimbă înălțimea niciunei secțiuni.
 * Se stinge dintr-un singur loc: `--ac-light-gain: 0` în `globals.css`.
 *
 * MIȘCAREA, în întregime din CSS (vezi blocul „LUMINA PAGINII"):
 *  - traseul e legat de derulare, prin `animation-timeline: scroll(root)`, deci
 *    lumina nu se mișcă singură: o mută cititorul, iar dacă se oprește, se
 *    oprește și ea în punctul acela;
 *  - peste traseu rulează o respirație lentă, în timp, ca lumina să rămână vie
 *    și când pagina stă pe loc;
 *  - cele două nu se ceartă pe aceeași proprietate: traseul folosește
 *    `translate`, respirația `scale`. Sunt proprietăți independente, deci se
 *    compun fără un strat de ambalaj în plus.
 */
export function PageLight() {
  return <div data-page-light aria-hidden="true" />
}
