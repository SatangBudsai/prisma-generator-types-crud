// AUTO GENERATED FILE BY prisma-generator-types-crud
// DO NOT EDIT

import { conversation_enum } from '@prisma/client'

export type conversationType = {
  id?: string
  app_id?: string
  type?: conversation_enum | null
  created_time?: Date
  update_time?: Date | null
  name?: string | null
  profile?: string | null
}
