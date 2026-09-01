import { dummyUsers } from '../data/dummyUsers'
import { dummyCompanies } from '../data/dummyCompanies'
import { dummyBusinessUnits } from '../data/dummyBusinessUnits'
import { dummyDepartments } from '../data/dummyDepartments'
import { dummyBranches } from '../data/dummyBranches'
import { simulateDelay, simulateMutationDelay } from './mockClient'
import type {
  PlatformUser,
  UserListResponse,
  UserQueryParams,
  CreateUserInput,
  UpdateUserInput,
} from '../types/user'

let userStore: PlatformUser[] = [...dummyUsers]

function applyFilters(users: PlatformUser[], params: UserQueryParams): PlatformUser[] {
  let result = [...users]
  if (params.search && params.search.trim() !== '') {
    const term = params.search.trim().toLowerCase()
    result = result.filter(
      (u) =>
        `${u.firstName} ${u.lastName}`.toLowerCase().includes(term) ||
        u.employeeId.toLowerCase().includes(term) ||
        u.email.toLowerCase().includes(term),
    )
  }
  if (params.status && params.status !== 'All') {
    result = result.filter((u) => u.status === params.status)
  }
  if (params.role && params.role !== 'All') {
    result = result.filter((u) => u.role === params.role)
  }
  if (params.companyId && params.companyId !== 'All') {
    result = result.filter((u) => u.companyId === params.companyId)
  }
  const sortBy = params.sortBy ?? 'createdAt'
  const sortDir = params.sortDir ?? 'desc'
  result.sort((a, b) => {
    let cmp = 0
    if (sortBy === 'firstName') cmp = a.firstName.localeCompare(b.firstName)
    else cmp = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
    return sortDir === 'asc' ? cmp : -cmp
  })
  return result
}

function resolveOrgNames(companyId: string, businessUnitId: string, departmentId: string, branchId: string) {
  const company = dummyCompanies.find((c) => c.id === companyId)
  const bu = dummyBusinessUnits.find((u) => u.id === businessUnitId)
  const dept = dummyDepartments.find((d) => d.id === departmentId)
  const branch = dummyBranches.find((b) => b.id === branchId)
  return {
    companyName: company ? company.companyName : 'Unknown',
    businessUnitName: bu ? bu.name : 'Unknown',
    departmentName: dept ? dept.name : 'Unknown',
    branchName: branch ? branch.name : 'Unknown',
  }
}

export async function fetchUsers(params: UserQueryParams): Promise<UserListResponse> {
  const filtered = applyFilters(userStore, params)
  const page = params.page ?? 1
  const pageSize = params.pageSize ?? 5
  const start = (page - 1) * pageSize
  return simulateDelay({ data: filtered.slice(start, start + pageSize), total: filtered.length, page, pageSize })
}

export async function createUser(input: CreateUserInput): Promise<PlatformUser> {
  const usernameTaken = userStore.some((u) => u.username.toLowerCase() === input.username.toLowerCase())
  if (usernameTaken) throw new Error('Username already exists. Please choose a unique username.')
  const employeeIdTaken = userStore.some((u) => u.employeeId.toLowerCase() === input.employeeId.toLowerCase())
  if (employeeIdTaken) throw new Error('Employee ID already exists. Please use a unique employee ID.')
  const emailTaken = userStore.some((u) => u.email.toLowerCase() === input.email.toLowerCase())
  if (emailTaken) throw new Error('Email address already exists.')

  const names = resolveOrgNames(input.companyId, input.businessUnitId, input.departmentId, input.branchId)
  const newUser: PlatformUser = {
    id: `u${Date.now()}`,
    ...input,
    ...names,
    createdAt: new Date().toISOString().slice(0, 10),
  }
  userStore = [newUser, ...userStore]
  return simulateMutationDelay(newUser)
}

export async function updateUser(id: string, input: UpdateUserInput): Promise<PlatformUser> {
  const index = userStore.findIndex((u) => u.id === id)
  if (index === -1) throw new Error('User not found')

  const usernameTaken = userStore.some((u) => u.id !== id && u.username.toLowerCase() === input.username.toLowerCase())
  if (usernameTaken) throw new Error('Username already exists. Please choose a unique username.')

  const employeeIdTaken = userStore.some((u) => u.id !== id && u.employeeId.toLowerCase() === input.employeeId.toLowerCase())
  if (employeeIdTaken) throw new Error('Employee ID already exists. Please use a unique employee ID.')

  const emailTaken = userStore.some((u) => u.id !== id && u.email.toLowerCase() === input.email.toLowerCase())
  if (emailTaken) throw new Error('Email address already exists.')

  const names = resolveOrgNames(input.companyId, input.businessUnitId, input.departmentId, input.branchId)
  const updated: PlatformUser = { ...userStore[index], ...input, ...names }
  userStore = userStore.map((u) => (u.id === id ? updated : u))
  return simulateMutationDelay(updated)
}

export async function activateUser(id: string): Promise<PlatformUser> {
  const index = userStore.findIndex((u) => u.id === id)
  if (index === -1) throw new Error('User not found')
  const updated: PlatformUser = { ...userStore[index], status: 'Active' }
  userStore = userStore.map((u) => (u.id === id ? updated : u))
  return simulateMutationDelay(updated)
}

export async function deactivateUser(id: string): Promise<PlatformUser> {
  const index = userStore.findIndex((u) => u.id === id)
  if (index === -1) throw new Error('User not found')
  const updated: PlatformUser = { ...userStore[index], status: 'Inactive' }
  userStore = userStore.map((u) => (u.id === id ? updated : u))
  return simulateMutationDelay(updated)
}

export async function toggleUserLock(id: string): Promise<PlatformUser> {
  const index = userStore.findIndex((u) => u.id === id)
  if (index === -1) throw new Error('User not found')
  const nextStatus = userStore[index].status === 'Locked' ? 'Active' : 'Locked'
  const updated: PlatformUser = { ...userStore[index], status: nextStatus }
  userStore = userStore.map((u) => (u.id === id ? updated : u))
  return simulateMutationDelay(updated)
}

// Simulates a password-reset email being triggered - no actual
// credential is generated or transmitted, this is a mocked endpoint.
export async function resetUserPassword(id: string): Promise<{ id: string; resetSentAt: string }> {
  const user = userStore.find((u) => u.id === id)
  if (!user) throw new Error('User not found')
  return simulateMutationDelay({ id, resetSentAt: new Date().toISOString() })
}
