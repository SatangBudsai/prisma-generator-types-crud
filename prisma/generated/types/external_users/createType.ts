// AUTO GENERATED FILE BY prisma-generator-types-crud
// DO NOT EDIT

import { type_user_enum } from '@prisma/client'
import { JsonValue } from '@prisma/client/runtime/library'

export type external_usersCreateType = {
  app_id: string | null
  url: string | null
  headers: JsonValue | any | null
  type_user_enum: type_user_enum | null
}
