import { revalidatePath } from 'next/cache'

import type {
  CollectionAfterChangeHook,
  CollectionAfterDeleteHook,
  GlobalAfterChangeHook,
} from 'payload'

/**
 * Regenerarea paginilor statice după o salvare în admin.
 *
 * Homepage-ul este prerandat la build. Fără invalidare, o corectură făcută în
 * CMS n-ar apărea pe site până la următorul deploy — adică CMS-ul ar fi decorativ.
 *
 * Payload rulează în același proces cu Next (grupul `(payload)`), deci putem
 * chema direct `revalidatePath`. De asta nu există o rută `/api/revalidate` cu
 * secret: aceea are rost doar când CMS-ul e găzduit separat de site.
 *
 * Apelul e prins în `try`: aceleași hook-uri rulează și din `pnpm seed` și din
 * comenzile CLI, unde nu există context Next, iar acolo `revalidatePath` aruncă.
 * O invalidare ratată într-un script offline nu e o problemă — build-ul care
 * urmează citește oricum datele proaspete.
 */
function revalidate(paths: string[]): void {
  for (const path of paths) {
    try {
      revalidatePath(path)
    } catch {
      // În afara contextului Next (seed, CLI) nu e nimic de invalidat.
    }
  }
}

/** Homepage-ul, dintr-o colecție: întrebări frecvente, categorii. */
export const revalidateHome: CollectionAfterChangeHook = ({ doc }) => {
  revalidate(['/'])
  return doc
}

export const revalidateHomeAfterDelete: CollectionAfterDeleteHook = ({ doc }) => {
  revalidate(['/'])
  return doc
}

/** Homepage-ul, dintr-un global: textele secțiunilor. */
export const revalidateHomeGlobal: GlobalAfterChangeHook = ({ doc }) => {
  revalidate(['/'])
  return doc
}

/** Pagina Despre, care intră la faza 3b. */
export const revalidateAbout: GlobalAfterChangeHook = ({ doc }) => {
  revalidate(['/despre'])
  return doc
}

/**
 * Articolele ating și homepage-ul (cardurile din secțiunea Blog), și paginile
 * de blog. Rutele de blog intră la faza 3b; le invalidăm de pe acum, ca să nu
 * fie nevoie să ne întoarcem aici după ce apar.
 */
export const revalidatePost: CollectionAfterChangeHook = ({ doc, previousDoc }) => {
  const paths = new Set(['/', '/blog', '/sitemap.xml'])

  if (typeof doc?.slug === 'string') paths.add(`/blog/${doc.slug}`)
  // Slug schimbat: vechea adresă trebuie să afle că a devenit 404.
  if (typeof previousDoc?.slug === 'string' && previousDoc.slug !== doc?.slug) {
    paths.add(`/blog/${previousDoc.slug}`)
  }

  revalidate([...paths])
  return doc
}

export const revalidatePostAfterDelete: CollectionAfterDeleteHook = ({ doc }) => {
  const paths = new Set(['/', '/blog', '/sitemap.xml'])
  if (typeof doc?.slug === 'string') paths.add(`/blog/${doc.slug}`)
  revalidate([...paths])
  return doc
}

/** Pachetele: homepage, lista de servicii și pagina proprie. */
export const revalidatePackage: CollectionAfterChangeHook = ({ doc, previousDoc }) => {
  const paths = new Set(['/', '/servicii', '/sitemap.xml'])

  if (typeof doc?.slug === 'string') paths.add(`/servicii/${doc.slug}`)
  if (typeof previousDoc?.slug === 'string' && previousDoc.slug !== doc?.slug) {
    paths.add(`/servicii/${previousDoc.slug}`)
  }

  revalidate([...paths])
  return doc
}

export const revalidatePackageAfterDelete: CollectionAfterDeleteHook = ({ doc }) => {
  const paths = new Set(['/', '/servicii', '/sitemap.xml'])
  if (typeof doc?.slug === 'string') paths.add(`/servicii/${doc.slug}`)
  revalidate([...paths])
  return doc
}

/** Setările site-ului apar în antet și subsol, deci pe fiecare pagină. */
export const revalidateEverything: GlobalAfterChangeHook = ({ doc }) => {
  try {
    revalidatePath('/', 'layout')
  } catch {
    // Vezi mai sus.
  }
  return doc
}
