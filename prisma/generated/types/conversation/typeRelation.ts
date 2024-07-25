// AUTO GENERATED FILE BY prisma-generator-types-crud
// DO NOT EDIT

import { applicationType } from '../application/type'
import { conversation_memberType } from '../conversation_member/type'
import { messageType } from '../message/type'
import { conversation_enum } from '@prisma/client'

export type conversationTypeRelation = {
  id: string | null
  app_id: string | null
  type: conversation_enum | null
  created_time: Date | null
  update_time: Date | null
  name: string | null
  profile: string | null
  mst_app?: applicationType | null
  conversation_member?: conversation_memberType[] | null
  message?: messageType[] | null
}
