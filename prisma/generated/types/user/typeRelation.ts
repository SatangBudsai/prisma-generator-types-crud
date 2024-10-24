// AUTO GENERATED FILE BY prisma-generator-types-crud
// DO NOT EDIT

import { tbl_paymentsTypeRelation } from '../tbl_payments/typeRelation'
import { mst_countryTypeRelation } from '../mst_country/typeRelation'
import { user_walletTypeRelation } from '../user_wallet/typeRelation'
import { user_wallet_websiteTypeRelation } from '../user_wallet_website/typeRelation'

export type userTypeRelation = {
  id: string
  identification_number: string
  first_name: string
  middle_name: string | null
  last_name: string
  email: string
  phone_number: string
  date_of_birth: Date | null
  profile_image: string | null
  created_at: Date | null
  updated_at: Date | null
  country_id: string | null
  tbl_payments?: tbl_paymentsTypeRelation[] | null
  mst_country?: mst_countryTypeRelation | null
  user_wallet?: user_walletTypeRelation | null
  user_wallet_website?: user_wallet_websiteTypeRelation[] | null
}
