// AUTO GENERATED FILE BY prisma-generator-types-crud
// DO NOT EDIT

import { userType } from '../user/type'

export type applicationType = {
  id: string
  domain?: string
  name?: string
  logo?: string
  created_time: Date
  update_time?: Date
  user?: userType[]
}
