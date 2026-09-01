export type CostCenterStatus = 'Active' | 'Inactive'

export interface CostCenter {
  id: string
  name: string
  code: string
  businessUnitId: string
  businessUnitName: string
  departmentId: string
  departmentName: string
  manager: string
  budgetAllocation: number
  currency: string
  status: CostCenterStatus
  createdAt: string
}

export interface CostCenterListResponse {
  data: CostCenter[]
  total: number
  page: number
  pageSize: number
}

export interface CostCenterQueryParams {
  search?: string
  status?: CostCenterStatus | 'All'
  businessUnitId?: string | 'All'
  sortBy?: 'name' | 'createdAt' | 'budgetAllocation'
  sortDir?: 'asc' | 'desc'
  page?: number
  pageSize?: number
}

export interface CreateCostCenterInput {
  name: string
  code: string
  businessUnitId: string
  departmentId: string
  manager: string
  budgetAllocation: number
  currency: string
  status: CostCenterStatus
}

export interface UpdateCostCenterInput {
  name: string
  code: string
  businessUnitId: string
  departmentId: string
  manager: string
  budgetAllocation: number
  currency: string
}
