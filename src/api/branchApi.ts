import { dummyBranches } from '../data/dummyBranches'
import { dummyBusinessUnits } from '../data/dummyBusinessUnits'
import { simulateDelay, simulateMutationDelay } from './mockClient'
import type {
  Branch,
  BranchListResponse,
  BranchQueryParams,
  CreateBranchInput,
  UpdateBranchInput,
} from '../types/branch'

let branchStore: Branch[] = [...dummyBranches]

function applyFilters(branches: Branch[], params: BranchQueryParams): Branch[] {
  let result = [...branches]
  if (params.search && params.search.trim() !== '') {
    const term = params.search.trim().toLowerCase()
    result = result.filter((b) => b.name.toLowerCase().includes(term) || b.code.toLowerCase().includes(term))
  }
  if (params.status && params.status !== 'All') {
    result = result.filter((b) => b.status === params.status)
  }
  if (params.businessUnitId && params.businessUnitId !== 'All') {
    result = result.filter((b) => b.businessUnitId === params.businessUnitId)
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

export async function fetchBranches(params: BranchQueryParams): Promise<BranchListResponse> {
  const filtered = applyFilters(branchStore, params)
  const page = params.page ?? 1
  const pageSize = params.pageSize ?? 5
  const start = (page - 1) * pageSize
  return simulateDelay({ data: filtered.slice(start, start + pageSize), total: filtered.length, page, pageSize })
}

export async function createBranch(input: CreateBranchInput): Promise<Branch> {
  const codeExists = branchStore.some((b) => b.code.toLowerCase() === input.code.toLowerCase())
  if (codeExists) throw new Error('Branch code already exists. Please choose a unique code.')
  const bu = dummyBusinessUnits.find((u) => u.id === input.businessUnitId)
  const newBranch: Branch = {
    id: `br${Date.now()}`,
    ...input,
    businessUnitName: bu ? bu.name : 'Unknown',
    createdAt: new Date().toISOString().slice(0, 10),
  }
  branchStore = [newBranch, ...branchStore]
  return simulateMutationDelay(newBranch)
}

export async function updateBranch(id: string, input: UpdateBranchInput): Promise<Branch> {
  const index = branchStore.findIndex((b) => b.id === id)
  if (index === -1) throw new Error('Branch not found')
  const codeTaken = branchStore.some((b) => b.id !== id && b.code.toLowerCase() === input.code.toLowerCase())
  if (codeTaken) throw new Error('Branch code already exists. Please choose a unique code.')
  const bu = dummyBusinessUnits.find((u) => u.id === input.businessUnitId)
  const updated: Branch = { ...branchStore[index], ...input, businessUnitName: bu ? bu.name : 'Unknown' }
  branchStore = branchStore.map((b) => (b.id === id ? updated : b))
  return simulateMutationDelay(updated)
}

export async function activateBranch(id: string): Promise<Branch> {
  const index = branchStore.findIndex((b) => b.id === id)
  if (index === -1) throw new Error('Branch not found')
  const updated: Branch = { ...branchStore[index], status: 'Active' }
  branchStore = branchStore.map((b) => (b.id === id ? updated : b))
  return simulateMutationDelay(updated)
}

export async function deactivateBranch(id: string): Promise<Branch> {
  const index = branchStore.findIndex((b) => b.id === id)
  if (index === -1) throw new Error('Branch not found')
  const updated: Branch = { ...branchStore[index], status: 'Inactive' }
  branchStore = branchStore.map((b) => (b.id === id ? updated : b))
  return simulateMutationDelay(updated)
}
