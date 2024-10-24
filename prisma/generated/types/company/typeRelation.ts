// AUTO GENERATED FILE BY prisma-generator-types-crud
// DO NOT EDIT

import { company_websiteTypeRelation } from '../company_website/typeRelation'
import { wallet_companyTypeRelation } from '../wallet_company/typeRelation'

export type companyTypeRelation = {
  id: string | null
  name: string
  company_number: string
  created_at: Date | null
  updated_at: Date | null
  email: string
  company_website?: company_websiteTypeRelation[] | null
  wallet_company?: wallet_companyTypeRelation | null
}
