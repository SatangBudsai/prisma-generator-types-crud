// AUTO GENERATED FILE BY prisma-generator-types-crud
// DO NOT EDIT

import { userTypeRelation } from '../user/typeRelation'

export type mst_countryTypeRelation = {
  id: string | null
  country_name_th: string | null
  country_name_en: string | null
  short_name: string | null
  created_at: Date | null
  updated_at: Date | null
  user?: userTypeRelation[] | null
}
