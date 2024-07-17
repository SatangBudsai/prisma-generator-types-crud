// AUTO GENERATED FILE BY prisma-generator-types-crud
// DO NOT EDIT

import { type_user_enum } from '@prisma/client'
import { JsonValue } from '@prisma/client/runtime/library'

export type external_usersUpdateType = {
  id?: string
  app_id?: string
  url?: string | null
  headers?: JsonValue | null
  type_user_enum?: type_user_enum | null
  created_time?: Date
  update_time?: Date | null
}
