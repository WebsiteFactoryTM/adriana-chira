import type { NavItem, PackageDetail, Workshop } from '@/content/types'
import { WORKSHOPS_PATH } from '@/lib/workshops'

/**
 * Submeniurile din antet și din meniul mobil.
 *
 * ## De ce nu stau în `src/content/site.ts`
 *
 * Navigația statică e o listă de rute și rămâne așa. Submeniurile sunt însă
 * inventarul a ceea ce se vinde astăzi: trei programe care se pot redenumi din
 * admin și paisprezece workshopuri cărora li se pun date. Scrise de mână în
 * `site.ts`, ar fi început să mintă la prima modificare din CMS — un program
 * redenumit ar fi apărut cu numele vechi în meniu și cu cel nou în pagină.
 *
 * ## Ce hotărăște ordinea
 *
 * Nimic aici. Programele vin în ordinea din admin (angajament crescător),
 * workshopurile în ordinea calculată de `prepareWorkshops`: întâi edițiile cu
 * dată, cronologic, apoi restul catalogului. Meniul repetă deci ordinea din
 * pagină, iar cine coboară prin submeniu găsește cardurile în aceeași
 * succesiune.
 *
 * ## Adresele workshopurilor sunt ancore, nu rute
 *
 * Catalogul e o singură pagină, cerință de conținut (partea comună a celor
 * paisprezece se scrie o dată, în capul ei). Fiecare card are `id={slug}` și
 * `scroll-mt` cât bara sticky, deci `#slug` aterizează exact pe el.
 */

/** Intrarea din navigație sub care atârnă programele. */
const SERVICES_HREF = '/servicii'

export function navWithSubmenus(
  items: NavItem[],
  { packages, workshops }: { packages: PackageDetail[]; workshops: Workshop[] },
): NavItem[] {
  const services = packageSubmenu(packages)
  const catalog = workshopSubmenu(workshops)

  return items.map((item) => {
    if (item.href === SERVICES_HREF && services.length > 0) {
      return { ...item, children: services }
    }
    if (item.href === WORKSHOPS_PATH && catalog.length > 0) {
      return { ...item, children: catalog }
    }
    return item
  })
}

function packageSubmenu(packages: PackageDetail[]): NavItem[] {
  return packages
    .filter((pkg) => pkg.name !== null)
    .map((pkg) => ({
      label: pkg.name ?? '',
      href: pkg.href,
      // Durata și prețul, pe rândul mic: sunt exact cele două lucruri după
      // care omul alege între trei programe fără să deschidă niciunul.
      detail: [pkg.duration, pkg.price === null ? null : `${pkg.price} ${pkg.currency}`]
        .filter((part): part is string => part !== null)
        .join(' · '),
    }))
}

function workshopSubmenu(workshops: Workshop[]): NavItem[] {
  return workshops.map((workshop) => ({
    label: workshop.title,
    href: workshop.href,
    // Subtitlul este competența căutată în Google; în meniu e mai util decât
    // data, pentru că titlurile catalogului sunt creative („Busola internă")
    // și singure nu spun despre ce e workshopul.
    detail: workshop.subtitle,
  }))
}
