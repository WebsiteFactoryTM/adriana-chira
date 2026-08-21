import { ImageResponse } from 'next/og'

/**
 * Imaginea Open Graph implicită: nume + rol pe fundal crem, în limbajul
 * vizual al site-ului. Se generează o singură dată, la build (`force-static`),
 * nu la fiecare cerere.
 */
export const dynamic = 'force-static'
export const alt = 'Adriana Chira — Consultant în Performanță Umană'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          backgroundColor: '#F2EBDD',
          padding: '80px',
          fontFamily: 'Georgia, serif',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
          <div style={{ width: 64, height: 2, backgroundColor: '#C0A47B' }} />
          <div
            style={{
              fontSize: 22,
              letterSpacing: '0.26em',
              textTransform: 'uppercase',
              color: '#7A6038',
              fontFamily: 'system-ui, sans-serif',
            }}
          >
            Consultant în Performanță Umană
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{ fontSize: 96, color: '#17140F', lineHeight: 1.05 }}>Adriana Chira</div>
          <div style={{ fontSize: 40, color: '#4A443C', marginTop: 24 }}>
            Claritate înainte de decizie.
          </div>
        </div>

        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            fontSize: 20,
            letterSpacing: '0.18em',
            textTransform: 'uppercase',
            color: '#756E64',
            fontFamily: 'system-ui, sans-serif',
          }}
        >
          <span>Timișoara și online</span>
          <span>adrianachira.ro</span>
        </div>
      </div>
    ),
    size,
  )
}
