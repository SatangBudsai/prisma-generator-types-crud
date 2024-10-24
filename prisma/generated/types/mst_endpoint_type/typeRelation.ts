// AUTO GENERATED FILE BY prisma-generator-types-crud
// DO NOT EDIT

import { company_website_endpointTypeRelation } from '../company_website_endpoint/typeRelation'

export type mst_endpoint_typeTypeRelation = {
  id: string | null
  name: string
  created_at: Date | null
  updated_at: Date | null
  code: string
  company_website_endpoint?: company_website_endpointTypeRelation[] | null
}
