// AUTO GENERATED FILE BY prisma-generator-types-crud
// DO NOT EDIT

import { userType } from '../user/type'

export type applicationType = {
  id: string
  domain: string | null
  name: string | null
  logo: string | null
  created_time: Date
  update_time: Date | null
  user: userType[] | null
}
