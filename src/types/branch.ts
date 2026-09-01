export type BranchStatus = 'Active' | 'Inactive'

export interface Branch {
  id: string
  name: string
  code: string
  businessUnitId: string
  businessUnitName: string
  manager: string
  address: string
  city: string
  state: string
  country: string
  phone: string
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
  sortBy?: 'name' | 'createdAt'
  sortDir?: 'asc' | 'desc'
  page?: number
  pageSize?: number
}

export interface CreateBranchInput {
  name: string
  code: string
  businessUnitId: string
  manager: string
  address: string
  city: string
  state: string
  country: string
  phone: string
  status: BranchStatus
}

export interface UpdateBranchInput {
  name: string
  code: string
  businessUnitId: string
  manager: string
  address: string
  city: string
  state: string
  country: string
  phone: string
}
