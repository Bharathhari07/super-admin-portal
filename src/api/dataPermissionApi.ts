import { dummyDataPermissions } from '../data/dummyDataPermissions'
import { dummyRoles } from '../data/dummyRoles'
import { simulateDelay, simulateMutationDelay } from './mockClient'
import type {
  DataPermission,
  DataPermissionListResponse,
  DataPermissionQueryParams,
  CreateDataPermissionInput,
  UpdateDataPermissionInput,
} from '../types/dataPermission'

let dataPermissionStore: DataPermission[] = [...dummyDataPermissions]

function applyFilters(permissions: DataPermission[], params: DataPermissionQueryParams): DataPermission[] {
  let result = [...permissions]
  if (params.search && params.search.trim() !== '') {
    const term = params.search.trim().toLowerCase()
    result = result.filter((p) => p.name.toLowerCase().includes(term))
  }
  if (params.status && params.status !== 'All') {
    result = result.filter((p) => p.status === params.status)
  }
  if (params.roleId && params.roleId !== 'All') {
    result = result.filter((p) => p.roleId === params.roleId)
  }
  if (params.accessScope && params.accessScope !== 'All') {
    result = result.filter((p) => p.accessScope === params.accessScope)
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

export async function fetchDataPermissions(params: DataPermissionQueryParams): Promise<DataPermissionListResponse> {
  const filtered = applyFilters(dataPermissionStore, params)
  const page = params.page ?? 1
  const pageSize = params.pageSize ?? 5
  const start = (page - 1) * pageSize
  return simulateDelay({ data: filtered.slice(start, start + pageSize), total: filtered.length, page, pageSize })
}

export async function createDataPermission(input: CreateDataPermissionInput): Promise<DataPermission> {
  const duplicate = dataPermissionStore.some((p) => p.name.toLowerCase() === input.name.toLowerCase())
  if (duplicate) throw new Error('A data permission with this name already exists.')
  const role = dummyRoles.find((r) => r.id === input.roleId)
  const newPermission: DataPermission = {
    id: `dp${Date.now()}`,
    ...input,
    roleName: role ? role.name : 'Unknown',
    createdAt: new Date().toISOString().slice(0, 10),
  }
  dataPermissionStore = [newPermission, ...dataPermissionStore]
  return simulateMutationDelay(newPermission)
}

export async function updateDataPermission(id: string, input: UpdateDataPermissionInput): Promise<DataPermission> {
  const index = dataPermissionStore.findIndex((p) => p.id === id)
  if (index === -1) throw new Error('Data permission not found')
  const role = dummyRoles.find((r) => r.id === input.roleId)
  const updated: DataPermission = { ...dataPermissionStore[index], ...input, roleName: role ? role.name : 'Unknown' }
  dataPermissionStore = dataPermissionStore.map((p) => (p.id === id ? updated : p))
  return simulateMutationDelay(updated)
}

export async function activateDataPermission(id: string): Promise<DataPermission> {
  const index = dataPermissionStore.findIndex((p) => p.id === id)
  if (index === -1) throw new Error('Data permission not found')
  const updated: DataPermission = { ...dataPermissionStore[index], status: 'Active' }
  dataPermissionStore = dataPermissionStore.map((p) => (p.id === id ? updated : p))
  return simulateMutationDelay(updated)
}

export async function deactivateDataPermission(id: string): Promise<DataPermission> {
  const index = dataPermissionStore.findIndex((p) => p.id === id)
  if (index === -1) throw new Error('Data permission not found')
  const updated: DataPermission = { ...dataPermissionStore[index], status: 'Inactive' }
  dataPermissionStore = dataPermissionStore.map((p) => (p.id === id ? updated : p))
  return simulateMutationDelay(updated)
}
