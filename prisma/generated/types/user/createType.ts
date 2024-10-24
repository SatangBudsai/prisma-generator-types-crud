// AUTO GENERATED FILE BY prisma-generator-types-crud
// DO NOT EDIT

export type userCreateType = {
  identification_number: string
  first_name: string
  middle_name?: string | null
  last_name: string
  email: string
  phone_number: string
  date_of_birth?: (Date | string) | null
  profile_image?: string | null
  created_at?: Date | string
  updated_at?: (Date | string) | null
  country_id?: string | null
}
