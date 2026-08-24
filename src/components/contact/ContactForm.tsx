'use client'

/**
 * CLIENT COMPONENT — justificat, și pe lista din prompt §5.1.
 *
 * Un formular cu validare pe client, stări de trimitere și mesaje anunțate
 * prin `aria-live` nu are variantă de server. Server Action ar muta trimiterea
 * pe server, dar erorile pe câmp și starea butonului tot ar cere stare de
 * client — și am pierde răspunsul imediat, fără drum dus-întors.
 *
 * Formularul funcționează și fără JavaScript? Nu complet: fără el nu se
 * trimite. Este singura pagină din site cu această limitare, iar alternativa
 * — datele de contact directe — este afișată alături, tot pe pagină.
 */

import type { FormEvent, InputHTMLAttributes } from 'react'
import { useId, useRef, useState } from 'react'

import { contactPage } from '@/content/pages'
import {
  CONTACT_LIMITS,
  contactSchema,
  fieldErrors,
  type FieldErrors,
} from '@/lib/validation/contact'

type Status = 'idle' | 'sending' | 'success' | 'error'

type Props = {
  /** Textul cu care pornește mesajul, când vizitatorul vine de la un pachet. */
  initialMessage?: string
  privacyHref: string
}

export function ContactForm({ initialMessage = '', privacyHref }: Props) {
  const [status, setStatus] = useState<Status>('idle')
  const [errors, setErrors] = useState<FieldErrors>({})
  const [serverError, setServerError] = useState<string | null>(null)

  const formId = useId()
  const feedbackRef = useRef<HTMLDivElement>(null)

  const field = (name: string) => `${formId}-${name}`
  const errorId = (name: string) => `${formId}-${name}-eroare`

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (status === 'sending') return

    const data = new FormData(event.currentTarget)
    const input = {
      name: String(data.get('name') ?? ''),
      email: String(data.get('email') ?? ''),
      phone: String(data.get('phone') ?? ''),
      message: String(data.get('message') ?? ''),
      consent: data.get('consent') === 'on',
      website: String(data.get('website') ?? ''),
    }

    const parsed = contactSchema.safeParse(input)
    if (!parsed.success) {
      setErrors(fieldErrors(parsed.error))
      setStatus('idle')
      setServerError(null)
      // Focus pe primul câmp greșit: altfel eroarea e sub fold pe mobil.
      const first = parsed.error.issues[0]?.path[0]
      if (typeof first === 'string') {
        document.getElementById(field(first))?.focus()
      }
      return
    }

    setErrors({})
    setServerError(null)
    setStatus('sending')

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(parsed.data),
      })

      const result = (await response.json()) as {
        ok?: boolean
        error?: string
        errors?: FieldErrors
      }

      if (!response.ok || !result.ok) {
        if (result.errors) setErrors(result.errors)
        setServerError(result.error ?? contactPage.error.body)
        setStatus('error')
      } else {
        setStatus('success')
      }
    } catch {
      setServerError(contactPage.error.body)
      setStatus('error')
    }

    feedbackRef.current?.focus()
  }

  if (status === 'success') {
    return (
      <div
        ref={feedbackRef}
        tabIndex={-1}
        role="status"
        aria-live="polite"
        className="rounded-card border border-ac-accent bg-ac-cream-50 p-[clamp(28px,3vw,40px)]"
      >
        <p className="font-display text-h3 font-normal">{contactPage.success.title}</p>
        <p className="mt-4 max-w-[46ch] text-body text-ac-ink-70">{contactPage.success.body}</p>
      </div>
    )
  }

  return (
    <form onSubmit={onSubmit} noValidate className="grid gap-7">
      {/*
        Honeypot. `aria-hidden` + `tabIndex={-1}` îl scot din fluxul pentru
        oameni; boturile citesc DOM-ul, nu CSS-ul, și îl completează.
      */}
      <div aria-hidden="true" className="absolute left-[-9999px] h-px w-px overflow-hidden">
        <label htmlFor={field('website')}>Nu completa acest câmp</label>
        <input id={field('website')} name="website" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      <Field
        id={field('name')}
        name="name"
        label={contactPage.labels.name}
        error={errors.name}
        errorId={errorId('name')}
        autoComplete="name"
        maxLength={CONTACT_LIMITS.name.max}
        required
      />

      <Field
        id={field('email')}
        name="email"
        type="email"
        label={contactPage.labels.email}
        error={errors.email}
        errorId={errorId('email')}
        autoComplete="email"
        maxLength={CONTACT_LIMITS.email.max}
        required
      />

      <Field
        id={field('phone')}
        name="phone"
        type="tel"
        label={contactPage.labels.phone}
        error={errors.phone}
        errorId={errorId('phone')}
        autoComplete="tel"
        maxLength={CONTACT_LIMITS.phone.max}
      />

      <div>
        <label htmlFor={field('message')} className="block font-medium text-label uppercase text-ac-accent-ink">
          {contactPage.labels.message}
        </label>
        <textarea
          id={field('message')}
          name="message"
          rows={7}
          required
          defaultValue={initialMessage}
          maxLength={CONTACT_LIMITS.message.max}
          aria-invalid={errors.message ? true : undefined}
          aria-describedby={errors.message ? errorId('message') : undefined}
          className="mt-3 block w-full resize-y border border-ac-line bg-transparent px-4 py-3 font-sans text-body leading-[1.7] text-ac-ink"
        />
        <FieldError id={errorId('message')} message={errors.message} />
      </div>

      <div>
        <label className="flex items-start gap-3">
          <input
            type="checkbox"
            name="consent"
            required
            aria-invalid={errors.consent ? true : undefined}
            aria-describedby={errors.consent ? errorId('consent') : undefined}
            className="mt-1 size-[18px] shrink-0 accent-[var(--ac-ink)]"
          />
          <span className="text-body-sm leading-[1.7] text-ac-ink-70">
            {contactPage.labels.consent}{' '}
            <a href={privacyHref} className="ac-underline leading-[normal] text-ac-ink">
              Politica de confidențialitate
            </a>
            .
          </span>
        </label>
        <FieldError id={errorId('consent')} message={errors.consent} />
      </div>

      <div
        ref={feedbackRef}
        tabIndex={-1}
        role="alert"
        aria-live="assertive"
        className={serverError ? 'text-body-sm text-ac-accent-deep' : 'ac-sr-only'}
      >
        {serverError}
      </div>

      <button
        type="submit"
        disabled={status === 'sending'}
        className="inline-flex min-h-11 w-fit cursor-pointer items-center justify-center gap-[10px] rounded-pill border border-ac-ink bg-ac-ink px-[34px] py-[18px] font-medium text-nav uppercase tracking-[0.06em] text-ac-paper transition-[background-color,transform] duration-[320ms] ease-ac hover:-translate-y-[2px] disabled:cursor-wait disabled:opacity-60 disabled:hover:translate-y-0"
      >
        {status === 'sending' ? contactPage.labels.sending : contactPage.labels.submit}
      </button>
    </form>
  )
}

/** Un câmp de text, cu eticheta și eroarea legate corect de input. */
function Field({
  id,
  name,
  label,
  error,
  errorId,
  type = 'text',
  ...rest
}: {
  id: string
  name: string
  label: string
  error?: string
  errorId: string
  type?: string
} & InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div>
      <label htmlFor={id} className="block font-medium text-label uppercase text-ac-accent-ink">
        {label}
      </label>
      <input
        id={id}
        name={name}
        type={type}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? errorId : undefined}
        className="mt-3 block h-12 w-full border border-ac-line bg-transparent px-4 font-sans text-body text-ac-ink"
        {...rest}
      />
      <FieldError id={errorId} message={error} />
    </div>
  )
}

function FieldError({ id, message }: { id: string; message?: string }) {
  if (!message) return null
  return (
    <p id={id} className="mt-2 text-body-sm leading-[normal] text-ac-accent-deep">
      {message}
    </p>
  )
}
