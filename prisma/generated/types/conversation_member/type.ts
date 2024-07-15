// AUTO GENERATED FILE BY prisma-generator-types-crud
// DO NOT EDIT

import { userType } from '../user/type'

export type conversation_memberType = {
  id: string
  conversation_id?: string
  user_id?: string
  created_time: Date
  update_time?: Date
  user?: userType
}
