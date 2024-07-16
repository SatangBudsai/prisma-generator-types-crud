// AUTO GENERATED FILE BY prisma-generator-types-crud
// DO NOT EDIT

import { conversationType } from '../conversation/type'
import { $Enums } from '@prisma/client'
import { JsonType } from '../jsonTypes'

export type messageType = {
  id: string | null
  sender_id: string
  conversation_id: string | null
  type: $Enums.massage_enum | null
  message: string | null
  user_read: JsonType | null
  created_time: Date | null
  update_time: Date | null
  conversation?: conversationType | null
}
