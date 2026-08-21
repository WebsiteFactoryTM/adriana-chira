import type { Metadata } from 'next'
import { JsonLd } from '@/components/seo/JsonLd'
import { BlogPreview } from '@/components/sections/BlogPreview'
import { Citat } from '@/components/sections/Citat'
import { CtaFinal } from '@/components/sections/CtaFinal'
import { Despre } from '@/components/sections/Despre'
import { Faq } from '@/components/sections/Faq'
import { Hero } from '@/components/sections/Hero'
import { Metoda } from '@/components/sections/Metoda'
import { PentruCine } from '@/components/sections/PentruCine'
import { Problema } from '@/components/sections/Problema'
import { Servicii } from '@/components/sections/Servicii'
import { Univers } from '@/components/sections/Univers'
import { Valori } from '@/components/sections/Valori'
import { getHomeContent, getSiteSettings } from '@/lib/content'
import { faqSchema, graph, professionalServiceSchema, websiteSchema } from '@/lib/schema'

export const metadata: Metadata = {
  title: 'Adriana Chira · Consultant în Performanță Umană',
  description:
    'Unele decizii nu sunt grele pentru că nu știi ce ai de făcut. Consultanță în performanță umană pentru antreprenori, profesioniști independenți și afaceri de familie.',
  alternates: { canonical: '/' },
  openGraph: {
    title: 'Adriana Chira · Consultant în Performanță Umană',
    description:
      'Claritate înainte de decizie. Consultanță în performanță umană — Timișoara și online.',
    url: '/',
    type: 'website',
  },
}

/**
 * Homepage — cele 12 secțiuni de conținut din designul aprobat, în ordine.
 *
 * Pagina este 100% Server Component. Singurele componente de client din tot
 * arborele sunt `MobileNav` și `ConsentBanner` (ambele justificate în fișier).
 * Statică: se re-generează la publicare, prin webhook Payload (faza 2).
 */
export default async function HomePage() {
  const [content, settings] = await Promise.all([getHomeContent(), getSiteSettings()])

  return (
    <>
      <main id="continut">
        <Hero content={content.hero} />
        <Problema content={content.problema} />
        <Metoda content={content.metoda} />
        <PentruCine content={content.pentruCine} />
        <Univers content={content.univers} />
        <Despre content={content.despre} />
        <Valori content={content.valori} />
        <Citat content={content.citat} />
        <Servicii content={content.servicii} />
        <BlogPreview content={content.blog} />
        <Faq content={content.faq} />
        <CtaFinal content={content.cta} />
      </main>

      <JsonLd
        data={graph([
          websiteSchema(settings),
          professionalServiceSchema(settings),
          faqSchema(content.faq.items, settings.url),
        ])}
      />
    </>
  )
}
