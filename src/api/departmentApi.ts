import { dummyDepartments } from '../data/dummyDepartments'
import { dummyBusinessUnits } from '../data/dummyBusinessUnits'
import { simulateDelay, simulateMutationDelay } from './mockClient'
import type {
  Department,
  DepartmentListResponse,
  DepartmentQueryParams,
  CreateDepartmentInput,
  UpdateDepartmentInput,
} from '../types/department'

let deptStore: Department[] = [...dummyDepartments]

function applyFilters(depts: Department[], params: DepartmentQueryParams): Department[] {
  let result = [...depts]
  if (params.search && params.search.trim() !== '') {
    const term = params.search.trim().toLowerCase()
    result = result.filter((d) => d.name.toLowerCase().includes(term) || d.code.toLowerCase().includes(term))
  }
  if (params.status && params.status !== 'All') {
    result = result.filter((d) => d.status === params.status)
  }
  if (params.businessUnitId && params.businessUnitId !== 'All') {
    result = result.filter((d) => d.businessUnitId === params.businessUnitId)
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

export async function fetchDepartments(params: DepartmentQueryParams): Promise<DepartmentListResponse> {
  const filtered = applyFilters(deptStore, params)
  const page = params.page ?? 1
  const pageSize = params.pageSize ?? 5
  const start = (page - 1) * pageSize
  return simulateDelay({ data: filtered.slice(start, start + pageSize), total: filtered.length, page, pageSize })
}

export async function createDepartment(input: CreateDepartmentInput): Promise<Department> {
  const codeExists = deptStore.some((d) => d.code.toLowerCase() === input.code.toLowerCase())
  if (codeExists) throw new Error('Department code already exists. Please choose a unique code.')
  const bu = dummyBusinessUnits.find((u) => u.id === input.businessUnitId)
  const newDept: Department = {
    id: `d${Date.now()}`,
    ...input,
    businessUnitName: bu ? bu.name : 'Unknown',
    createdAt: new Date().toISOString().slice(0, 10),
  }
  deptStore = [newDept, ...deptStore]
  return simulateMutationDelay(newDept)
}

export async function updateDepartment(id: string, input: UpdateDepartmentInput): Promise<Department> {
  const index = deptStore.findIndex((d) => d.id === id)
  if (index === -1) throw new Error('Department not found')
  const codeTaken = deptStore.some((d) => d.id !== id && d.code.toLowerCase() === input.code.toLowerCase())
  if (codeTaken) throw new Error('Department code already exists. Please choose a unique code.')
  const bu = dummyBusinessUnits.find((u) => u.id === input.businessUnitId)
  const updated: Department = { ...deptStore[index], ...input, businessUnitName: bu ? bu.name : 'Unknown' }
  deptStore = deptStore.map((d) => (d.id === id ? updated : d))
  return simulateMutationDelay(updated)
}

export async function activateDepartment(id: string): Promise<Department> {
  const index = deptStore.findIndex((d) => d.id === id)
  if (index === -1) throw new Error('Department not found')
  const updated: Department = { ...deptStore[index], status: 'Active' }
  deptStore = deptStore.map((d) => (d.id === id ? updated : d))
  return simulateMutationDelay(updated)
}

export async function deactivateDepartment(id: string): Promise<Department> {
  const index = deptStore.findIndex((d) => d.id === id)
  if (index === -1) throw new Error('Department not found')
  const updated: Department = { ...deptStore[index], status: 'Inactive' }
  deptStore = deptStore.map((d) => (d.id === id ? updated : d))
  return simulateMutationDelay(updated)
}
