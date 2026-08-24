/* ATENȚIE: fișier generat de Payload. Nu îl edita manual.
 *
 * Grupul `(payload)` are propriul layout rădăcină, separat de `(frontend)`:
 * panoul de administrare își aduce propriul CSS și propriul `<html>`, iar
 * fonturile și bara de consimțământ ale site-ului nu au ce căuta acolo.
 */
import type { ServerFunctionClient } from 'payload'

import config from '@payload-config'
import { RootLayout, handleServerFunctions } from '@payloadcms/next/layouts'
import React from 'react'

import { importMap } from './admin/importMap.js'

import '@payloadcms/next/css'

type Args = {
  children: React.ReactNode
}

const serverFunction: ServerFunctionClient = async function (args) {
  'use server'
  return handleServerFunctions({
    ...args,
    config,
    importMap,
  })
}

const Layout = ({ children }: Args) => (
  <RootLayout config={config} importMap={importMap} serverFunction={serverFunction}>
    {children}
  </RootLayout>
)

export default Layout
