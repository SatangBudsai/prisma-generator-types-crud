// AUTO GENERATED FILE BY prisma-generator-types-crud
// DO NOT EDIT

import { tbl_paymentsTypeRelation } from '../tbl_payments/typeRelation'

export type payment_providersTypeRelation = {
  id: string | null
  name: string
  description: string
  created_at: Date | null
  updated_at: Date | null
  tbl_payments?: tbl_paymentsTypeRelation[] | null
}
