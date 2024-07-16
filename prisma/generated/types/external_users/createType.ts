// AUTO GENERATED FILE BY prisma-generator-types-crud
// DO NOT EDIT

import { $Enums } from '@prisma/client'
import { JsonType } from '../jsonTypes'

export type external_usersCreateType = {
  app_id?: string
  url?: string | null
  headers?: JsonType | null
  type_user_enum?: $Enums.type_user_enum | null
  created_time?: Date | string
  update_time?: (Date | string) | null
}
