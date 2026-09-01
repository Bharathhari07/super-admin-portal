import { dummyCompanies } from '../data/dummyCompanies'
import { dummyBusinessUnits } from '../data/dummyBusinessUnits'
import { dummyDepartments } from '../data/dummyDepartments'
import { dummyBranches } from '../data/dummyBranches'
import { dummyCostCenters } from '../data/dummyCostCenters'
import { dummyLocations } from '../data/dummyLocations'
import { simulateDelay } from './mockClient'
import type { OrgOverviewResponse, CompanySummary } from '../types/orgOverview'

// GET /api/organizations/overview
export async function fetchOrgOverview(): Promise<OrgOverviewResponse> {
  const stats = {
    totalCompanies: dummyCompanies.length,
    activeCompanies: dummyCompanies.filter((c) => c.status === 'Active').length,
    totalBusinessUnits: dummyBusinessUnits.length,
    totalDepartments: dummyDepartments.length,
    totalBranches: dummyBranches.length,
    totalCostCenters: dummyCostCenters.length,
    totalLocations: dummyLocations.length,
  }

  const companySummaries: CompanySummary[] = dummyCompanies.map((company) => {
    const companyBUs = dummyBusinessUnits.filter((bu) => bu.companyId === company.id)
    const buIds = new Set(companyBUs.map((bu) => bu.id))
    const departmentCount = dummyDepartments.filter((d) => buIds.has(d.businessUnitId)).length
    const branchCount = dummyBranches.filter((b) => buIds.has(b.businessUnitId)).length
    return {
      companyId: company.id,
      companyName: company.companyName,
      businessUnitCount: companyBUs.length,
      departmentCount,
      branchCount,
      status: company.status,
    }
  })

  return simulateDelay({ stats, companySummaries })
}
