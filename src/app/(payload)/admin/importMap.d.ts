/**
 * Tipul pentru `importMap.js`, fișierul generat de `pnpm generate:importmap`.
 *
 * Generatorul scrie doar JavaScript, iar `allowJs` este `false` în tsconfig
 * (regula 8: TypeScript strict, zero `any`). Declarația de aici îi dă un tip
 * real, fără să relaxăm compilatorul pentru tot proiectul. Nu se regenerează —
 * `generate:importmap` atinge numai fișierul `.js` de alături.
 */
import type { ImportMap } from 'payload'

export declare const importMap: ImportMap
