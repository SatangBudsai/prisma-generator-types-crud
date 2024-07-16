// AUTO GENERATED FILE BY prisma-generator-types-crud
// DO NOT EDIT

import { $Enums } from '@prisma/client'
import { JsonType } from '../jsonTypes'

export type messageCreateType = {
  sender_id: string
  conversation_id?: string
  type?: $Enums.massage_enum | null
  message?: string | null
  user_read?: JsonType | null
  created_time?: Date | string
  update_time?: (Date | string) | null
}
