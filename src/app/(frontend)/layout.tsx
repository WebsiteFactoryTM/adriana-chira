import type { Metadata, Viewport } from 'next'
import type { ReactNode } from 'react'
import { ConsentBanner } from '@/components/consent/ConsentBanner'
import { Footer } from '@/components/layout/Footer'
import { Header } from '@/components/layout/Header'
import { JsonLd } from '@/components/seo/JsonLd'
import { PageLight } from '@/components/ui/PageLight'
import { RevealFallback } from '@/components/ui/RevealFallback'
import { buildConsentBootstrap } from '@/lib/consent'
import { getSiteSettings } from '@/lib/content'
import { graph, personSchema } from '@/lib/schema'
import { display, sans } from '../fonts'
import '../globals.css'

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://adrianachira.ro'

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'Adriana Chira · Consultant în Performanță Umană',
    template: '%s · Adriana Chira',
  },
  description:
    'Consultant în performanță umană. Lucrez cu antreprenori, profesioniști independenți și afaceri de familie pentru claritate în deciziile dificile.',
  applicationName: 'Adriana Chira',
  authors: [{ name: 'Adriana Chira', url: siteUrl }],
  creator: 'Adriana Chira',
  publisher: 'Adriana Chira',
  formatDetection: { email: false, address: false, telephone: false },
  alternates: { canonical: '/' },
  openGraph: {
    type: 'website',
    locale: 'ro_RO',
    siteName: 'Adriana Chira',
    url: siteUrl,
  },
  twitter: { card: 'summary_large_image' },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-image-preview': 'large', 'max-snippet': -1 },
  },
}

export const viewport: Viewport = {
  themeColor: '#FAF5EC',
  colorScheme: 'light',
}

export default async function RootLayout({ children }: { children: ReactNode }) {
  const settings = await getSiteSettings()

  return (
    <html lang="ro" className={`${display.variable} ${sans.variable}`}>
      <head>
        {/*
          PRIMUL script din pagină, obligatoriu inline și obligatoriu înaintea
          oricărui alt tag. `next/script` nu garantează ordinea; aici da.
          Vezi src/lib/consent.ts pentru raționamentul complet.
        */}
        <script
          dangerouslySetInnerHTML={{
            __html: buildConsentBootstrap(settings.ga4MeasurementId),
          }}
        />
        {/*
          În `<head>`, ca marcajul `data-ac-reveal="js"` să existe înainte ca
          body-ul să se picteze — altfel apare un flash de conținut vizibil,
          apoi ascuns. Observer-ul propriu-zis pornește la DOMContentLoaded.
        */}
        <RevealFallback />
      </head>
      <body className="overflow-x-clip bg-ac-paper text-ac-ink antialiased">
        <a
          href="#continut"
          className="absolute top-0 left-[-9999px] z-[60] bg-ac-ink px-6 py-4 text-ac-paper focus:left-4"
        >
          Sari la conținut
        </a>

        {/* Indicator de progres al derulării — pur CSS, scroll-driven. */}
        <div
          data-scroll-progress
          aria-hidden="true"
          className="fixed inset-x-0 top-0 z-[55] h-px bg-ac-accent"
        />

        {/* Textură de hârtie: un singur nod, fixat peste tot documentul. */}
        <div
          aria-hidden="true"
          className="ac-grain pointer-events-none fixed inset-0 z-[46] opacity-[.045] mix-blend-multiply"
        />

        {/* Lumina care traversează pagina la derulare. Stă sub fundalurile
            secțiunilor, deci nu trece niciodată peste text. */}
        <PageLight />

        <Header settings={settings} />
        {children}
        <Footer settings={settings} />

        <ConsentBanner policyHref="/politica-de-cookies" />

        <JsonLd data={graph([personSchema(settings, '/images/adriana-portret.jpg')])} />
      </body>
    </html>
  )
}
