import { dummyPermissions } from '../data/dummyPermissions'
import { simulateDelay, simulateMutationDelay } from './mockClient'
import type {
  Permission,
  PermissionListResponse,
  PermissionQueryParams,
  CreatePermissionInput,
  UpdatePermissionInput,
} from '../types/permission'

let permissionStore: Permission[] = [...dummyPermissions]

function applyFilters(permissions: Permission[], params: PermissionQueryParams): Permission[] {
  let result = [...permissions]
  if (params.search && params.search.trim() !== '') {
    const term = params.search.trim().toLowerCase()
    result = result.filter((p) => p.name.toLowerCase().includes(term) || p.code.toLowerCase().includes(term))
  }
  if (params.status && params.status !== 'All') {
    result = result.filter((p) => p.status === params.status)
  }
  if (params.permissionCategory && params.permissionCategory !== 'All') {
    result = result.filter((p) => p.permissionCategory === params.permissionCategory)
  }
  if (params.module && params.module !== 'All') {
    result = result.filter((p) => p.module === params.module)
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

export async function fetchPermissions(params: PermissionQueryParams): Promise<PermissionListResponse> {
  const filtered = applyFilters(permissionStore, params)
  const page = params.page ?? 1
  const pageSize = params.pageSize ?? 5
  const start = (page - 1) * pageSize
  return simulateDelay({ data: filtered.slice(start, start + pageSize), total: filtered.length, page, pageSize })
}

export async function createPermission(input: CreatePermissionInput): Promise<Permission> {
  const codeExists = permissionStore.some((p) => p.code.toLowerCase() === input.code.toLowerCase())
  if (codeExists) throw new Error('Permission code already exists. Please choose a unique code.')
  const newPermission: Permission = {
    id: `p${Date.now()}`,
    ...input,
    createdAt: new Date().toISOString().slice(0, 10),
  }
  permissionStore = [newPermission, ...permissionStore]
  return simulateMutationDelay(newPermission)
}

export async function updatePermission(id: string, input: UpdatePermissionInput): Promise<Permission> {
  const index = permissionStore.findIndex((p) => p.id === id)
  if (index === -1) throw new Error('Permission not found')
  const codeTaken = permissionStore.some((p) => p.id !== id && p.code.toLowerCase() === input.code.toLowerCase())
  if (codeTaken) throw new Error('Permission code already exists. Please choose a unique code.')
  const updated: Permission = { ...permissionStore[index], ...input }
  permissionStore = permissionStore.map((p) => (p.id === id ? updated : p))
  return simulateMutationDelay(updated)
}

export async function activatePermission(id: string): Promise<Permission> {
  const index = permissionStore.findIndex((p) => p.id === id)
  if (index === -1) throw new Error('Permission not found')
  const updated: Permission = { ...permissionStore[index], status: 'Active' }
  permissionStore = permissionStore.map((p) => (p.id === id ? updated : p))
  return simulateMutationDelay(updated)
}

export async function deactivatePermission(id: string): Promise<Permission> {
  const index = permissionStore.findIndex((p) => p.id === id)
  if (index === -1) throw new Error('Permission not found')
  const updated: Permission = { ...permissionStore[index], status: 'Inactive' }
  permissionStore = permissionStore.map((p) => (p.id === id ? updated : p))
  return simulateMutationDelay(updated)
}
