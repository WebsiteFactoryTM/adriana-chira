import type { Access, FieldAccess } from 'payload'

/**
 * Regulile de acces ale proiectului.
 *
 * Două roluri (brief §11, prompt §4.1):
 *   `admin`  — vede tot, inclusiv comenzile și mesajele din formular
 *   `editor` — administrează conținutul editorial, dar NU vede `orders`
 *
 * Regula de citire publică este la fel de importantă ca cea de scriere: API-ul
 * REST și GraphQL sunt expuse pe același domeniu, deci tot ce nu e explicit
 * public trebuie să ceară autentificare. Articolele nepublicate, comenzile și
 * mesajele de contact nu ies niciodată din admin.
 */

type Role = 'admin' | 'editor'

type MaybeUser = { role?: Role | null } | null | undefined

export const isAdmin: Access = ({ req }) => (req.user as MaybeUser)?.role === 'admin'

export const isAdminField: FieldAccess = ({ req }) => (req.user as MaybeUser)?.role === 'admin'

export const isAdminOrEditor: Access = ({ req }) => {
  const role = (req.user as MaybeUser)?.role
  return role === 'admin' || role === 'editor'
}

/** Autentificat = poate citi. Folosit acolo unde nu există conținut public. */
export const isAuthenticated: Access = ({ req }) => Boolean(req.user)

/**
 * Citire publică pentru conținutul publicat.
 *
 * Un utilizator conectat vede tot (inclusiv ciornele, ca să poată previzualiza);
 * publicul vede doar documentele cu `_status: 'published'`.
 */
export const publishedOrAuthenticated: Access = ({ req }) => {
  if (req.user) return true
  return { _status: { equals: 'published' } }
}

/** Citire publică pentru colecțiile fără versionare, filtrate pe `active`. */
export const activeOrAuthenticated: Access = ({ req }) => {
  if (req.user) return true
  return { active: { equals: true } }
}

/** Colecții complet publice la citire: categorii, întrebări frecvente, media. */
export const anyone: Access = () => true

/** Nimeni prin API — documentul e creat exclusiv din cod (webhook, formular). */
export const noone: Access = () => false

/** Contul propriu sau administrator. Pentru colecția `users`. */
export const isAdminOrSelf: Access = ({ req, id }) => {
  const user = req.user as (MaybeUser & { id?: string | number }) | null
  if (!user) return false
  if (user.role === 'admin') return true
  return id === undefined ? { id: { equals: user.id } } : user.id === id
}
