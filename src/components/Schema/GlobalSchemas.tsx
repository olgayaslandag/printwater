'use client'

import { OrganizationSchema, WebSiteSchema } from '@/src/components/Schema'

export default function GlobalSchemas() {
  return (
    <>
      <OrganizationSchema />
      <WebSiteSchema />
    </>
  )
}