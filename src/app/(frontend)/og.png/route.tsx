import { readFile } from 'node:fs/promises'
import path from 'node:path'

import { ImageResponse } from 'next/og'

/**
 * Imaginea de partajare a site-ului — `/og.png`, 1200 × 630.
 *
 * ## De ce rută proprie, și nu `opengraph-image.tsx`
 *
 * Convenția Next publică imaginea la o adresă cu sufix variabil
 * (`/opengraph-image-4usi79`) și o atașează doar segmentului în care stă. Orice
 * pagină care își declară propriul `openGraph` — adică toate, prin
 * `pageMetadata` — o pierdea: paginile de program, blogul și contactul se
 * partajau FĂRĂ imagine. O adresă fixă se poate da explicit de oriunde
 * (`DEFAULT_OG_IMAGE` în `src/lib/seo.ts`), deci fiecare pagină are imagine.
 *
 * ## Ce conține
 *
 * Aceeași compoziție ca primul ecran: hârtie, eticheta versală cu firul auriu,
 * numele în Cormorant Garamond, promisiunea, iar în dreapta portretul din
 * hero. Un chip omenesc în preview crește rata de click mai mult decât orice
 * text; iar fonturile sunt cele reale (`src/assets/fonts`, subset cu
 * diacritice) — fontul implicit al generatorului ar fi pierdut „ș" și „ț".
 *
 * Se generează o singură dată, la build.
 */
export const dynamic = 'force-static'

const SIZE = { width: 1200, height: 630 }

/* `turbopackIgnore`: căile dinamice ar face Turbopack să urmărească tot repo-ul. */
const root = () => path.resolve(/* turbopackIgnore: true */ process.cwd())

export async function GET() {
  const [display, sans, portrait] = await Promise.all([
    readFile(path.join(root(), 'src/assets/fonts/CormorantGaramond-Light.ttf')),
    readFile(path.join(root(), 'src/assets/fonts/Inter-Medium.ttf')),
    readFile(path.join(root(), 'public/images/adriana-hero.jpg'), 'base64'),
  ])

  return new ImageResponse(
    (
      <div style={{ width: '100%', height: '100%', display: 'flex', backgroundColor: '#FAF5EC' }}>
        <div
          style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            padding: '72px 64px 64px 80px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
            <div style={{ width: 56, height: 2, backgroundColor: '#C0A47B' }} />
            <div
              style={{
                fontFamily: 'Inter',
                fontSize: 19,
                letterSpacing: '0.24em',
                textTransform: 'uppercase',
                color: '#7A6038',
              }}
            >
              Consultant în performanță umană
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <div style={{ fontFamily: 'Cormorant', fontSize: 104, lineHeight: 1, color: '#17140F' }}>
              Adriana Chira
            </div>
            <div
              style={{
                fontFamily: 'Cormorant',
                fontSize: 44,
                lineHeight: 1.2,
                color: '#4A443C',
                marginTop: 28,
                maxWidth: 560,
              }}
            >
              Claritate înainte de decizie.
            </div>
          </div>

          <div
            style={{
              display: 'flex',
              gap: 18,
              fontFamily: 'Inter',
              fontSize: 17,
              letterSpacing: '0.18em',
              textTransform: 'uppercase',
              color: '#4A443C',
            }}
          >
            <span>Timișoara și online</span>
            <span style={{ color: '#C0A47B' }}>·</span>
            <span>adrianachira.ro</span>
          </div>
        </div>

        <img
          src={`data:image/jpeg;base64,${portrait}`}
          width={440}
          height={630}
          style={{ objectFit: 'cover', objectPosition: '50% 30%', borderLeft: '1px solid #C0A47B' }}
          alt=""
        />
      </div>
    ),
    {
      ...SIZE,
      fonts: [
        { name: 'Cormorant', data: display, weight: 300, style: 'normal' },
        { name: 'Inter', data: sans, weight: 500, style: 'normal' },
      ],
    },
  )
}
