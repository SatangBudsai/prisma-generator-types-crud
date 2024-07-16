// AUTO GENERATED FILE BY prisma-generator-types-crud
// DO NOT EDIT

import { $Enums } from '@prisma/client'

export type conversationUpdateType = {
  id?: string
  app_id?: string
  type?: $Enums.conversation_enum | null
  created_time?: Date
  update_time?: Date | null
  name?: string | null
  profile?: string | null
}
