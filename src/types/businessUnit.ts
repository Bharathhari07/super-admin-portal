export type BusinessUnitStatus = 'Active' | 'Inactive'

export interface BusinessUnit {
  id: string
  name: string
  code: string
  companyId: string
  companyName: string
  head: string
  parentBusinessUnit: string | null
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
  sortBy?: 'name' | 'createdAt'
  sortDir?: 'asc' | 'desc'
  page?: number
  pageSize?: number
}

export interface CreateBusinessUnitInput {
  name: string
  code: string
  companyId: string
  head: string
  parentBusinessUnit: string | null
  description: string
  status: BusinessUnitStatus
}

export interface UpdateBusinessUnitInput {
  name: string
  code: string
  companyId: string
  head: string
  parentBusinessUnit: string | null
  description: string
}
