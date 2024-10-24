// AUTO GENERATED FILE BY prisma-generator-types-crud
// DO NOT EDIT

import { payment_details_2c2pTypeRelation } from '../payment_details_2c2p/typeRelation'
import { payment_details_scbTypeRelation } from '../payment_details_scb/typeRelation'
import { payment_providersTypeRelation } from '../payment_providers/typeRelation'
import { userTypeRelation } from '../user/typeRelation'

export type tbl_paymentsTypeRelation = {
  id: number | null
  user_id: string
  amount: number | null
  currency: string
  status: string | null
  created_at: Date | null
  updated_at: Date | null
  payment_provider_id: string
  payment_details_2c2p?: payment_details_2c2pTypeRelation[] | null
  payment_details_scb?: payment_details_scbTypeRelation[] | null
  payment_providers?: payment_providersTypeRelation | null
  user?: userTypeRelation | null
}
