import { dummyCostCenters } from '../data/dummyCostCenters'
import { dummyBusinessUnits } from '../data/dummyBusinessUnits'
import { dummyDepartments } from '../data/dummyDepartments'
import { simulateDelay, simulateMutationDelay } from './mockClient'
import type {
  CostCenter,
  CostCenterListResponse,
  CostCenterQueryParams,
  CreateCostCenterInput,
  UpdateCostCenterInput,
} from '../types/costCenter'

let ccStore: CostCenter[] = [...dummyCostCenters]

function applyFilters(centers: CostCenter[], params: CostCenterQueryParams): CostCenter[] {
  let result = [...centers]
  if (params.search && params.search.trim() !== '') {
    const term = params.search.trim().toLowerCase()
    result = result.filter((c) => c.name.toLowerCase().includes(term) || c.code.toLowerCase().includes(term))
  }
  if (params.status && params.status !== 'All') {
    result = result.filter((c) => c.status === params.status)
  }
  if (params.businessUnitId && params.businessUnitId !== 'All') {
    result = result.filter((c) => c.businessUnitId === params.businessUnitId)
  }
  const sortBy = params.sortBy ?? 'createdAt'
  const sortDir = params.sortDir ?? 'desc'
  result.sort((a, b) => {
    let cmp = 0
    if (sortBy === 'name') cmp = a.name.localeCompare(b.name)
    else if (sortBy === 'budgetAllocation') cmp = a.budgetAllocation - b.budgetAllocation
    else cmp = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
    return sortDir === 'asc' ? cmp : -cmp
  })
  return result
}

export async function fetchCostCenters(params: CostCenterQueryParams): Promise<CostCenterListResponse> {
  const filtered = applyFilters(ccStore, params)
  const page = params.page ?? 1
  const pageSize = params.pageSize ?? 5
  const start = (page - 1) * pageSize
  return simulateDelay({ data: filtered.slice(start, start + pageSize), total: filtered.length, page, pageSize })
}

export async function createCostCenter(input: CreateCostCenterInput): Promise<CostCenter> {
  const codeExists = ccStore.some((c) => c.code.toLowerCase() === input.code.toLowerCase())
  if (codeExists) throw new Error('Cost center code already exists. Please choose a unique code.')
  const bu = dummyBusinessUnits.find((u) => u.id === input.businessUnitId)
  const dept = dummyDepartments.find((d) => d.id === input.departmentId)
  const newCC: CostCenter = {
    id: `cc${Date.now()}`,
    ...input,
    businessUnitName: bu ? bu.name : 'Unknown',
    departmentName: dept ? dept.name : 'Unknown',
    createdAt: new Date().toISOString().slice(0, 10),
  }
  ccStore = [newCC, ...ccStore]
  return simulateMutationDelay(newCC)
}

export async function updateCostCenter(id: string, input: UpdateCostCenterInput): Promise<CostCenter> {
  const index = ccStore.findIndex((c) => c.id === id)
  if (index === -1) throw new Error('Cost center not found')
  const codeTaken = ccStore.some((c) => c.id !== id && c.code.toLowerCase() === input.code.toLowerCase())
  if (codeTaken) throw new Error('Cost center code already exists. Please choose a unique code.')
  const bu = dummyBusinessUnits.find((u) => u.id === input.businessUnitId)
  const dept = dummyDepartments.find((d) => d.id === input.departmentId)
  const updated: CostCenter = {
    ...ccStore[index],
    ...input,
    businessUnitName: bu ? bu.name : 'Unknown',
    departmentName: dept ? dept.name : 'Unknown',
  }
  ccStore = ccStore.map((c) => (c.id === id ? updated : c))
  return simulateMutationDelay(updated)
}

export async function activateCostCenter(id: string): Promise<CostCenter> {
  const index = ccStore.findIndex((c) => c.id === id)
  if (index === -1) throw new Error('Cost center not found')
  const updated: CostCenter = { ...ccStore[index], status: 'Active' }
  ccStore = ccStore.map((c) => (c.id === id ? updated : c))
  return simulateMutationDelay(updated)
}

export async function deactivateCostCenter(id: string): Promise<CostCenter> {
  const index = ccStore.findIndex((c) => c.id === id)
  if (index === -1) throw new Error('Cost center not found')
  const updated: CostCenter = { ...ccStore[index], status: 'Inactive' }
  ccStore = ccStore.map((c) => (c.id === id ? updated : c))
  return simulateMutationDelay(updated)
}
