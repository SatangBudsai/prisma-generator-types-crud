// AUTO GENERATED FILE BY prisma-generator-types-crud
// DO NOT EDIT

import { conversationType } from '../conversation/type'
import { massage_enum } from '@prisma/client'
import { JsonValue } from '@prisma/client/runtime/library'

export type messageType = {
  id: string | null
  sender_id: string
  conversation_id: string | null
  type: massage_enum | null
  message: string | null
  user_read: JsonValue | any | null
  created_time: Date | null
  update_time: Date | null
  conversation?: conversationType | null
}
