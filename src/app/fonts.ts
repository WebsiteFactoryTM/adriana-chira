import { Cormorant_Garamond, Inter } from 'next/font/google'

/**
 * Fonturi auto-găzduite prin `next/font`: zero request către Google la runtime,
 * deci zero cost de consimțământ GDPR și zero terți în calea LCP.
 *
 * `latin-ext` este OBLIGATORIU. Fără el, ș ț ă â î cad pe fontul de rezervă și
 * pagina se rupe vizual la fiecare diacritică — cea mai frecventă greșeală pe
 * site-urile românești elegante (brief §5.2).
 */

export const display = Cormorant_Garamond({
  subsets: ['latin', 'latin-ext'],
  weight: ['300', '400'],
  style: ['normal'],
  variable: '--font-cormorant',
  display: 'swap',
  // Doar greutatea din primul ecran se preîncarcă (h1 este Cormorant 300).
  preload: true,
  fallback: ['Georgia', 'Times New Roman', 'serif'],
})

export const sans = Inter({
  subsets: ['latin', 'latin-ext'],
  weight: ['400', '500'],
  variable: '--font-inter',
  display: 'swap',
  preload: true,
  fallback: ['system-ui', 'Segoe UI', 'Arial', 'sans-serif'],
})
