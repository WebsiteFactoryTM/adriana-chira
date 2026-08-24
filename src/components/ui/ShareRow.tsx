import { CopyLinkButton } from '@/components/ui/CopyLinkButton'

/**
 * Partajarea unui articol, fără niciun script terț.
 *
 * Butoanele oficiale de la LinkedIn, Facebook sau WhatsApp încarcă cod de pe
 * domeniile lor și pun cookie-uri înainte ca cineva să apese ceva — exact ce
 * interzice brief §10.2 și §11.1. Aici sunt trei linkuri `<a>` obișnuite, care
 * nu costă nimic până când nu sunt apăsate, plus un buton de copiere.
 */
type Props = {
  url: string
  title: string
}

export function ShareRow({ url, title }: Props) {
  const encodedUrl = encodeURIComponent(url)
  const encodedTitle = encodeURIComponent(title)

  const links = [
    {
      label: 'LinkedIn',
      href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
    },
    {
      label: 'WhatsApp',
      href: `https://wa.me/?text=${encodedTitle}%20${encodedUrl}`,
    },
    {
      label: 'Email',
      href: `mailto:?subject=${encodedTitle}&body=${encodedUrl}`,
    },
  ]

  return (
    <div className="flex flex-wrap items-center gap-x-7 gap-y-3 border-t border-ac-line pt-7">
      <p className="font-medium text-label uppercase text-ac-ink-50">Trimite mai departe</p>

      <ul className="flex flex-wrap items-center gap-x-6 gap-y-2">
        {links.map((item) => (
          <li key={item.label}>
            <a
              href={item.href}
              target="_blank"
              rel="noopener noreferrer"
              className="ac-underline text-body-sm leading-[normal]"
            >
              {item.label}
            </a>
          </li>
        ))}
        <li>
          <CopyLinkButton url={url} />
        </li>
      </ul>
    </div>
  )
}
