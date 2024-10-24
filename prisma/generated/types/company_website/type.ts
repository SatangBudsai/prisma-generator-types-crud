// AUTO GENERATED FILE BY prisma-generator-types-crud
// DO NOT EDIT

import { status_enum } from '@prisma/client'
import { JsonValue } from '@prisma/client/runtime/library'

export type company_websiteType = {
  id: string | null
  company_id: string | null
  url_website: string | null
  name_th: string | null
  name_en: string | null
  short_description: string | null
  created_at: Date | null
  updated_at: Date | null
  is_active: boolean | null
  status: status_enum | null
  img_website: string | null
  header: JsonValue | any | null
  is_delete: boolean | null
  description: string | null
}
