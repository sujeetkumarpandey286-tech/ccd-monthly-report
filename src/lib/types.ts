export type UserRole = 'production' | 'quality' | 'environment' | 'safety' | 'viewer' | 'admin'
export type EntryStatus = 'draft' | 'submitted' | 'locked'

export interface Profile {
  id: string
  employee_id: string
  full_name: string
  role: UserRole
  is_active: boolean
}

export interface MonthStatus {
  section_code: string
  fiscal_year: string
  month_index: number
  status: EntryStatus
  submitted_by?: string
  submitted_at?: string
}

export interface AuditEntry {
  id: number
  user_id: string
  action: string
  table_name: string
  fiscal_year: string
  month_index: number
  field_name?: string
  old_value?: string
  new_value?: string
  reason?: string
  created_at: string
  profiles?: { full_name: string }
}

export const MONTHS = ['APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC', 'JAN', 'FEB', 'MAR'] as const
export const FISCAL_YEAR = '2025-26'
