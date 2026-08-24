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
import { getHiddenSections, getHomeContent, getSiteSettings } from '@/lib/content'
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
 *
 * Ordinea secțiunilor este cea din designul aprobat și nu vine din CMS. Ce vine
 * din CMS este doar dacă o secțiune a fost ascunsă — implicit, toate sunt
 * vizibile, deci pagina arată identic cu designul până când cineva debifează
 * ceva intenționat.
 */
export default async function HomePage() {
  const [content, settings, hidden] = await Promise.all([
    getHomeContent(),
    getSiteSettings(),
    getHiddenSections(),
  ])

  const shows = (id: string) => !hidden.has(id)

  return (
    <>
      <main id="continut">
        <Hero content={content.hero} />
        {shows('problema') && <Problema content={content.problema} />}
        {shows('metoda') && <Metoda content={content.metoda} />}
        {shows('pentru-cine') && <PentruCine content={content.pentruCine} />}
        {shows('univers') && <Univers content={content.univers} />}
        {shows('despre') && <Despre content={content.despre} />}
        {shows('valori') && <Valori content={content.valori} />}
        {shows('citat') && <Citat content={content.citat} />}
        {shows('servicii') && <Servicii content={content.servicii} />}
        {shows('blog') && <BlogPreview content={content.blog} />}
        {shows('faq') && <Faq content={content.faq} />}
        {shows('cta') && <CtaFinal content={content.cta} />}
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
