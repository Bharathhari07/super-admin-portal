import { dummyBusinessUnits } from '../data/dummyBusinessUnits'
import { dummyCompanies } from '../data/dummyCompanies'
import { simulateDelay, simulateMutationDelay } from './mockClient'
import type {
  BusinessUnit,
  BusinessUnitListResponse,
  BusinessUnitQueryParams,
  CreateBusinessUnitInput,
  UpdateBusinessUnitInput,
} from '../types/businessUnit'

let buStore: BusinessUnit[] = [...dummyBusinessUnits]

function applyFilters(units: BusinessUnit[], params: BusinessUnitQueryParams): BusinessUnit[] {
  let result = [...units]
  if (params.search && params.search.trim() !== '') {
    const term = params.search.trim().toLowerCase()
    result = result.filter((u) => u.name.toLowerCase().includes(term) || u.code.toLowerCase().includes(term))
  }
  if (params.status && params.status !== 'All') {
    result = result.filter((u) => u.status === params.status)
  }
  if (params.companyId && params.companyId !== 'All') {
    result = result.filter((u) => u.companyId === params.companyId)
  }
  const sortBy = params.sortBy ?? 'createdAt'
  const sortDir = params.sortDir ?? 'desc'
  result.sort((a, b) => {
    let cmp = 0
    if (sortBy === 'name') cmp = a.name.localeCompare(b.name)
    else cmp = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
    return sortDir === 'asc' ? cmp : -cmp
  })
  return result
}

export async function fetchBusinessUnits(params: BusinessUnitQueryParams): Promise<BusinessUnitListResponse> {
  const filtered = applyFilters(buStore, params)
  const page = params.page ?? 1
  const pageSize = params.pageSize ?? 5
  const start = (page - 1) * pageSize
  return simulateDelay({ data: filtered.slice(start, start + pageSize), total: filtered.length, page, pageSize })
}

export async function createBusinessUnit(input: CreateBusinessUnitInput): Promise<BusinessUnit> {
  const codeExists = buStore.some((u) => u.code.toLowerCase() === input.code.toLowerCase())
  if (codeExists) throw new Error('Business unit code already exists. Please choose a unique code.')
  const company = dummyCompanies.find((c) => c.id === input.companyId)
  const newUnit: BusinessUnit = {
    id: `bu${Date.now()}`,
    ...input,
    companyName: company ? company.companyName : 'Unknown',
    createdAt: new Date().toISOString().slice(0, 10),
  }
  buStore = [newUnit, ...buStore]
  return simulateMutationDelay(newUnit)
}

export async function updateBusinessUnit(id: string, input: UpdateBusinessUnitInput): Promise<BusinessUnit> {
  const index = buStore.findIndex((u) => u.id === id)
  if (index === -1) throw new Error('Business unit not found')
  const codeTaken = buStore.some((u) => u.id !== id && u.code.toLowerCase() === input.code.toLowerCase())
  if (codeTaken) throw new Error('Business unit code already exists. Please choose a unique code.')
  const company = dummyCompanies.find((c) => c.id === input.companyId)
  const updated: BusinessUnit = { ...buStore[index], ...input, companyName: company ? company.companyName : 'Unknown' }
  buStore = buStore.map((u) => (u.id === id ? updated : u))
  return simulateMutationDelay(updated)
}

export async function activateBusinessUnit(id: string): Promise<BusinessUnit> {
  const index = buStore.findIndex((u) => u.id === id)
  if (index === -1) throw new Error('Business unit not found')
  const updated: BusinessUnit = { ...buStore[index], status: 'Active' }
  buStore = buStore.map((u) => (u.id === id ? updated : u))
  return simulateMutationDelay(updated)
}

export async function deactivateBusinessUnit(id: string): Promise<BusinessUnit> {
  const index = buStore.findIndex((u) => u.id === id)
  if (index === -1) throw new Error('Business unit not found')
  const updated: BusinessUnit = { ...buStore[index], status: 'Inactive' }
  buStore = buStore.map((u) => (u.id === id ? updated : u))
  return simulateMutationDelay(updated)
}
