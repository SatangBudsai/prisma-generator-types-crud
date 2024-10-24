// AUTO GENERATED FILE BY prisma-generator-types-crud
// DO NOT EDIT

import { transaction_user_wallet_websiteTypeRelation } from '../transaction_user_wallet_website/typeRelation'
import { company_websiteTypeRelation } from '../company_website/typeRelation'
import { userTypeRelation } from '../user/typeRelation'

export type user_wallet_websiteTypeRelation = {
  id: string | null
  company_website_id: string
  wallet_address: string
  balance: number | null
  created_at: Date | null
  updated_at: Date | null
  user_id: string
  transaction_user_wallet_website?: transaction_user_wallet_websiteTypeRelation[] | null
  company_website?: company_websiteTypeRelation | null
  user?: userTypeRelation | null
}
