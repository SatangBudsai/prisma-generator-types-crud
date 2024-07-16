// AUTO GENERATED FILE BY prisma-generator-types-crud
// DO NOT EDIT

import { userType } from '../user/type'

export type applicationType = {
  id: string | null
  domain: string | null
  name: string | null
  logo: string | null
  created_time: Date | null
  update_time: Date | null
  user?: userType[] | null
}
