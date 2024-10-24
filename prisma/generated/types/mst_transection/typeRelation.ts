// AUTO GENERATED FILE BY prisma-generator-types-crud
// DO NOT EDIT

import { transaction_user_wallet_websiteTypeRelation } from '../transaction_user_wallet_website/typeRelation'

export type mst_transectionTypeRelation = {
  id: string | null
  transection_name: string
  transection_code: string
  created_at: Date | null
  updated_at: Date | null
  transaction_user_wallet_website?: transaction_user_wallet_websiteTypeRelation[] | null
}
