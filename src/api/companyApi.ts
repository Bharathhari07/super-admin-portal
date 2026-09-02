import { dummyCompanies } from '../data/dummyCompanies'
import { simulateDelay, simulateMutationDelay } from './mockClient'
import type {
  Company,
  CompanyListResponse,
  CompanyQueryParams,
  CreateCompanyInput,
  UpdateCompanyInput,
} from '../types/company'

let companyStore: Company[] = [...dummyCompanies]

function applyFilters(companies: Company[], params: CompanyQueryParams): Company[] {
  let result = [...companies]
  if (params.search && params.search.trim() !== '') {
    const term = params.search.trim().toLowerCase()
    result = result.filter(
      (c) => c.companyName.toLowerCase().includes(term) || c.companyCode.toLowerCase().includes(term),
    )
  }
  if (params.status && params.status !== 'All') {
    result = result.filter((c) => c.status === params.status)
  }
  if (params.legalEntityType && params.legalEntityType !== 'All') {
    result = result.filter((c) => c.legalEntityType === params.legalEntityType)
  }
  const sortBy = params.sortBy ?? 'createdAt'
  const sortDir = params.sortDir ?? 'desc'
  result.sort((a, b) => {
    let cmp = 0
    if (sortBy === 'companyName') cmp = a.companyName.localeCompare(b.companyName)
    else cmp = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
    return sortDir === 'asc' ? cmp : -cmp
  })
  return result
}

export async function fetchCompanies(params: CompanyQueryParams): Promise<CompanyListResponse> {
  const filtered = applyFilters(companyStore, params)
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

export async function fetchCompanyById(id: string): Promise<Company> {
  const company = companyStore.find((c) => c.id === id)
  if (!company) throw new Error('Company not found')
  return simulateDelay(company)
}

// BR-0121/0122/0124: Company Code and Business Registration Number
// must each be unique within the tenant.
export async function createCompany(input: CreateCompanyInput): Promise<Company> {
  const codeExists = companyStore.some((c) => c.companyCode.toLowerCase() === input.companyCode.toLowerCase())
  if (codeExists) throw new Error('Company code already exists. Please choose a unique code.')
  const regExists = companyStore.some(
    (c) => c.registrationNumber.toLowerCase() === input.registrationNumber.toLowerCase(),
  )
  if (regExists) throw new Error('Business registration number already exists.')

  const newCompany: Company = { id: `c${Date.now()}`, ...input, createdAt: new Date().toISOString().slice(0, 10) }
  companyStore = [newCompany, ...companyStore]
  return simulateMutationDelay(newCompany)
}

export async function updateCompany(id: string, input: UpdateCompanyInput): Promise<Company> {
  const index = companyStore.findIndex((c) => c.id === id)
  if (index === -1) throw new Error('Company not found')

  const codeTaken = companyStore.some(
    (c) => c.id !== id && c.companyCode.toLowerCase() === input.companyCode.toLowerCase(),
  )
  if (codeTaken) throw new Error('Company code already exists. Please choose a unique code.')

  const regTaken = companyStore.some(
    (c) => c.id !== id && c.registrationNumber.toLowerCase() === input.registrationNumber.toLowerCase(),
  )
  if (regTaken) throw new Error('Business registration number already exists.')

  const updated: Company = { ...companyStore[index], ...input }
  companyStore = companyStore.map((c) => (c.id === id ? updated : c))
  return simulateMutationDelay(updated)
}

export async function activateCompany(id: string): Promise<Company> {
  const index = companyStore.findIndex((c) => c.id === id)
  if (index === -1) throw new Error('Company not found')
  const updated: Company = { ...companyStore[index], status: 'Active' }
  companyStore = companyStore.map((c) => (c.id === id ? updated : c))
  return simulateMutationDelay(updated)
}

export async function deactivateCompany(id: string): Promise<Company> {
  const index = companyStore.findIndex((c) => c.id === id)
  if (index === -1) throw new Error('Company not found')
  const updated: Company = { ...companyStore[index], status: 'Inactive' }
  companyStore = companyStore.map((c) => (c.id === id ? updated : c))
  return simulateMutationDelay(updated)
}
