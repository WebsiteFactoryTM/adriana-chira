import type { Field } from 'payload'

/**
 * Bucățile care se repetă în globalul `home-page`.
 *
 * Designul aprobat pune deasupra fiecărei secțiuni o etichetă versală, cu un
 * ornament: liniuță statică sau punct pulsant. Ornamentul e o alegere de design
 * per secțiune, deci ajunge în CMS ca `select`, nu ca text liber.
 */
export const eyebrowField = (): Field => ({
  name: 'eyebrow',
  type: 'group',
  label: 'Etichetă',
  fields: [
    { name: 'text', type: 'text', label: 'Text', required: true },
    {
      name: 'ornament',
      type: 'select',
      label: 'Ornament',
      defaultValue: 'line',
      options: [
        { label: 'Liniuță', value: 'line' },
        { label: 'Punct pulsant', value: 'pulse' },
        { label: 'Fără', value: 'none' },
      ],
    },
  ],
})

/**
 * Comutatorul de vizibilitate al secțiunii.
 *
 * Ascunde secțiunea din pagină fără să îi șteargă textul. Ordinea secțiunilor
 * NU este editabilă: e fixată de designul aprobat (regula 1 din STATUS.md §2).
 */
export const visibleField = (): Field => ({
  name: 'visible',
  type: 'checkbox',
  label: 'Secțiune vizibilă',
  defaultValue: true,
  admin: {
    description: 'Debifează pentru a ascunde secțiunea, păstrându-i textul.',
  },
})

/** Link cu etichetă și țintă — CTA-uri și linkuri de subsol de secțiune. */
export const linkField = (name: string, label: string): Field => ({
  name,
  type: 'group',
  label,
  fields: [
    { name: 'label', type: 'text', label: 'Text' },
    {
      name: 'href',
      type: 'text',
      label: 'Țintă',
      admin: {
        description: 'O ancoră (#servicii) sau o rută (/servicii).',
      },
    },
  ],
})
