// AUTO GENERATED FILE BY prisma-generator-types-crud
// DO NOT EDIT

import { conversation_enum } from '@prisma/client'

export type conversationCreateType = {
  app_id?: string
  type?: conversation_enum | null
  created_time?: Date | string
  update_time?: (Date | string) | null
  name?: string | null
  profile?: string | null
}
