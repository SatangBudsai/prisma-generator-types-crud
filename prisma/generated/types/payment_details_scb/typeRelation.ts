// AUTO GENERATED FILE BY prisma-generator-types-crud
// DO NOT EDIT

import { tbl_paymentsTypeRelation } from '../tbl_payments/typeRelation'

export type payment_details_scbTypeRelation = {
  id: number | null
  payment_id: number
  ref1: string
  ref2: string
  ref3: string
  qrcode: string
  created_at: Date | null
  updated_at: Date | null
  tbl_payments?: tbl_paymentsTypeRelation | null
}
