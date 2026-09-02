export type CostCenterStatus = 'Active' | 'Inactive'
export type CostCenterType = 'Administrative' | 'Operational' | 'Project' | 'Revenue'
export type BudgetPeriod = 'Monthly' | 'Quarterly' | 'Annual'

export interface CostCenter {
  id: string
  name: string
  code: string
  companyId: string
  companyName: string
  parentCostCenter: string | null
  costCenterType: CostCenterType
  businessUnitId: string
  businessUnitName: string
  departmentId: string
  departmentName: string
  branchId: string
  branchName: string
  budgetOwner: string
  currency: string
  budgetAllocation: number
  budgetPeriod: BudgetPeriod
  financialYear: string
  description: string
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
  costCenterType?: CostCenterType | 'All'
  sortBy?: 'name' | 'createdAt' | 'budgetAllocation'
  sortDir?: 'asc' | 'desc'
  page?: number
  pageSize?: number
}

export interface CreateCostCenterInput {
  name: string
  code: string
  companyId: string
  parentCostCenter: string | null
  costCenterType: CostCenterType
  businessUnitId: string
  departmentId: string
  branchId: string
  budgetOwner: string
  currency: string
  budgetAllocation: number
  budgetPeriod: BudgetPeriod
  financialYear: string
  description: string
  status: CostCenterStatus
}

export interface UpdateCostCenterInput {
  name: string
  code: string
  companyId: string
  parentCostCenter: string | null
  costCenterType: CostCenterType
  businessUnitId: string
  departmentId: string
  branchId: string
  budgetOwner: string
  currency: string
  budgetAllocation: number
  budgetPeriod: BudgetPeriod
  financialYear: string
  description: string
}

export const COST_CENTER_TYPE_OPTIONS: CostCenterType[] = ['Administrative', 'Operational', 'Project', 'Revenue']
export const BUDGET_PERIOD_OPTIONS: BudgetPeriod[] = ['Monthly', 'Quarterly', 'Annual']
export const CURRENCY_OPTIONS = ['INR', 'USD', 'GBP', 'EUR', 'AUD', 'SGD'] as const
export const FINANCIAL_YEAR_OPTIONS = ['Jan - Dec', 'Apr - Mar', 'Jul - Jun', 'Oct - Sep'] as const
