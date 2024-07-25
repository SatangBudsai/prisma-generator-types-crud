// AUTO GENERATED FILE BY prisma-generator-types-crud
// DO NOT EDIT

import { conversation_enum } from '@prisma/client'

export type conversationType = {
  id: string | null
  app_id: string | null
  type: conversation_enum | null
  created_time: Date | null
  update_time: Date | null
  name: string | null
  profile: string | null
  send_message_time: Date | null
}
