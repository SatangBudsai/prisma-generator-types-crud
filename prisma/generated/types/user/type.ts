// AUTO GENERATED FILE BY prisma-generator-types-crud
// DO NOT EDIT

import { conversation_memberType } from '../conversation_member/type'
import { applicationType } from '../application/type'

export type userType = {
  id: string
  app_id: string
  user_key: string
  name: string | null
  profile: string | null
  created_time: Date | null
  update_time: Date | null
  conversation_member?: conversation_memberType[] | null
  mst_app?: applicationType | null
}
