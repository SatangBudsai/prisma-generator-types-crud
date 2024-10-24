// AUTO GENERATED FILE BY prisma-generator-types-crud
// DO NOT EDIT

import { mst_transectionTypeRelation } from '../mst_transection/typeRelation'
import { user_wallet_websiteTypeRelation } from '../user_wallet_website/typeRelation'

export type transaction_user_wallet_websiteTypeRelation = {
  id: string | null
  user_wallet_website_id: string
  user_wallet_id: string
  transection_amount: number
  transection_type_code: string
  transection_status: number | null
  created_at: Date | null
  updated_at: Date | null
  mst_transection?: mst_transectionTypeRelation | null
  user_wallet_website?: user_wallet_websiteTypeRelation | null
}
