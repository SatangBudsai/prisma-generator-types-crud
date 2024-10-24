// AUTO GENERATED FILE BY prisma-generator-types-crud
// DO NOT EDIT

import { user_walletTypeRelation } from '../user_wallet/typeRelation'

export type mst_bankTypeRelation = {
  id: string | null
  code: string | null
  name_en: string | null
  name_th: string | null
  profile_image: string | null
  created_at: Date | null
  updated_at: Date | null
  short_name: string | null
  user_wallet?: user_walletTypeRelation[] | null
}
