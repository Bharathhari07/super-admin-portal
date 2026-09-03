import { dummyRoles } from '../data/dummyRoles'
import { simulateDelay, simulateMutationDelay } from './mockClient'
import type {
  Role,
  RoleListResponse,
  RoleQueryParams,
  CreateRoleInput,
  UpdateRoleInput,
} from '../types/role'

let roleStore: Role[] = [...dummyRoles]

function applyFilters(roles: Role[], params: RoleQueryParams): Role[] {
  let result = [...roles]
  if (params.search && params.search.trim() !== '') {
    const term = params.search.trim().toLowerCase()
    result = result.filter((r) => r.name.toLowerCase().includes(term) || r.code.toLowerCase().includes(term))
  }
  if (params.status && params.status !== 'All') {
    result = result.filter((r) => r.status === params.status)
  }
  if (params.roleCategory && params.roleCategory !== 'All') {
    result = result.filter((r) => r.roleCategory === params.roleCategory)
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

export async function fetchRoles(params: RoleQueryParams): Promise<RoleListResponse> {
  const filtered = applyFilters(roleStore, params)
  const page = params.page ?? 1
  const pageSize = params.pageSize ?? 5
  const start = (page - 1) * pageSize
  return simulateDelay({ data: filtered.slice(start, start + pageSize), total: filtered.length, page, pageSize })
}

export async function createRole(input: CreateRoleInput): Promise<Role> {
  const codeExists = roleStore.some((r) => r.code.toLowerCase() === input.code.toLowerCase())
  if (codeExists) throw new Error('Role code already exists. Please choose a unique code.')
  const newRole: Role = {
    id: `r${Date.now()}`,
    ...input,
    createdAt: new Date().toISOString().slice(0, 10),
  }
  roleStore = [newRole, ...roleStore]
  return simulateMutationDelay(newRole)
}

export async function updateRole(id: string, input: UpdateRoleInput): Promise<Role> {
  const index = roleStore.findIndex((r) => r.id === id)
  if (index === -1) throw new Error('Role not found')
  const codeTaken = roleStore.some((r) => r.id !== id && r.code.toLowerCase() === input.code.toLowerCase())
  if (codeTaken) throw new Error('Role code already exists. Please choose a unique code.')
  const updated: Role = { ...roleStore[index], ...input }
  roleStore = roleStore.map((r) => (r.id === id ? updated : r))
  return simulateMutationDelay(updated)
}

export async function activateRole(id: string): Promise<Role> {
  const index = roleStore.findIndex((r) => r.id === id)
  if (index === -1) throw new Error('Role not found')
  const updated: Role = { ...roleStore[index], status: 'Active' }
  roleStore = roleStore.map((r) => (r.id === id ? updated : r))
  return simulateMutationDelay(updated)
}

export async function deactivateRole(id: string): Promise<Role> {
  const index = roleStore.findIndex((r) => r.id === id)
  if (index === -1) throw new Error('Role not found')
  const updated: Role = { ...roleStore[index], status: 'Inactive' }
  roleStore = roleStore.map((r) => (r.id === id ? updated : r))
  return simulateMutationDelay(updated)
}
