// AUTO GENERATED FILE BY prisma-generator-types-crud
// DO NOT EDIT

import { mst_bankTypeRelation } from '../mst_bank/typeRelation'
import { userTypeRelation } from '../user/typeRelation'

export type user_walletTypeRelation = {
  id: string | null
  bank_id: string | null
  account_number: string | null
  account_name: string | null
  wallet_address: string
  balance: number | null
  created_at: Date | null
  updated_at: Date | null
  user_id: string
  is_fristwithdraw: boolean | null
  stakerefund: number | null
  mst_bank?: mst_bankTypeRelation | null
  user?: userTypeRelation | null
}
