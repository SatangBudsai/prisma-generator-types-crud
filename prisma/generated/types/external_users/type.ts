// AUTO GENERATED FILE BY prisma-generator-types-crud
// DO NOT EDIT

import { applicationType } from '../application/type'
import { $Enums } from '@prisma/client'
import { JsonType } from '../jsonTypes'

export type external_usersType = {
  id: string | null
  app_id: string | null
  url: string | null
  headers: JsonType | null
  type_user_enum: $Enums.type_user_enum | null
  created_time: Date | null
  update_time: Date | null
  application?: applicationType | null
}
