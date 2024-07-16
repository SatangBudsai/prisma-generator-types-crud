// AUTO GENERATED FILE BY prisma-generator-types-crud
// DO NOT EDIT

import { userType } from '../user/type'

export type conversation_memberType = {
  id: string
  conversation_id?: string | null
  user_id?: string | null
  created_time: Date
  update_time?: Date | null
  user?: userType | null
}
