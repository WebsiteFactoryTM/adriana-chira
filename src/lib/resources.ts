import { createHmac, timingSafeEqual } from 'node:crypto'

/**
 * Resursele descărcabile: regulile comune colecției, rutelor și paginilor.
 *
 * ## Limitele de încărcare, și de unde vin cifrele
 *
 * Pe Vercel, o funcție primește cel mult **4,5 MB** în corpul cererii. Un PDF
 * de 8 MB urcat prin API-ul Payload cade acolo, înainte să ajungă la noi, cu o
 * eroare pe care redactorul nu o înțelege. De aceea, când există
 * `BLOB_READ_WRITE_TOKEN`, fișierele colecției `resources` urcă **direct din
 * browser în Vercel Blob** (`clientUploads` în `payload.config.ts`), iar
 * plafonul devine cel de mai jos — al nostru, nu al platformei.
 *
 * 20 MB acoperă un ghid de 60 de pagini cu imagini sau o prezentare exportată.
 * Peste atât, fișierul e aproape sigur neoptimizat — și îl descarcă un om pe
 * date mobile. Limita se verifică pe server, în hook, indiferent de calea pe
 * care a urcat fișierul: validarea din browser se poate ocoli.
 */
export const RESOURCE_MAX_BYTES = 20 * 1024 * 1024

/**
 * Formatele acceptate. Documente, nu executabile: fără arhive (pot ascunde
 * orice), fără HTML sau SVG (rulează script în browserul celui care deschide).
 */
export const RESOURCE_FORMATS: Record<string, string> = {
  'application/pdf': 'PDF',
  'application/msword': 'DOC',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'DOCX',
  'application/vnd.ms-excel': 'XLS',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': 'XLSX',
  'application/vnd.ms-powerpoint': 'PPT',
  'application/vnd.openxmlformats-officedocument.presentationml.presentation': 'PPTX',
  'application/vnd.oasis.opendocument.text': 'ODT',
  'application/vnd.oasis.opendocument.spreadsheet': 'ODS',
  'application/vnd.oasis.opendocument.presentation': 'ODP',
  'application/epub+zip': 'EPUB',
  'audio/mpeg': 'MP3',
  'image/jpeg': 'JPG',
  'image/png': 'PNG',
}

export const RESOURCE_MIME_TYPES = Object.keys(RESOURCE_FORMATS)

/** Directorul local, folosit doar fără Vercel Blob. În afara lui `public/`. */
export const RESOURCE_STATIC_DIR = 'storage/resurse'

export type ResourceAccess = 'free' | 'gated'

/** „PDF · 2,4 MB", eticheta de pe card. */
export function resourceMeta(mimeType: string | null | undefined, bytes: number | null | undefined) {
  const format = (mimeType && RESOURCE_FORMATS[mimeType]) ?? 'Fișier'
  return typeof bytes === 'number' && bytes > 0 ? `${format} · ${formatBytes(bytes)}` : format
}

export function formatBytes(bytes: number): string {
  if (bytes < 1024 * 1024) return `${Math.max(1, Math.round(bytes / 1024))} KB`
  return `${(bytes / (1024 * 1024)).toLocaleString('ro-RO', { maximumFractionDigits: 1 })} MB`
}

/* -------------------------------------------------------------------------- */
/* Linkul de descărcare pentru resursele cu formular                           */
/* -------------------------------------------------------------------------- */

/**
 * Cât e valabil linkul primit după formular. Șapte zile: destul ca omul să îl
 * deschidă din email a doua zi, de pe alt dispozitiv; puțin cât să nu devină
 * un link public care circulă la nesfârșit.
 */
export const DOWNLOAD_TOKEN_DAYS = 7

/**
 * Jetonul e semnat, nu stocat: `resursă.solicitare.expirare.semnătură`.
 *
 * Nu are nevoie de tabel propriu și nu poate fi fabricat fără
 * `PAYLOAD_SECRET`. Leagă descărcarea de solicitarea din care a pornit, deci
 * în admin se vede cine a primit linkul. Prefixul `resurse:` din mesajul
 * semnat împiedică refolosirea aceluiași secret pentru alt fel de jeton.
 */
function sign(message: string): string {
  const secret = process.env.PAYLOAD_SECRET
  if (!secret) throw new Error('PAYLOAD_SECRET lipsește')
  return createHmac('sha256', secret).update(`resurse:${message}`).digest('base64url')
}

export function createDownloadToken(resourceId: number, requestId: number, now = Date.now()) {
  const expires = Math.floor(now / 1000) + DOWNLOAD_TOKEN_DAYS * 24 * 60 * 60
  const message = `${resourceId}.${requestId}.${expires}`
  return `${message}.${sign(message)}`
}

export type DownloadToken = { resourceId: number; requestId: number; expires: number }

/** `null` la orice abatere: format, semnătură, expirare. Nu spune care. */
export function verifyDownloadToken(token: string | null | undefined, now = Date.now()): DownloadToken | null {
  if (!token) return null
  const parts = token.split('.')
  if (parts.length !== 4) return null

  const [resource, request, expires, signature] = parts
  if (!resource || !request || !expires || !signature) return null
  if (![resource, request, expires].every((part) => /^\d{1,12}$/.test(part))) return null

  let expected: string
  try {
    expected = sign(`${resource}.${request}.${expires}`)
  } catch {
    return null
  }

  const a = Buffer.from(signature)
  const b = Buffer.from(expected)
  if (a.length !== b.length || !timingSafeEqual(a, b)) return null

  const parsed = { resourceId: Number(resource), requestId: Number(request), expires: Number(expires) }
  if (parsed.expires * 1000 < now) return null
  return parsed
}

/* -------------------------------------------------------------------------- */
/* Adresele                                                                     */
/* -------------------------------------------------------------------------- */

export const resourceHref = (slug: string) => `/resurse/${slug}`

export const resourceFileHref = (slug: string, token?: string) =>
  `/api/resurse/${slug}/fisier${token ? `?t=${encodeURIComponent(token)}` : ''}`

export const resourceThanksHref = (slug: string, token: string) =>
  `/resurse/${slug}/descarca?t=${encodeURIComponent(token)}`
