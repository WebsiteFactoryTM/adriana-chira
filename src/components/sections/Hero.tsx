import type { CSSProperties } from 'react'
import { Button } from '@/components/ui/Button'
import { HeroField, PLATE_MASK, PLATE_MASK_SM } from '@/components/ui/HeroField'
import { ImageSlot } from '@/components/ui/ImageSlot'
import { Section, Shell } from '@/components/ui/Section'
import type { HeroContent } from '@/content/types'

/** Decalajul între rândurile titlului, ca în design: 0 / 110 / 220ms. */
const LINE_DELAY = 110

export function Hero({ content }: { content: HeroContent }) {
  return (
    <Section id="hero" padding="none" aura="hero" className="pt-[clamp(4rem,11vh,9rem)] pb-[clamp(5rem,10vw,8rem)]">
      {/* Fundalul care se mișcă în timp. Se poziționează față de secțiune, care
          e deja `relative isolate` din cauza aurei. Stă la `z-index: -1`, sub
          conținut; `Shell` are `z-[1]`, deci nu se poate suprapune peste text. */}
      <HeroField />

      {/* `min-[1000px]:grid-cols-2` nu schimbă nimic la lățimile de desktop —
          `auto-fit` dă tot două coloane egale. E acolo pentru că peste 1000px
          portretul iese din flux (devine placă lipită de marginea dreaptă), iar
          fără template explicit `auto-fit` ar colapsa coloana rămasă goală și
          textul s-ar întinde pe toată lățimea. Sub 1000px rămâne exact grila
          dinainte: o coloană, cu portretul sub text.

          `Shell` NU mai e `relative z-[1]` aici, și e o schimbare cu miză, nu
          curățenie. Un `Shell` poziționat devine blocul de referință al plăcii
          absolute — iar caseta lui e coloana de conținut, adică mai îngustă
          decât secțiunea peste 1560px și mai scurtă cu tot paddingul vertical
          al heroului. Curba plăcii ar fi ajuns astfel în alt sistem de
          coordonate decât curba din fundal, iar cele două s-ar fi ratat cu
          ~110px pe verticală. Fără `relative`, blocul de referință redevine
          secțiunea — exact cutia în care desenează și `HeroField`.

          Ce ținea `z-[1]`: conținutul deasupra câmpului. Câmpul e la
          `z-index: -1` într-o secțiune cu `isolate`, deci stă oricum sub tot
          ce e în flux; peste el, coloana de text are acum `z-[2]` explicit. */}
      <Shell className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,420px),1fr))] items-end gap-[clamp(40px,6vw,96px)] min-[1000px]:grid-cols-2">
        <div className="relative z-[2]">
          <p
            data-enter="fade"
            className="flex items-center gap-[14px] font-medium text-eyebrow uppercase text-ac-accent-ink"
          >
            <span data-enter="draw-x" aria-hidden="true" className="block h-px w-10 shrink-0 bg-ac-accent" />
            {content.eyebrow.text}
          </p>

          {/* Un singur h1 pe pagină (brief §8.2). Rândurile se ridică pe rând. */}
          <h1 className="mt-[clamp(28px,4vw,48px)] max-w-[19ch] font-display text-h1 font-light">
            {content.headlineLines.map((line, index) => (
              <span key={line} className="block overflow-hidden pb-[0.06em]">
                <span
                  data-enter="up"
                  className="block"
                  style={{ '--enter-delay': `${index * LINE_DELAY}ms` } as CSSProperties}
                >
                  {line}
                </span>
              </span>
            ))}
          </h1>

          <p
            data-enter="rise"
            style={{ '--enter-delay': '380ms' } as CSSProperties}
            className="mt-[clamp(24px,3vw,36px)] max-w-[30ch] font-display text-lead font-normal text-ac-ink-70"
          >
            {content.lead}
          </p>

          <p
            data-enter="rise"
            style={{ '--enter-delay': '500ms' } as CSSProperties}
            className="mt-[clamp(32px,4vw,48px)] max-w-[52ch] text-body-lg leading-[1.78] text-ac-ink-70"
          >
            {content.intro}
          </p>

          <div
            data-enter="rise"
            style={{ '--enter-delay': '620ms' } as CSSProperties}
            className="mt-[clamp(36px,4vw,56px)] flex flex-wrap gap-[14px]"
          >
            <Button href={content.primaryCta.href} variant="primary" size="lg">
              {content.primaryCta.label}
            </Button>
            <Button href={content.secondaryCta.href} variant="soft" size="lg">
              {content.secondaryCta.label}
            </Button>
          </div>

          <ul
            data-enter="fade"
            style={{ '--enter-delay': '740ms' } as CSSProperties}
            className="mt-[clamp(48px,6vw,80px)] grid grid-cols-[repeat(auto-fit,minmax(min(100%,150px),1fr))] gap-6 border-t border-ac-line pt-6"
          >
            {content.badges.map((badge) => (
              <li key={badge} className="font-medium text-label uppercase text-ac-ink-50">
                {badge}
              </li>
            ))}
          </ul>
        </div>

        {/*
          Peste 1000px figura devine PLACA: iese din flux, se lipește de
          marginea dreaptă a ecranului, de sus până jos, iar latura ei stângă e
          tăiată de aceeași curbă care se vede în fundal. Sub 1000px rămâne
          exact ce era — o casetă 3:4 de cel mult 520px, sub text — dar cu
          muchia de SUS tăiată de aceeași idee, rotită.

          Amândouă măștile vin gata calculate din `HeroField`, ca să nu existe
          două geometrii care pot să se desincronizeze; comutarea între ele o
          face media query-ul din `globals.css`, la `[data-hero-plate]`. Acolo
          stau și restul regulilor de placă: sunt prea multe (mască pe două
          straturi, compunere, înălțime, legendă repoziționată) ca să încapă
          lizibil în clase utilitare.
        */}
        <figure
          data-hero-plate
          style={
            {
              '--ac-hero-plate-mask': PLATE_MASK,
              '--ac-hero-plate-mask-sm': PLATE_MASK_SM,
            } as CSSProperties
          }
          className="ac-media relative w-full max-w-[520px] justify-self-end"
        >
          <ImageSlot
            content={content.portrait}
            priority
            reveal="clip-on-load"
            revealDelay={200}
            // Sub 1000px imaginea ocupă lățimea coloanei; peste, e placa, adică
            // 52% din lățimea ferestrei (100% − `--ac-hero-plate-left`).
            sizes="(max-width: 999px) 100vw, 52vw"
          />
          {content.portrait.caption && (
            <figcaption className="mt-4 flex justify-end gap-4 font-medium text-label uppercase text-ac-ink-50">
              <span>{content.portrait.caption}</span>
            </figcaption>
          )}
        </figure>
      </Shell>
    </Section>
  )
}
