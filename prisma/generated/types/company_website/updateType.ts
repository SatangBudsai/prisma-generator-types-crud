// AUTO GENERATED FILE BY prisma-generator-types-crud
// DO NOT EDIT

import { status_enum } from '@prisma/client'
import { JsonValue } from '@prisma/client/runtime/library'

export type company_websiteUpdateType = {
  id?: string
  company_id: string
  url_website?: string | null
  name_th?: string | null
  name_en?: string | null
  short_description?: string | null
  created_at?: Date
  updated_at?: Date | null
  is_active?: boolean
  status?: status_enum
  img_website?: string | null
  header?: JsonValue | any | null
  is_delete?: boolean
  description?: string | null
}