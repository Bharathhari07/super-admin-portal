import { dummyLocations } from '../data/dummyLocations'
import { dummyBranches } from '../data/dummyBranches'
import { dummyCompanies } from '../data/dummyCompanies'
import { dummyBusinessUnits } from '../data/dummyBusinessUnits'
import { dummyDepartments } from '../data/dummyDepartments'
import { simulateDelay, simulateMutationDelay } from './mockClient'
import type {
  Location,
  LocationListResponse,
  LocationQueryParams,
  CreateLocationInput,
  UpdateLocationInput,
} from '../types/location'

let locationStore: Location[] = [...dummyLocations]

function applyFilters(locations: Location[], params: LocationQueryParams): Location[] {
  let result = [...locations]
  if (params.search && params.search.trim() !== '') {
    const term = params.search.trim().toLowerCase()
    result = result.filter((l) => l.name.toLowerCase().includes(term) || l.code.toLowerCase().includes(term))
  }
  if (params.status && params.status !== 'All') {
    result = result.filter((l) => l.status === params.status)
  }
  if (params.branchId && params.branchId !== 'All') {
    result = result.filter((l) => l.branchId === params.branchId)
  }
  if (params.locationType && params.locationType !== 'All') {
    result = result.filter((l) => l.locationType === params.locationType)
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

export async function fetchLocations(params: LocationQueryParams): Promise<LocationListResponse> {
  const filtered = applyFilters(locationStore, params)
  const page = params.page ?? 1
  const pageSize = params.pageSize ?? 5
  const start = (page - 1) * pageSize
  return simulateDelay({ data: filtered.slice(start, start + pageSize), total: filtered.length, page, pageSize })
}

function resolveNames(companyId: string, branchId: string, businessUnitId: string, departmentId: string) {
  const company = dummyCompanies.find((c) => c.id === companyId)
  const branch = dummyBranches.find((b) => b.id === branchId)
  const bu = dummyBusinessUnits.find((u) => u.id === businessUnitId)
  const dept = dummyDepartments.find((d) => d.id === departmentId)
  return {
    companyName: company ? company.companyName : 'Unknown',
    branchName: branch ? branch.name : 'Unknown',
    businessUnitName: bu ? bu.name : 'Unknown',
    departmentName: dept ? dept.name : 'Unknown',
  }
}

export async function createLocation(input: CreateLocationInput): Promise<Location> {
  const codeExists = locationStore.some((l) => l.code.toLowerCase() === input.code.toLowerCase())
  if (codeExists) throw new Error('Location code already exists. Please choose a unique code.')
  const names = resolveNames(input.companyId, input.branchId, input.businessUnitId, input.departmentId)
  const newLocation: Location = {
    id: `loc${Date.now()}`,
    ...input,
    ...names,
    createdAt: new Date().toISOString().slice(0, 10),
  }
  locationStore = [newLocation, ...locationStore]
  return simulateMutationDelay(newLocation)
}

export async function updateLocation(id: string, input: UpdateLocationInput): Promise<Location> {
  const index = locationStore.findIndex((l) => l.id === id)
  if (index === -1) throw new Error('Location not found')
  const codeTaken = locationStore.some((l) => l.id !== id && l.code.toLowerCase() === input.code.toLowerCase())
  if (codeTaken) throw new Error('Location code already exists. Please choose a unique code.')
  const names = resolveNames(input.companyId, input.branchId, input.businessUnitId, input.departmentId)
  const updated: Location = { ...locationStore[index], ...input, ...names }
  locationStore = locationStore.map((l) => (l.id === id ? updated : l))
  return simulateMutationDelay(updated)
}

export async function activateLocation(id: string): Promise<Location> {
  const index = locationStore.findIndex((l) => l.id === id)
  if (index === -1) throw new Error('Location not found')
  const updated: Location = { ...locationStore[index], status: 'Active' }
  locationStore = locationStore.map((l) => (l.id === id ? updated : l))
  return simulateMutationDelay(updated)
}

export async function deactivateLocation(id: string): Promise<Location> {
  const index = locationStore.findIndex((l) => l.id === id)
  if (index === -1) throw new Error('Location not found')
  const updated: Location = { ...locationStore[index], status: 'Inactive' }
  locationStore = locationStore.map((l) => (l.id === id ? updated : l))
  return simulateMutationDelay(updated)
}
