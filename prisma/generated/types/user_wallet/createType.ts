// AUTO GENERATED FILE BY prisma-generator-types-crud
// DO NOT EDIT

export type user_walletCreateType = {
  bank_id?: string | null
  account_number?: string | null
  account_name?: string | null
  wallet_address: string
  balance?: number
  created_at?: Date | string
  updated_at?: (Date | string) | null
  user_id: string
  is_fristwithdraw?: boolean
  stakerefund?: number
}
