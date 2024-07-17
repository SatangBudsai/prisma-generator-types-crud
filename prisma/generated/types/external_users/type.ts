// AUTO GENERATED FILE BY prisma-generator-types-crud
// DO NOT EDIT

import { applicationType } from '../application/type'
import { type_user_enum } from '@prisma/client'
import { JsonValue } from '@prisma/client/runtime/library'

export type external_usersType = {
  id: string | null
  app_id: string | null
  url: string | null
  headers: JsonValue | any | null
  type_user_enum: type_user_enum | null
  created_time: Date | null
  update_time: Date | null
  application?: applicationType | null
}
