import { dummyLicenses } from '../data/dummyLicenses'
import { dummyTenants } from '../data/dummyTenants'
import { simulateDelay, simulateMutationDelay } from './mockClient'
import type {
  License,
  LicenseListResponse,
  LicenseQueryParams,
  CreateLicenseInput,
  UpdateLicenseInput,
} from '../types/license'

let licenseStore: License[] = [...dummyLicenses]

function applyFilters(licenses: License[], params: LicenseQueryParams): License[] {
  let result = [...licenses]
  if (params.search && params.search.trim() !== '') {
    const term = params.search.trim().toLowerCase()
    result = result.filter((l) => l.name.toLowerCase().includes(term) || l.tenantName.toLowerCase().includes(term))
  }
  if (params.licenseStatus && params.licenseStatus !== 'All') {
    result = result.filter((l) => l.licenseStatus === params.licenseStatus)
  }
  if (params.licenseType && params.licenseType !== 'All') {
    result = result.filter((l) => l.licenseType === params.licenseType)
  }
  if (params.tenantId && params.tenantId !== 'All') {
    result = result.filter((l) => l.tenantId === params.tenantId)
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

export async function fetchLicenses(params: LicenseQueryParams): Promise<LicenseListResponse> {
  const filtered = applyFilters(licenseStore, params)
  const page = params.page ?? 1
  const pageSize = params.pageSize ?? 5
  const start = (page - 1) * pageSize
  return simulateDelay({ data: filtered.slice(start, start + pageSize), total: filtered.length, page, pageSize })
}

function resolveTenantName(tenantId: string): string {
  const tenant = dummyTenants.find((t) => t.id === tenantId)
  return tenant ? tenant.name : 'Unknown'
}

export async function createLicense(input: CreateLicenseInput): Promise<License> {
  const expiry = new Date(input.expiryDate)
  const start = new Date(input.startDate)
  if (expiry <= start) {
    throw new Error('Expiry date must be after the start date.')
  }
  const newLicense: License = {
    id: `lic${Date.now()}`,
    ...input,
    tenantName: resolveTenantName(input.tenantId),
    createdAt: new Date().toISOString().slice(0, 10),
  }
  licenseStore = [newLicense, ...licenseStore]
  return simulateMutationDelay(newLicense)
}

export async function updateLicense(id: string, input: UpdateLicenseInput): Promise<License> {
  const index = licenseStore.findIndex((l) => l.id === id)
  if (index === -1) throw new Error('License not found')
  const expiry = new Date(input.expiryDate)
  const start = new Date(input.startDate)
  if (expiry <= start) {
    throw new Error('Expiry date must be after the start date.')
  }
  const updated: License = { ...licenseStore[index], ...input, tenantName: resolveTenantName(input.tenantId) }
  licenseStore = licenseStore.map((l) => (l.id === id ? updated : l))
  return simulateMutationDelay(updated)
}

export async function activateLicense(id: string): Promise<License> {
  const index = licenseStore.findIndex((l) => l.id === id)
  if (index === -1) throw new Error('License not found')
  const updated: License = { ...licenseStore[index], licenseStatus: 'Active' }
  licenseStore = licenseStore.map((l) => (l.id === id ? updated : l))
  return simulateMutationDelay(updated)
}

export async function suspendLicense(id: string): Promise<License> {
  const index = licenseStore.findIndex((l) => l.id === id)
  if (index === -1) throw new Error('License not found')
  const updated: License = { ...licenseStore[index], licenseStatus: 'Suspended' }
  licenseStore = licenseStore.map((l) => (l.id === id ? updated : l))
  return simulateMutationDelay(updated)
}
