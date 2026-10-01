import type { InputHTMLAttributes } from 'react'

import { Arrow } from '@/components/ui/Button'
import { cn } from '@/lib/cn'
import { PHONE_PATTERN } from '@/lib/validation/resource'

/**
 * Formularul pentru o resursă „doar cu formular". **Server Component.**
 *
 * Nu e a cincea componentă de client, și nu trebuie să devină: e un
 * `<form method="post">` către `/api/resurse`, ca butonul de plată. Validarea
 * din browser e cea nativă — `required`, `type="email"`, `pattern` —, iar
 * semnalul vizual vine din `:user-invalid`, care se aprinde abia după ce omul
 * a atins câmpul, nu la încărcarea paginii. Serverul verifică totul din nou.
 *
 * Patru câmpuri, toate obligatorii, pentru că exact atât a cerut clienta:
 * prenume, nume, telefon, email. Acordul pentru politica de confidențialitate
 * e obligatoriu și neprebifat; acordul pentru noutăți e separat, opțional și
 * tot neprebifat — GDPR nu permite ca unul să-l condiționeze pe celălalt.
 */
type Props = {
  resourceSlug: string
  /** ID-ul articolului din care s-a cerut, pentru „Din articolul" în admin. */
  postId?: number | null
  /** Mesajul de deasupra câmpurilor, când omul revine după o eroare. */
  error?: string | null
  /** Pe cardul din articol formularul stă pe hârtie; pe pagina resursei, pe crem. */
  className?: string
}

export function ResourceForm({ resourceSlug, postId, error, className }: Props) {
  const id = (name: string) => `resursa-${resourceSlug}-${name}`

  return (
    <form method="post" action="/api/resurse" className={cn('grid gap-6', className)}>
      <input type="hidden" name="resource" value={resourceSlug} />
      {postId ? <input type="hidden" name="post" value={String(postId)} /> : null}

      {/* Honeypot, ca la contact: oamenii nu îl văd, boturile îl completează. */}
      <div aria-hidden="true" className="absolute left-[-9999px] h-px w-px overflow-hidden">
        <label htmlFor={id('website')}>Nu completa acest câmp</label>
        <input id={id('website')} name="website" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      {error && (
        <p role="alert" className="border-l border-ac-accent-deep pl-4 text-body-sm leading-[1.7] text-ac-accent-deep">
          {error}
        </p>
      )}

      <div className="grid gap-6 sm:grid-cols-2">
        <Field id={id('prenume')} name="firstName" label="Prenume" autoComplete="given-name" minLength={2} maxLength={80} />
        <Field id={id('nume')} name="lastName" label="Nume" autoComplete="family-name" minLength={2} maxLength={80} />
        <Field id={id('email')} name="email" label="Email" type="email" autoComplete="email" maxLength={200} />
        <Field
          id={id('telefon')}
          name="phone"
          label="Telefon"
          type="tel"
          inputMode="tel"
          autoComplete="tel"
          pattern={PHONE_PATTERN}
          title="Un număr de telefon, de exemplu 0723 573 123 sau +40 723 573 123."
        />
      </div>

      <div className="grid gap-4">
        <label className="flex items-start gap-3">
          <input
            type="checkbox"
            name="consent"
            required
            className="mt-1 size-[18px] shrink-0 accent-[var(--ac-ink)]"
          />
          <span className="text-body-sm leading-[1.7] text-ac-ink-70">
            Am citit{' '}
            <a href="/politica-de-confidentialitate" className="ac-underline leading-[normal] text-ac-ink">
              politica de confidențialitate
            </a>{' '}
            și sunt de acord ca datele mele să fie folosite pentru a primi acest document și pentru a fi contactat(ă) în legătură cu el.
          </span>
        </label>

        <label className="flex items-start gap-3">
          <input type="checkbox" name="marketing" className="mt-1 size-[18px] shrink-0 accent-[var(--ac-ink)]" />
          <span className="text-body-sm leading-[1.7] text-ac-ink-70">
            Opțional: vreau să primesc, ocazional, articole noi și anunțuri despre workshopuri. Mă pot
            dezabona oricând.
          </span>
        </label>
      </div>

      <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
        <button
          type="submit"
          className="inline-flex min-h-11 cursor-pointer items-center justify-center gap-[10px] rounded-pill border border-ac-ink bg-ac-ink px-[34px] py-[18px] font-medium text-nav uppercase tracking-[0.06em] text-ac-paper transition-[background-color,translate] duration-[320ms] ease-ac hover:-translate-y-[2px] hover:bg-black"
        >
          Trimite și descarcă <Arrow />
        </button>
        <p className="text-body-sm leading-[1.6] text-ac-ink-70">Primești linkul și pe email.</p>
      </div>
    </form>
  )
}

function Field({
  id,
  label,
  type = 'text',
  ...rest
}: { id: string; label: string; name: string } & InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div>
      <label htmlFor={id} className="block font-medium text-label uppercase text-ac-accent-ink">
        {label}
      </label>
      <input
        id={id}
        type={type}
        required
        className="mt-3 block h-12 w-full border border-ac-line bg-ac-paper px-4 font-sans text-body text-ac-ink user-invalid:border-ac-accent-deep"
        {...rest}
      />
    </div>
  )
}
