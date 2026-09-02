export type BusinessUnitStatus = 'Active' | 'Inactive'
export type BusinessUnitType = 'Operational' | 'Strategic' | 'Regional' | 'Functional'

export interface BusinessUnit {
  id: string
  name: string
  code: string
  companyId: string
  companyName: string
  parentBusinessUnit: string | null
  businessUnitType: BusinessUnitType
  head: string
  email: string
  contactNumber: string
  effectiveDate: string
  endDate: string
  region: string
  currency: string
  timeZone: string
  workingCalendar: string
  description: string
  status: BusinessUnitStatus
  createdAt: string
}

export interface BusinessUnitListResponse {
  data: BusinessUnit[]
  total: number
  page: number
  pageSize: number
}

export interface BusinessUnitQueryParams {
  search?: string
  status?: BusinessUnitStatus | 'All'
  companyId?: string | 'All'
  businessUnitType?: BusinessUnitType | 'All'
  sortBy?: 'name' | 'createdAt'
  sortDir?: 'asc' | 'desc'
  page?: number
  pageSize?: number
}

export interface CreateBusinessUnitInput {
  name: string
  code: string
  companyId: string
  parentBusinessUnit: string | null
  businessUnitType: BusinessUnitType
  head: string
  email: string
  contactNumber: string
  effectiveDate: string
  endDate: string
  region: string
  currency: string
  timeZone: string
  workingCalendar: string
  description: string
  status: BusinessUnitStatus
}

export interface UpdateBusinessUnitInput {
  name: string
  code: string
  companyId: string
  parentBusinessUnit: string | null
  businessUnitType: BusinessUnitType
  head: string
  email: string
  contactNumber: string
  effectiveDate: string
  endDate: string
  region: string
  currency: string
  timeZone: string
  workingCalendar: string
  description: string
}

export const BUSINESS_UNIT_TYPE_OPTIONS: BusinessUnitType[] = ['Operational', 'Strategic', 'Regional', 'Functional']
export const CURRENCY_OPTIONS = ['INR', 'USD', 'GBP', 'EUR', 'AUD', 'SGD'] as const
export const TIME_ZONE_OPTIONS = [
  'Asia/Kolkata',
  'America/New_York',
  'Europe/London',
  'Australia/Sydney',
  'Asia/Singapore',
] as const
export const WORKING_CALENDAR_OPTIONS = ['Standard 5-Day', '6-Day Working', '24x7 Operations'] as const
export const REGION_OPTIONS = ['North America', 'Europe', 'Asia Pacific', 'Middle East', 'South Asia', 'Oceania'] as const
