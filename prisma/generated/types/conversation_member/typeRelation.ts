// AUTO GENERATED FILE BY prisma-generator-types-crud
// DO NOT EDIT

import { conversationType } from '../conversation/type'

export type conversation_memberTypeRelation = {
  id: string | null
  conversation_id: string | null
  user_id: string | null
  created_time: Date | null
  update_time: Date | null
  conversation?: conversationType | null
}
