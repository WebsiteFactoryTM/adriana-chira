import { Arrow, Button, type ButtonSize, type ButtonVariant } from '@/components/ui/Button'
import { cn } from '@/lib/cn'

/**
 * Butonul care duce la plată.
 *
 * **Server Component, fără o linie de JavaScript.** Este un `<form
 * method="post">` obișnuit către `/api/stripe/checkout`; ruta creează sesiunea
 * și răspunde cu o redirectare 303, pe care browserul o urmează singur.
 *
 * De ce contează: site-ul are exact patru componente de client (STATUS §2,
 * regula 2), și niciuna nu se justifică prin „butonul trebuie să cheme o rută".
 * Un `onClick` cu `fetch` ar fi adus React pe client pe pagina de servicii și
 * pe cea de workshopuri, adică fix pe paginile care trebuie să se încarce
 * repede, pentru că sunt cele pe care se decide o plată.
 *
 * Consecința bună: butonul funcționează și cu JavaScript oprit, și înainte de
 * hidratare — deci nu există fereastra aceea de câteva sute de milisecunde în
 * care pagina arată gata, dar butonul încă nu răspunde.
 *
 * **Din formular pleacă doar `tip` și `slug`.** Prețul se citește pe server
 * (regula 7 din STATUS §2). Nu există niciun câmp cu sumă pe care cineva să îl
 * poată rescrie înainte de trimitere.
 */
type Props = {
  kind: 'pachet' | 'workshop'
  slug: string
  label: string
  variant?: ButtonVariant
  size?: ButtonSize
  className?: string
  /** Clasă pe `<form>`, nu pe buton — pentru lățime și aliniere. */
  formClassName?: string
}

export function CheckoutButton({
  kind,
  slug,
  label,
  variant = 'primary',
  size = 'lg',
  className,
  formClassName,
}: Props) {
  return (
    <form action="/api/stripe/checkout" method="post" className={formClassName}>
      <input type="hidden" name="tip" value={kind} />
      <input type="hidden" name="slug" value={slug} />

      <Button type="submit" variant={variant} size={size} className={cn('w-full', className)}>
        {label}
        <Arrow />
      </Button>
    </form>
  )
}
