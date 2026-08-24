import Link from 'next/link'
import type { ReactNode } from 'react'
import { TextLink } from '@/components/ui/TextLink'
import type { SiteSettings } from '@/content/types'

/**
 * Footer. Singurul alt bloc întunecat din pagină, prin convenție.
 *
 * Obligatoriu pentru vânzare online în România (brief §11.4): badge ANPC,
 * link SOL și datele complete ale vânzătorului. Lipsa lor este contravenție.
 */
export function Footer({ settings }: { settings: SiteSettings }) {
  const year = new Date().getFullYear()
  const legalLine = [
    settings.company.legalName,
    settings.company.cui ? `CUI ${settings.company.cui}` : null,
    settings.company.regCom,
  ].filter(Boolean)

  return (
    <footer className="bg-ac-ink pt-[clamp(5rem,10vw,8rem)] pb-8 text-ac-cream-100">
      <div className="ac-shell">
        <div className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,220px),1fr))] gap-[clamp(40px,5vw,72px)]">
          <div>
            <p className="font-display text-h3-card font-normal text-ac-paper">{settings.siteName}</p>
            <p className="mt-[14px] font-medium text-[11px] tracking-[0.24em] uppercase text-ac-accent">
              {settings.role}
            </p>
            <p className="mt-7 max-w-[26ch] font-display text-[1.375rem] leading-[1.35] font-light">
              {settings.tagline}
            </p>
          </div>

          <nav aria-label="Navigare footer">
            <FooterHeading>Navigare</FooterHeading>
            <ul className="mt-6 grid gap-3 leading-[normal]">
              {settings.footerNav.map((item) => (
                <li key={item.href}>
                  <TextLink href={item.href} className="text-body-sm text-ac-cream-100">
                    {item.label}
                  </TextLink>
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <FooterHeading>Contact</FooterHeading>
            <ul className="mt-6 grid gap-3 text-body-sm leading-[normal]">
              <li>
                {settings.email ? (
                  <TextLink href={`mailto:${settings.email}`} className="text-ac-cream-100">
                    {settings.email}
                  </TextLink>
                ) : (
                  <Placeholder>[ email ]</Placeholder>
                )}
              </li>
              <li>
                {settings.phone ? (
                  <TextLink href={`tel:${settings.phone.replace(/\s/g, '')}`} className="text-ac-cream-100">
                    {settings.phone}
                  </TextLink>
                ) : (
                  <Placeholder>[ telefon ]</Placeholder>
                )}
              </li>
              <li>
                {settings.city}, {settings.country}
              </li>
            </ul>

            <ul className="mt-6 flex flex-wrap gap-4 leading-[normal]">
              {settings.social.map((item) =>
                item.pending ? (
                  <li key={item.label}>
                    <span className="text-body-sm leading-[normal]">
                      <Placeholder>[ {item.label} ]</Placeholder>
                    </span>
                  </li>
                ) : (
                  <li key={item.label}>
                    <a
                      href={item.href}
                      rel="me noopener"
                      target="_blank"
                      className="ac-underline text-body-sm leading-[normal] text-ac-cream-100"
                    >
                      {item.label}
                    </a>
                  </li>
                ),
              )}
            </ul>
          </div>

          <div>
            <FooterHeading>Legal</FooterHeading>
            <ul className="mt-6 grid gap-3 leading-[normal]">
              {settings.legalNav.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="ac-underline text-body-sm leading-[normal] text-ac-cream-100">
                    {item.label}
                  </Link>
                </li>
              ))}
              <li>
                {/*
                  Retragerea consimțământului trebuie să fie la fel de ușoară ca
                  acordarea lui (brief §11.1). Butonul e HTML pur; bara de
                  consimțământ ascultă delegat pe `[data-consent-open]`, deci
                  footerul rămâne Server Component.
                */}
                <button
                  type="button"
                  data-consent-open
                  className="min-h-11 cursor-pointer border-0 bg-transparent p-0 text-left font-sans text-body-sm leading-[normal] text-ac-cream-100 underline decoration-ac-accent underline-offset-4"
                >
                  Setări cookie-uri
                </button>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-[clamp(56px,7vw,88px)] grid grid-cols-[repeat(auto-fit,minmax(min(100%,240px),1fr))] items-center gap-6 border-t border-[rgba(250,245,236,.12)] pt-8">
          <div className="text-xs leading-[1.8] text-[rgba(250,245,236,.55)]">
            <p>© {year} Adriana Chira. Toate drepturile rezervate.</p>
            {legalLine.length > 0 ? (
              <p>{legalLine.join(' · ')}</p>
            ) : (
              <Placeholder>[ Denumire firmă · CUI · Reg. Com. ]</Placeholder>
            )}
          </div>

          <div className="flex flex-wrap justify-center gap-3">
            <ComplianceBadge href="https://anpc.ro/ce-este-sal/">ANPC · SAL</ComplianceBadge>
            <ComplianceBadge href="https://ec.europa.eu/consumers/odr">
              SOL · Litigii online
            </ComplianceBadge>
          </div>

          <p className="text-center text-xs text-[rgba(250,245,236,.55)]">Website Factory</p>
        </div>
      </div>
    </footer>
  )
}

function FooterHeading({ children }: { children: ReactNode }) {
  return (
    <p className="font-medium text-label uppercase text-ac-accent">{children}</p>
  )
}

function Placeholder({ children }: { children: ReactNode }) {
  return (
    <span data-placeholder>
      {children}
    </span>
  )
}

function ComplianceBadge({ href, children }: { href: string; children: ReactNode }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="flex min-h-11 items-center rounded-pill border border-[rgba(250,245,236,.22)] px-[18px] py-3 text-center font-medium text-[11px] tracking-[0.12em] uppercase text-[rgba(250,245,236,.75)] transition-colors duration-[320ms] hover:border-ac-accent hover:text-ac-paper"
    >
      {children}
    </a>
  )
}
