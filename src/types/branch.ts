export type BranchStatus = 'Active' | 'Inactive'
export type BranchType = 'Head Office' | 'Regional Office' | 'Branch Office' | 'Satellite Office'

export interface Branch {
  id: string
  name: string
  code: string
  companyId: string
  companyName: string
  businessUnitId: string
  businessUnitName: string
  branchType: BranchType
  manager: string
  contactEmail: string
  contactNumber: string
  effectiveDate: string
  addressLine1: string
  addressLine2: string
  city: string
  state: string
  country: string
  postalCode: string
  timeZone: string
  workingCalendar: string
  costCenterId: string
  branchCapacity: string
  description: string
  status: BranchStatus
  createdAt: string
}

export interface BranchListResponse {
  data: Branch[]
  total: number
  page: number
  pageSize: number
}

export interface BranchQueryParams {
  search?: string
  status?: BranchStatus | 'All'
  businessUnitId?: string | 'All'
  branchType?: BranchType | 'All'
  sortBy?: 'name' | 'createdAt'
  sortDir?: 'asc' | 'desc'
  page?: number
  pageSize?: number
}

export interface CreateBranchInput {
  name: string
  code: string
  companyId: string
  businessUnitId: string
  branchType: BranchType
  manager: string
  contactEmail: string
  contactNumber: string
  effectiveDate: string
  addressLine1: string
  addressLine2: string
  city: string
  state: string
  country: string
  postalCode: string
  timeZone: string
  workingCalendar: string
  costCenterId: string
  branchCapacity: string
  description: string
  status: BranchStatus
}

export interface UpdateBranchInput {
  name: string
  code: string
  companyId: string
  businessUnitId: string
  branchType: BranchType
  manager: string
  contactEmail: string
  contactNumber: string
  effectiveDate: string
  addressLine1: string
  addressLine2: string
  city: string
  state: string
  country: string
  postalCode: string
  timeZone: string
  workingCalendar: string
  costCenterId: string
  branchCapacity: string
  description: string
}

export const BRANCH_TYPE_OPTIONS: BranchType[] = ['Head Office', 'Regional Office', 'Branch Office', 'Satellite Office']
export const TIME_ZONE_OPTIONS = [
  'Asia/Kolkata',
  'America/New_York',
  'Europe/London',
  'Australia/Sydney',
  'Asia/Singapore',
] as const
export const WORKING_CALENDAR_OPTIONS = ['Standard 5-Day', '6-Day Working', '24x7 Operations'] as const
