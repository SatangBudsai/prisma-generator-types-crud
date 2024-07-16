// AUTO GENERATED FILE BY prisma-generator-types-crud
// DO NOT EDIT

import { $Enums } from '@prisma/client'

export type conversationCreateType = {
  app_id?: string
  type?: $Enums.conversation_enum | null
  created_time?: Date | string
  update_time?: (Date | string) | null
  name?: string | null
  profile?: string | null
}
