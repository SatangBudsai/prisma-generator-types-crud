// AUTO GENERATED FILE BY prisma-generator-types-crud
// DO NOT EDIT

import { company_websiteTypeRelation } from '../company_website/typeRelation'
import { mst_endpoint_typeTypeRelation } from '../mst_endpoint_type/typeRelation'

export type company_website_endpointTypeRelation = {
  id: string | null
  company_website_id: string
  endpoint_type_code: string
  url_endpoint: string
  created_at: Date | null
  updated_at: Date | null
  company_website?: company_websiteTypeRelation | null
  mst_endpoint_type?: mst_endpoint_typeTypeRelation | null
}
