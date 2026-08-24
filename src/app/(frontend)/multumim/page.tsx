import type { Metadata } from 'next'

import { PageHeader } from '@/components/layout/PageHeader'
import { Arrow, Button } from '@/components/ui/Button'
import { Section, Shell } from '@/components/ui/Section'
import { TextLink } from '@/components/ui/TextLink'
import { thanksPage } from '@/content/pages'
import { getSiteSettings } from '@/lib/content'
import { pageMetadata } from '@/lib/seo'
import { getStripe } from '@/lib/stripe'

type Props = { searchParams: Promise<{ session_id?: string }> }

export const metadata: Metadata = pageMetadata({
  title: 'Îți mulțumesc',
  description: 'Confirmarea comenzii și pașii următori.',
  path: '/multumim',
  // Pagină de confirmare: nu are ce căuta în index (prompt §5.3).
  noIndex: true,
})

/**
 * Confirmarea după plată.
 *
 * `session_id` se verifică LA STRIPE, pe server. Motivul e simplu: parametrul
 * din URL poate fi scris de oricine. Fără verificare, pagina ar confirma o
 * plată care nu s-a întâmplat.
 *
 * Dacă verificarea nu se poate face — lipsește cheia (blocaj §7.8), lipsește
 * parametrul, sesiunea nu e plătită — pagina NU pretinde că plata a reușit.
 * Afișează varianta neutră: mesajul a fost primit, urmează un răspuns.
 */
export default async function MultumimPage({ searchParams }: Props) {
  const [{ session_id: sessionId }, settings] = await Promise.all([
    searchParams,
    getSiteSettings(),
  ])

  const paid = await isSessionPaid(sessionId)

  return (
    <main id="continut">
      <PageHeader
        eyebrow={thanksPage.eyebrow}
        title={paid ? thanksPage.title : 'Îți mulțumesc.'}
        lead={
          paid
            ? thanksPage.lead
            : 'Dacă tocmai ai finalizat o comandă, primești confirmarea pe email în câteva minute. Dacă ai ajuns aici din greșeală, nu s-a întâmplat nimic.'
        }
      />

      <Section padding="bottom-only" aria-labelledby="pasi-titlu">
        <Shell>
          <h2 id="pasi-titlu" className="font-display text-h2-col font-light">
            Ce urmează
          </h2>

          <ol className="mt-block grid grid-cols-[repeat(auto-fit,minmax(min(100%,280px),1fr))] gap-[clamp(32px,4vw,64px)]">
            {thanksPage.steps.map((step) => (
              <li key={step.index}>
                <span
                  aria-hidden="true"
                  className="block font-display text-numeral font-light text-ac-accent"
                >
                  {step.index}
                </span>
                <h3 className="mt-5 font-display text-h3 font-normal">{step.title}</h3>
                <p className="mt-4 max-w-[42ch] text-body text-ac-ink-70">{step.body}</p>
              </li>
            ))}
          </ol>

          <div className="mt-[clamp(48px,6vw,80px)] flex flex-wrap items-center gap-6 border-t border-ac-line pt-8">
            <Button href="/" variant="soft" size="lg">
              Înapoi la pagina principală
              <Arrow />
            </Button>

            <p className="text-body-sm text-ac-ink-70">
              Ai o întrebare până atunci?{' '}
              {settings.email ? (
                <TextLink href={`mailto:${settings.email}`} className="text-body-sm">
                  Scrie-mi direct
                </TextLink>
              ) : (
                <TextLink href="/contact" className="text-body-sm">
                  Scrie-mi direct
                </TextLink>
              )}
              .
            </p>
          </div>
        </Shell>
      </Section>
    </main>
  )
}

/** `true` doar dacă Stripe confirmă că sesiunea chiar a fost plătită. */
async function isSessionPaid(sessionId: string | undefined): Promise<boolean> {
  if (!sessionId) return false

  const stripe = getStripe()
  if (!stripe) return false

  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId)
    return session.payment_status === 'paid'
  } catch {
    // Sesiune inexistentă sau cheie de alt cont: tratăm ca neconfirmată.
    return false
  }
}
