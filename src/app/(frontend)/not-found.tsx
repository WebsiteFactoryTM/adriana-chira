import type { Metadata } from 'next'
import { Button } from '@/components/ui/Button'
import { TextLink } from '@/components/ui/TextLink'
import { getSiteSettings } from '@/lib/content'

export const metadata: Metadata = {
  title: 'Pagina nu a fost găsită',
  robots: { index: false, follow: true },
}

export default async function NotFound() {
  const settings = await getSiteSettings()

  return (
    <main id="continut" className="ac-shell py-section">
      <p className="flex items-center gap-[14px] font-medium text-eyebrow uppercase text-ac-accent-ink">
        <span aria-hidden="true" className="block h-px w-10 bg-ac-accent" />
        Eroare 404
      </p>

      <h1 className="mt-8 max-w-[20ch] font-display text-h2 font-light">
        Pagina aceasta nu există.
      </h1>

      <p className="mt-8 max-w-[52ch] text-body-lg text-ac-ink-70">
        Probabil adresa s-a schimbat sau linkul este incomplet. De aici poți merge mai departe.
      </p>

      <div className="mt-12 flex flex-wrap gap-[14px]">
        <Button href="/" variant="primary" size="lg">
          Înapoi la pagina principală
        </Button>
      </div>

      <ul className="mt-12 flex flex-wrap gap-x-8 gap-y-3 border-t border-ac-line pt-8 text-body">
        {settings.footerNav.map((item) => (
          <li key={item.href}>
            <TextLink href={item.href}>{item.label}</TextLink>
          </li>
        ))}
      </ul>
    </main>
  )
}
