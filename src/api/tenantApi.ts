import { dummyTenants, dummyTenantStats } from '../data/dummyTenants'
import { simulateDelay, simulateMutationDelay } from './mockClient'
import type {
  Tenant,
  TenantListResponse,
  TenantQueryParams,
  TenantStats,
  CreateTenantInput,
  UpdateTenantInput,
} from '../types/tenant'

let tenantStore: Tenant[] = [...dummyTenants]

function applyFilters(tenants: Tenant[], params: TenantQueryParams): Tenant[] {
  let result = [...tenants]

  if (params.search && params.search.trim() !== '') {
    const term = params.search.trim().toLowerCase()
    result = result.filter(
      (t) => t.name.toLowerCase().includes(term) || t.code.toLowerCase().includes(term),
    )
  }

  if (params.status && params.status !== 'All') {
    result = result.filter((t) => t.status === params.status)
  }

  if (params.plan && params.plan !== 'All') {
    result = result.filter((t) => t.plan === params.plan)
  }

  const sortBy = params.sortBy ?? 'createdAt'
  const sortDir = params.sortDir ?? 'desc'
  result.sort((a, b) => {
    let cmp = 0
    if (sortBy === 'name') cmp = a.name.localeCompare(b.name)
    else if (sortBy === 'users') cmp = a.users - b.users
    else cmp = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
    return sortDir === 'asc' ? cmp : -cmp
  })

  return result
}

export async function fetchTenants(params: TenantQueryParams): Promise<TenantListResponse> {
  const filtered = applyFilters(tenantStore, params)
  const page = params.page ?? 1
  const pageSize = params.pageSize ?? 5
  const start = (page - 1) * pageSize
  return simulateDelay({
    data: filtered.slice(start, start + pageSize),
    total: filtered.length,
    page,
    pageSize,
  })
}

export async function fetchTenantById(id: string): Promise<Tenant> {
  const tenant = tenantStore.find((t) => t.id === id)
  if (!tenant) throw new Error('Tenant not found')
  return simulateDelay(tenant)
}

export async function fetchTenantStats(id: string): Promise<TenantStats> {
  const tenant = tenantStore.find((t) => t.id === id)
  if (!tenant) throw new Error('Tenant not found')

  const stats: TenantStats =
    dummyTenantStats[id] ?? {
      tenantId: id,
      users: tenant.users,
      organizations: Math.max(1, Math.round(tenant.users / 30)),
      activeUsers: Math.round(tenant.users * 0.87),
      storageUsedPercent: Math.min(95, 20 + Math.round(tenant.users / 5)),
    }

  return simulateDelay(stats)
}

export async function createTenant(input: CreateTenantInput): Promise<Tenant> {
  const codeExists = tenantStore.some((t) => t.code.toLowerCase() === input.code.toLowerCase())
  if (codeExists) throw new Error('Tenant code already exists. Please choose a unique code.')
  const regExists = tenantStore.some(
    (t) => t.businessRegistrationNumber.toLowerCase() === input.businessRegistrationNumber.toLowerCase(),
  )
  if (regExists) throw new Error('Business registration number already exists.')

  const newTenant: Tenant = {
    id: `t${Date.now()}`,
    ...input,
    users: 0,
    createdAt: new Date().toISOString().slice(0, 10),
  }

  tenantStore = [newTenant, ...tenantStore]
  return simulateMutationDelay(newTenant)
}

export async function updateTenant(id: string, input: UpdateTenantInput): Promise<Tenant> {
  const index = tenantStore.findIndex((t) => t.id === id)
  if (index === -1) throw new Error('Tenant not found')

  const codeTakenByAnother = tenantStore.some(
    (t) => t.id !== id && t.code.toLowerCase() === input.code.toLowerCase(),
  )
  if (codeTakenByAnother) throw new Error('Tenant code already exists. Please choose a unique code.')

  const regTaken = tenantStore.some(
    (t) => t.id !== id && t.businessRegistrationNumber.toLowerCase() === input.businessRegistrationNumber.toLowerCase(),
  )
  if (regTaken) throw new Error('Business registration number already exists.')

  const updated: Tenant = { ...tenantStore[index], ...input }
  tenantStore = tenantStore.map((t) => (t.id === id ? updated : t))
  return simulateMutationDelay(updated)
}

export async function activateTenant(id: string): Promise<Tenant> {
  const index = tenantStore.findIndex((t) => t.id === id)
  if (index === -1) throw new Error('Tenant not found')
  const updated: Tenant = { ...tenantStore[index], status: 'Active' }
  tenantStore = tenantStore.map((t) => (t.id === id ? updated : t))
  return simulateMutationDelay(updated)
}

export async function deactivateTenant(id: string): Promise<Tenant> {
  const index = tenantStore.findIndex((t) => t.id === id)
  if (index === -1) throw new Error('Tenant not found')
  const updated: Tenant = { ...tenantStore[index], status: 'Inactive' }
  tenantStore = tenantStore.map((t) => (t.id === id ? updated : t))
  return simulateMutationDelay(updated)
}
