export interface OrgOverviewStats {
  totalCompanies: number
  activeCompanies: number
  totalBusinessUnits: number
  totalDepartments: number
  totalBranches: number
  totalCostCenters: number
  totalLocations: number
}

export interface CompanySummary {
  companyId: string
  companyName: string
  businessUnitCount: number
  departmentCount: number
  branchCount: number
  status: 'Draft' | 'Active' | 'Inactive'
}

export interface OrgOverviewResponse {
  stats: OrgOverviewStats
  companySummaries: CompanySummary[]
}
