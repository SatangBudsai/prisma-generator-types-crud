// AUTO GENERATED FILE BY prisma-generator-types-crud
// DO NOT EDIT

export type transaction_user_walletUpdateType = {
  id?: string
  user_wallet_id: string
  user_id: string
  transection_amount: number
  transection_type_code: string
  transection_status?: number
  refcode?: string | null
  created_at?: Date
  updated_at?: Date | null
}
