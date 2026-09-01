export type DepartmentStatus = 'Active' | 'Inactive'

export interface Department {
  id: string
  name: string
  code: string
  businessUnitId: string
  businessUnitName: string
  head: string
  parentDepartment: string | null
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
  sortBy?: 'name' | 'createdAt'
  sortDir?: 'asc' | 'desc'
  page?: number
  pageSize?: number
}

export interface CreateDepartmentInput {
  name: string
  code: string
  businessUnitId: string
  head: string
  parentDepartment: string | null
  description: string
  status: DepartmentStatus
}

export interface UpdateDepartmentInput {
  name: string
  code: string
  businessUnitId: string
  head: string
  parentDepartment: string | null
  description: string
}
