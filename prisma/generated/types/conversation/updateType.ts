// AUTO GENERATED FILE BY prisma-generator-types-crud
// DO NOT EDIT

import { conversation_enum } from '@prisma/client'

export type conversationUpdateType = {
  id?: string
  app_id?: string
  type?: conversation_enum | null
  name?: string | null
  profile?: string | null
  send_message_time?: Date | null
}
