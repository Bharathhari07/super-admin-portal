import { dummyRoleAssignments } from '../data/dummyRoleAssignments'
import { dummyRoles } from '../data/dummyRoles'
import { dummyPermissions } from '../data/dummyPermissions'
import { simulateDelay, simulateMutationDelay } from './mockClient'
import type {
  RoleAssignment,
  RoleAssignmentListResponse,
  RoleAssignmentQueryParams,
  CreateRoleAssignmentInput,
  UpdateRoleAssignmentInput,
} from '../types/roleAssignment'

let assignmentStore: RoleAssignment[] = [...dummyRoleAssignments]

function applyFilters(assignments: RoleAssignment[], params: RoleAssignmentQueryParams): RoleAssignment[] {
  let result = [...assignments]
  if (params.search && params.search.trim() !== '') {
    const term = params.search.trim().toLowerCase()
    result = result.filter(
      (a) => a.roleName.toLowerCase().includes(term) || a.permissionName.toLowerCase().includes(term),
    )
  }
  if (params.status && params.status !== 'All') {
    result = result.filter((a) => a.status === params.status)
  }
  if (params.roleId && params.roleId !== 'All') {
    result = result.filter((a) => a.roleId === params.roleId)
  }
  result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
  return result
}

export async function fetchRoleAssignments(params: RoleAssignmentQueryParams): Promise<RoleAssignmentListResponse> {
  const filtered = applyFilters(assignmentStore, params)
  const page = params.page ?? 1
  const pageSize = params.pageSize ?? 5
  const start = (page - 1) * pageSize
  return simulateDelay({ data: filtered.slice(start, start + pageSize), total: filtered.length, page, pageSize })
}

function resolveNames(roleId: string, permissionId: string) {
  const role = dummyRoles.find((r) => r.id === roleId)
  const permission = dummyPermissions.find((p) => p.id === permissionId)
  return {
    roleName: role ? role.name : 'Unknown',
    permissionName: permission ? permission.name : 'Unknown',
  }
}

export async function createRoleAssignment(input: CreateRoleAssignmentInput): Promise<RoleAssignment> {
  const duplicate = assignmentStore.some((a) => a.roleId === input.roleId && a.permissionId === input.permissionId)
  if (duplicate) throw new Error('This role already has this permission assigned.')
  const names = resolveNames(input.roleId, input.permissionId)
  const newAssignment: RoleAssignment = {
    id: `ra${Date.now()}`,
    ...input,
    ...names,
    createdAt: new Date().toISOString().slice(0, 10),
  }
  assignmentStore = [newAssignment, ...assignmentStore]
  return simulateMutationDelay(newAssignment)
}

export async function updateRoleAssignment(id: string, input: UpdateRoleAssignmentInput): Promise<RoleAssignment> {
  const index = assignmentStore.findIndex((a) => a.id === id)
  if (index === -1) throw new Error('Assignment not found')
  const names = resolveNames(input.roleId, input.permissionId)
  const updated: RoleAssignment = { ...assignmentStore[index], ...input, ...names }
  assignmentStore = assignmentStore.map((a) => (a.id === id ? updated : a))
  return simulateMutationDelay(updated)
}

export async function activateRoleAssignment(id: string): Promise<RoleAssignment> {
  const index = assignmentStore.findIndex((a) => a.id === id)
  if (index === -1) throw new Error('Assignment not found')
  const updated: RoleAssignment = { ...assignmentStore[index], status: 'Active' }
  assignmentStore = assignmentStore.map((a) => (a.id === id ? updated : a))
  return simulateMutationDelay(updated)
}

export async function deactivateRoleAssignment(id: string): Promise<RoleAssignment> {
  const index = assignmentStore.findIndex((a) => a.id === id)
  if (index === -1) throw new Error('Assignment not found')
  const updated: RoleAssignment = { ...assignmentStore[index], status: 'Inactive' }
  assignmentStore = assignmentStore.map((a) => (a.id === id ? updated : a))
  return simulateMutationDelay(updated)
}
