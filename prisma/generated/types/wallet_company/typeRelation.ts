// AUTO GENERATED FILE BY prisma-generator-types-crud
// DO NOT EDIT

import { companyTypeRelation } from '../company/typeRelation'

export type wallet_companyTypeRelation = {
  id: string | null
  company_id: string
  wallet_address: string
  balance: number | null
  created_at: Date | null
  updated_at: Date | null
  company?: companyTypeRelation | null
}
