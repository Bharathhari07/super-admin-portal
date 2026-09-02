export type DepartmentStatus = 'Active' | 'Inactive'
export type DepartmentType = 'Functional' | 'Operational' | 'Support' | 'Administrative'

export interface Department {
  id: string
  name: string
  code: string
  companyId: string
  companyName: string
  businessUnitId: string
  businessUnitName: string
  parentDepartment: string | null
  departmentType: DepartmentType
  head: string
  deputyHead: string
  contactEmail: string
  contactNumber: string
  effectiveDate: string
  endDate: string
  costCenterId: string
  branchId: string
  branchName: string
  locationId: string
  workingCalendar: string
  description: string
  status: DepartmentStatus
  createdAt: string
}

export interface DepartmentListResponse {
  data: Department[]
  total: number
  page: number
  pageSize: number
}

export interface DepartmentQueryParams {
  search?: string
  status?: DepartmentStatus | 'All'
  businessUnitId?: string | 'All'
  departmentType?: DepartmentType | 'All'
  sortBy?: 'name' | 'createdAt'
  sortDir?: 'asc' | 'desc'
  page?: number
  pageSize?: number
}

export interface CreateDepartmentInput {
  name: string
  code: string
  companyId: string
  businessUnitId: string
  parentDepartment: string | null
  departmentType: DepartmentType
  head: string
  deputyHead: string
  contactEmail: string
  contactNumber: string
  effectiveDate: string
  endDate: string
  costCenterId: string
  branchId: string
  locationId: string
  workingCalendar: string
  description: string
  status: DepartmentStatus
}

export interface UpdateDepartmentInput {
  name: string
  code: string
  companyId: string
  businessUnitId: string
  parentDepartment: string | null
  departmentType: DepartmentType
  head: string
  deputyHead: string
  contactEmail: string
  contactNumber: string
  effectiveDate: string
  endDate: string
  costCenterId: string
  branchId: string
  locationId: string
  workingCalendar: string
  description: string
}

export const DEPARTMENT_TYPE_OPTIONS: DepartmentType[] = ['Functional', 'Operational', 'Support', 'Administrative']
export const WORKING_CALENDAR_OPTIONS = ['Standard 5-Day', '6-Day Working', '24x7 Operations'] as const
