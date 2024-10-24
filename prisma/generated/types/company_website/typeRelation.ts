// AUTO GENERATED FILE BY prisma-generator-types-crud
// DO NOT EDIT

import { companyTypeRelation } from '../company/typeRelation'
import { company_website_endpointTypeRelation } from '../company_website_endpoint/typeRelation'
import { componay_website_imagesTypeRelation } from '../componay_website_images/typeRelation'
import { promote_company_websiteTypeRelation } from '../promote_company_website/typeRelation'
import { user_sandboxTypeRelation } from '../user_sandbox/typeRelation'
import { user_wallet_websiteTypeRelation } from '../user_wallet_website/typeRelation'
import { status_enum } from '@prisma/client'
import { JsonValue } from '@prisma/client/runtime/library'

export type company_websiteTypeRelation = {
  id: string | null
  company_id: string
  url_website: string | null
  name_th: string | null
  name_en: string | null
  short_description: string | null
  created_at: Date | null
  updated_at: Date | null
  is_active: boolean | null
  status: status_enum | null
  img_website: string | null
  header: JsonValue | any | null
  is_delete: boolean | null
  description: string | null
  company?: companyTypeRelation | null
  company_website_endpoint?: company_website_endpointTypeRelation[] | null
  componay_website_images?: componay_website_imagesTypeRelation[] | null
  promote_company_website?: promote_company_websiteTypeRelation[] | null
  user_sandbox?: user_sandboxTypeRelation[] | null
  user_wallet_website?: user_wallet_websiteTypeRelation[] | null
}
