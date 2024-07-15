// AUTO GENERATED FILE BY prisma-generator-types-crud
// DO NOT EDIT

import { conversation_memberType } from '../conversation_member/type'
import { applicationType } from '../application/type'

export type userType = {
  id: string
  app_id: string
  user_key: string
  name?: string
  profile?: string
  created_time?: Date
  update_time?: Date
  conversation_member?: conversation_memberType[]
  mst_app?: applicationType
}
