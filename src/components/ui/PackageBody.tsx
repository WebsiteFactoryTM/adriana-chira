import type { PackageSection } from '@/content/types'
import { slugifyAnchor } from '@/lib/lexical'

/**
 * Ancora unei secțiuni din descrierea lungă.
 *
 * Aceeași funcție calculează și ancorele din cuprinsul articolelor de blog,
 * deci cuprinsul paginii de program și titlurile pe care le țintește nu pot
 * devia — exact regula din STATUS §4, mutată de pe articole pe programe.
 */
export function packageSectionAnchor(heading: string): string {
  return slugifyAnchor(heading)
}

/**
 * Descrierea lungă a unui pachet, în varianta din textul aprobat.
 *
 * Pagina pachetului preferă `longDescription`, adică rich text-ul scris în
 * admin. Componenta asta intră când acela lipsește — ceea ce astăzi e cazul
 * normal, pentru că textul celor trei programe a venit de la clientă ca
 * document, nu tastat în CMS.
 *
 * De ce nu am transformat documentele în Lexical și gata: un document Lexical
 * scris de mână în TypeScript e o pădure de `{ type: 'paragraph', version: 1,
 * children: [...] }` în care o corectură de o virgulă cere zece minute și o
 * verificare de sintaxă. Textul aprobat trebuie să rămână citibil de un om,
 * pentru că e chiar lucrul pe care clienta îl va corecta cel mai des.
 *
 * Tipografia este cea din blocul „TIPOGRAFIE DE ARTICOL" al designului:
 * aceleași mărimi și același ritm ca la corpul unui articol de blog. Nu se
 * inventează o a doua tipografie de text lung.
 */
export function PackageBody({ sections }: { sections: PackageSection[] }) {
  return (
    <div className="grid gap-[clamp(40px,5vw,64px)]">
      {sections.map((section) => (
        <section
          key={section.heading}
          id={packageSectionAnchor(section.heading)}
          /* 132px = înălțimea barei sticky. Fără el, cuprinsul ar ateriza cu
             titlul ascuns sub antet. */
          className="scroll-mt-[132px]"
        >
          <h2 className="font-display text-h3-lg font-normal">{section.heading}</h2>

          {section.paragraphs?.map((paragraph, index) => (
            <p key={index} className="mt-6 max-w-[62ch] text-body-lg text-ac-ink-70">
              {paragraph}
            </p>
          ))}

          {section.list && (
            <ul className="mt-7 grid gap-3">
              {section.list.map((item, index) => (
                <li
                  key={index}
                  className="max-w-[62ch] border-l border-ac-line pl-5 text-body text-ac-ink-70"
                >
                  {item}
                </li>
              ))}
            </ul>
          )}

          {section.steps && (
            <ol className="mt-9 grid gap-[clamp(28px,3vw,40px)]">
              {section.steps.map((step) => (
                <li key={step.index} className="grid grid-cols-[auto_1fr] gap-x-6 gap-y-2">
                  <span
                    aria-hidden="true"
                    className="font-display text-numeral-roman font-light text-ac-accent"
                  >
                    {step.index}
                  </span>
                  <div>
                    <h3 className="font-display text-h3 font-normal">{step.title}</h3>
                    <p className="mt-3 max-w-[58ch] text-body text-ac-ink-70">{step.body}</p>
                  </div>
                </li>
              ))}
            </ol>
          )}
        </section>
      ))}
    </div>
  )
}
