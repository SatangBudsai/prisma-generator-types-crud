// AUTO GENERATED FILE BY prisma-generator-types-crud
// DO NOT EDIT

export type user_walletUpdateType = {
  id?: string
  bank_id?: string | null
  account_number?: string | null
  account_name?: string | null
  wallet_address: string
  balance?: number
  created_at?: Date
  updated_at?: Date | null
  user_id: string
  is_fristwithdraw?: boolean
  stakerefund?: number
}
