import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

import { PageCta } from '@/components/sections/PageCta'
import { JsonLd } from '@/components/seo/JsonLd'
import { Breadcrumb, type Crumb } from '@/components/ui/Breadcrumb'
import { Eyebrow } from '@/components/ui/Eyebrow'
import { FaqList } from '@/components/ui/FaqList'
import { ImageSlot } from '@/components/ui/ImageSlot'
import { PostCard } from '@/components/ui/PostCard'
import { RichText } from '@/components/ui/RichText'
import { Section, Shell } from '@/components/ui/Section'
import { ShareRow } from '@/components/ui/ShareRow'
import { TextLink } from '@/components/ui/TextLink'
import { homeContent } from '@/content/home'
import { absoluteUrl, formatDateRo, getPostBySlug, getPostSlugs, getSiteSettings } from '@/lib/content'
import { asLexical, collectLinkTargets, headingAnchors } from '@/lib/lexical'
import { articleSchema, breadcrumbSchema, faqSchema, graph } from '@/lib/schema'
import { pageMetadata } from '@/lib/seo'

type Params = { params: Promise<{ slug: string }> }

export const revalidate = 3600

export async function generateStaticParams() {
  const slugs = await getPostSlugs()
  return slugs.map(({ slug }) => ({ slug }))
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params
  const post = await getPostBySlug(slug)
  if (!post) return {}

  return pageMetadata({
    title: post.title,
    description: post.excerpt,
    path: post.href,
    seo: post.seo,
    image: post.cover.src,
    type: 'article',
  })
}

/**
 * Un articol.
 *
 * Coloană de 68ch, tipografie de citit atent (`ac-prose` din `globals.css`).
 * Cuprinsul apare doar la 4+ titluri de nivel 2 — sub atât e mai mult zgomot
 * decât ajutor — și folosește exact ancorele pe care `RichText` le pune pe
 * titluri, calculate de aceeași funcție.
 */
export default async function ArticolPage({ params }: Params) {
  const { slug } = await params
  const [post, settings] = await Promise.all([getPostBySlug(slug), getSiteSettings()])

  if (!post) notFound()

  const headings = headingAnchors(asLexical(post.content)).filter((item) => item.level === 2)
  const showToc = headings.length >= 4

  const updated = post.updatedAt.slice(0, 10) !== post.publishedAt.slice(0, 10)
  const shareUrl = absoluteUrl(post.href, settings.url)

  /*
    Legăturile interne obligatorii (brief §9.3): fiecare articol trebuie să
    trimită cel puțin o dată spre un pachet și o dată spre pagina Despre. Dacă
    autorul le-a pus în text, nu le repetăm; dacă nu, blocul de final le adaugă.
    Nu este opțional — este mecanismul prin care blogul aduce conversii, nu doar
    trafic.
  */
  const targets = collectLinkTargets(asLexical(post.content))
  const linksToServices = targets.some(
    (target) => target.startsWith('/servicii') || target === 'payload:packages',
  )
  const linksToAbout = targets.some((target) => target.startsWith('/despre'))

  const trail: Crumb[] = [
    { label: 'Acasă', href: '/' },
    { label: 'Blog', href: '/blog' },
    ...(post.category
      ? [{ label: post.category.name, href: `/blog/categorie/${post.category.slug}` }]
      : []),
    { label: post.title, href: post.href },
  ]

  return (
    <>
      <Breadcrumb trail={trail} />

      <main id="continut">
        <article>
          <Section padding="none" className="pt-[clamp(28px,3.5vw,48px)] pb-[clamp(40px,5vw,64px)]">
            <Shell>
              <div className="max-w-[24ch] min-[900px]:max-w-[34ch]">
                {post.category && (
                  <Eyebrow
                    content={{ text: post.category.name, ornament: 'line' }}
                  />
                )}

                <h1 className="mt-[clamp(24px,3.2vw,40px)] font-display text-h1 font-light">
                  {post.title}
                </h1>
              </div>

              <p className="mt-[clamp(24px,3vw,36px)] max-w-[52ch] font-display text-lead font-light text-ac-ink-70">
                {post.excerpt}
              </p>

              {/* Semnătura: portret mic, dată, „Actualizat la", timp de citire. */}
              <div className="mt-[clamp(32px,4vw,48px)] flex flex-wrap items-center gap-x-6 gap-y-4 border-y border-ac-line py-6">
                <div className="flex items-center gap-4">
                  <span className="block size-11 shrink-0 overflow-hidden rounded-pill">
                    <ImageSlot
                      content={{
                        ...homeContent.despre.portrait,
                        slot: 'post-cover',
                        objectPosition: '50% 30%',
                      }}
                      sizes="44px"
                      className="size-11 rounded-pill"
                    />
                  </span>
                  <span className="text-body-sm leading-[normal]">{settings.siteName}</span>
                </div>

                <p className="font-medium text-[11px] tracking-[0.18em] uppercase text-ac-ink-50">
                  <time dateTime={post.publishedAt}>{formatDateRo(post.publishedAt)}</time>
                  {updated && (
                    <>
                      {' · Actualizat la '}
                      <time dateTime={post.updatedAt}>{formatDateRo(post.updatedAt)}</time>
                    </>
                  )}
                  {' · '}
                  {post.readingTime} min de citit
                </p>
              </div>
            </Shell>
          </Section>

          {post.cover.src && (
            <Section padding="none" className="pb-[clamp(40px,5vw,64px)]">
              <Shell>
                <ImageSlot
                  content={post.cover}
                  priority
                  reveal="clip-on-load"
                  sizes="(max-width: 1560px) 100vw, 1560px"
                />
              </Shell>
            </Section>
          )}

          <Section padding="bottom-only">
            <Shell>
              <div className="mx-auto max-w-[68ch]">
                {showToc && (
                  <nav aria-labelledby="cuprins-titlu" className="mb-[clamp(40px,5vw,64px)] border-y border-ac-line py-7">
                    <h2
                      id="cuprins-titlu"
                      className="font-medium text-label uppercase text-ac-accent-ink"
                    >
                      Ce urmează
                    </h2>
                    <ol className="mt-5 grid gap-3">
                      {headings.map((heading, index) => (
                        <li key={heading.id} className="flex gap-4">
                          <span
                            aria-hidden="true"
                            className="font-medium text-[11px] tracking-[0.18em] text-ac-accent"
                          >
                            {String(index + 1).padStart(2, '0')}
                          </span>
                          <a href={`#${heading.id}`} className="ac-underline text-body leading-[normal]">
                            {heading.text}
                          </a>
                        </li>
                      ))}
                    </ol>
                  </nav>
                )}

                <RichText content={post.content} />

                <div className="mt-[clamp(48px,6vw,80px)]">
                  <ShareRow url={shareUrl} title={post.title} />
                </div>

                {(!linksToServices || !linksToAbout) && (
                  <aside
                    aria-labelledby="mai-departe-titlu"
                    className="mt-[clamp(40px,5vw,64px)] rounded-card border border-ac-line p-[clamp(28px,3vw,40px)]"
                  >
                    <h2
                      id="mai-departe-titlu"
                      className="font-medium text-label uppercase text-ac-accent-ink"
                    >
                      Mai departe
                    </h2>
                    <ul className="mt-5 grid gap-3">
                      {!linksToServices && (
                        <li>
                          <TextLink href="/servicii" className="text-body" arrow>
                            Cum putem lucra împreună
                          </TextLink>
                        </li>
                      )}
                      {!linksToAbout && (
                        <li>
                          <TextLink href="/despre" className="text-body" arrow>
                            Cine sunt și de unde vin
                          </TextLink>
                        </li>
                      )}
                    </ul>
                  </aside>
                )}
              </div>
            </Shell>
          </Section>

          {post.faq.length > 0 && (
            <Section tone="cream" aria-labelledby="faq-articol-titlu">
              <Shell>
                <div className="mx-auto max-w-[68ch]">
                  <h2
                    id="faq-articol-titlu"
                    className="font-display text-h2-col font-light"
                  >
                    Întrebări pe marginea acestui text
                  </h2>
                  <div className="mt-block">
                    <FaqList items={post.faq} />
                  </div>
                </div>
              </Shell>
            </Section>
          )}
        </article>

        {post.related.length > 0 && (
          <Section aria-labelledby="conexe-titlu">
            <Shell>
              <h2 id="conexe-titlu" className="font-display text-h2-col font-light">
                De citit mai departe
              </h2>

              <div className="mt-block grid grid-cols-[repeat(auto-fit,minmax(min(100%,280px),1fr))] gap-[clamp(32px,4vw,56px)]">
                {post.related.map((item, index) => (
                  <PostCard
                    key={item.slug}
                    index={index}
                    post={{
                      title: item.title,
                      href: item.href,
                      categoryLabel: item.category?.name ?? null,
                      categoryHref: item.category
                        ? `/blog/categorie/${item.category.slug}`
                        : null,
                      excerpt: item.excerpt,
                      publishedAt: item.publishedAt,
                      readingTime: item.readingTime,
                      cover: item.cover,
                    }}
                  />
                ))}
              </div>
            </Shell>
          </Section>
        )}

        <PageCta
          eyebrow={{ text: 'Primul pas', ornament: 'pulse' }}
          heading="Dacă textul ăsta ți-a descris situația, hai să vorbim despre ea."
          body="Prima discuție este despre situația ta, nu despre pachete. Dacă nu este potrivit să lucrăm împreună, îți spun."
          primary={{ label: 'Programează o discuție', href: '/contact' }}
          secondary={{ label: 'Vezi pachetele', href: '/servicii' }}
          note={settings.responseTime}
        />
      </main>

      <JsonLd
        data={graph([
          articleSchema(
            {
              title: post.title,
              description: post.excerpt,
              path: post.href,
              publishedAt: post.publishedAt,
              updatedAt: post.updatedAt,
              image: post.cover.src,
              section: post.category?.name ?? null,
              readingTime: post.readingTime,
            },
            settings,
          ),
          breadcrumbSchema(trail, settings.url),
          ...(post.faq.length > 0 ? [faqSchema(post.faq, settings.url, post.href)] : []),
        ])}
      />
    </>
  )
}
