// AUTO GENERATED FILE BY prisma-generator-types-crud
// DO NOT EDIT

import { company_websiteTypeRelation } from '../company_website/typeRelation'

export type user_sandboxTypeRelation = {
  id: string | null
  userId: string
  company_website_id: string
  created_at: Date | null
  updated_at: Date | null
  company_website?: company_websiteTypeRelation | null
}
