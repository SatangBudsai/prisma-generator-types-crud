// AUTO GENERATED FILE BY prisma-generator-types-crud
// DO NOT EDIT

import { conversationType } from '../conversation/type'
import { external_usersType } from '../external_users/type'

export type applicationType = {
  id: string | null
  domain: string | null
  name: string | null
  logo: string | null
  created_time: Date | null
  update_time: Date | null
  conversation?: conversationType[] | null
  external_users?: external_usersType[] | null
}
