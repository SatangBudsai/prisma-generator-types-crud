// AUTO GENERATED FILE BY prisma-generator-types-crud
// DO NOT EDIT

import { massage_enum } from '@prisma/client'
import { JsonValue } from '@prisma/client/runtime/library'

export type messageCreateType = {
  sender_id: string
  conversation_id?: string
  type?: massage_enum | null
  message?: string | null
  user_read?: JsonValue | null
  created_time?: Date | string
  update_time?: (Date | string) | null
}
