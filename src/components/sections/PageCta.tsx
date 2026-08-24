import { Arrow, Button } from '@/components/ui/Button'
import { Eyebrow } from '@/components/ui/Eyebrow'
import { Reveal } from '@/components/ui/Reveal'
import { Section } from '@/components/ui/Section'
import type { Eyebrow as EyebrowContent, NavItem } from '@/content/types'

/**
 * Blocul de final al paginilor interioare.
 *
 * Este `CtaFinal` de pe homepage, cu două diferențe: conținutul vine din
 * parametri și poate avea un al doilea buton (promptul §5.3 cere „CTA dublu"
 * pe pagina Despre). Restul — fundal `cream-100`, eticheta în varianta închisă,
 * `h2` centrat în Cormorant light — este identic, ca paginile să nu pară
 * desenate de altcineva.
 */
type Props = {
  eyebrow: EyebrowContent
  heading: string
  body: string
  primary: NavItem
  secondary?: NavItem
  note?: string
  id?: string
}

export function PageCta({ eyebrow, heading, body, primary, secondary, note, id }: Props) {
  const headingId = `${id ?? 'cta'}-titlu`

  return (
    <Section id={id ?? 'cta'} tone="cream-100" padding="cta" aria-labelledby={headingId}>
      <div className="mx-auto max-w-cta px-gutter text-center">
        <Eyebrow content={eyebrow} tone="onCream" center />

        <Reveal
          as="h2"
          id={headingId}
          end="32%"
          className="mx-auto mt-[clamp(32px,4vw,56px)] max-w-[22ch] font-display text-h2 font-light"
        >
          {heading}
        </Reveal>

        <p className="mx-auto mt-8 max-w-[52ch] text-body-lg text-ac-ink-70">{body}</p>

        <div className="mt-[clamp(40px,5vw,64px)] flex flex-wrap justify-center gap-4">
          <Button href={primary.href} variant="primary" size="xl">
            {primary.label}
            <Arrow />
          </Button>

          {secondary && (
            <Button href={secondary.href} variant="soft" size="xl">
              {secondary.label}
            </Button>
          )}
        </div>

        {note && (
          <p className="mt-6 font-medium text-[11px] tracking-[0.2em] uppercase text-ac-ink-70">
            {note}
          </p>
        )}
      </div>
    </Section>
  )
}
