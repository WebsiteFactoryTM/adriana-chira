import config from '@payload-config'
import { getPayload, type Payload } from 'payload'

/**
 * Accesul la Payload din Server Components și din rutele de API.
 *
 * `getPayload` își memorează singur instanța la nivel de modul, deci apelurile
 * repetate nu redeschid pool-ul de conexiuni. Wrapper-ul există pentru două
 * motive: să nu împrăștie importul de `@payload-config` prin tot codul și să
 * ofere varianta „tolerantă la lipsa bazei de date" de mai jos.
 */
export async function getPayloadClient(): Promise<Payload> {
  return getPayload({ config })
}

/**
 * Aceeași instanță, dar `null` dacă baza de date nu răspunde.
 *
 * Ne trebuie pentru că `next build` prerandează homepage-ul: dacă build-ul ar
 * cădea de fiecare dată când Postgres nu e pornit local sau când un mediu de
 * preview n-are încă `DATABASE_URI`, am transforma CMS-ul într-o dependență
 * dură a livrării. Site-ul are deja conținutul aprobat în `src/content/`, deci
 * ramura fără bază de date produce exact pagina din design.
 *
 * Eroarea se loghează o singură dată per proces — altfel un build cu multe
 * pagini o repetă de zeci de ori.
 */
let warned = false

export async function getPayloadClientSafe(): Promise<Payload | null> {
  if (!process.env.DATABASE_URI) {
    if (!warned) {
      warned = true
      console.warn('[content] DATABASE_URI lipsește — se folosește conținutul din src/content/.')
    }
    return null
  }

  try {
    return await getPayload({ config })
  } catch (error) {
    if (!warned) {
      warned = true
      const message = error instanceof Error ? error.message : String(error)
      console.warn(`[content] Payload indisponibil (${message}) — se folosește src/content/.`)
    }
    return null
  }
}
