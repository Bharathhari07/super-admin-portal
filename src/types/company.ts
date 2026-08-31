export type CompanyStatus = 'Active' | 'Inactive'
export type BusinessType =
  | 'Private Limited'
  | 'Public Limited'
  | 'LLP'
  | 'Partnership'
  | 'Sole Proprietorship'
  | 'Government'
  | 'Non-Profit'
  | 'Other'
export type Industry =
  | 'IT & Software'
  | 'Manufacturing'
  | 'Healthcare'
  | 'Finance & Banking'
  | 'Retail'
  | 'Education'
  | 'Real Estate'
  | 'Logistics'
  | 'Telecommunications'
  | 'Other'

export interface Company {
  id: string
  companyName: string
  legalCompanyName: string
  companyCode: string
  registrationNumber: string
  taxId: string
  businessType: BusinessType
  industry: Industry
  website: string
  email: string
  mobile: string
  telephone: string
  country: string
  state: string
  city: string
  postalCode: string
  address: string
  logoUrl: string | null
  status: CompanyStatus
  createdAt: string
}

export interface CompanyListResponse {
  data: Company[]
  total: number
  page: number
  pageSize: number
}

export interface CompanyQueryParams {
  search?: string
  status?: CompanyStatus | 'All'
  businessType?: BusinessType | 'All'
  sortBy?: 'companyName' | 'createdAt'
  sortDir?: 'asc' | 'desc'
  page?: number
  pageSize?: number
}

export interface CreateCompanyInput {
  companyName: string
  legalCompanyName: string
  companyCode: string
  registrationNumber: string
  taxId: string
  businessType: BusinessType
  industry: Industry
  website: string
  email: string
  mobile: string
  telephone: string
  country: string
  state: string
  city: string
  postalCode: string
  address: string
  logoUrl: string | null
  status: CompanyStatus
}

export interface UpdateCompanyInput {
  companyName: string
  legalCompanyName: string
  companyCode: string
  registrationNumber: string
  taxId: string
  businessType: BusinessType
  industry: Industry
  website: string
  email: string
  mobile: string
  telephone: string
  country: string
  state: string
  city: string
  postalCode: string
  address: string
  logoUrl: string | null
}

export const BUSINESS_TYPE_OPTIONS: BusinessType[] = [
  'Private Limited',
  'Public Limited',
  'LLP',
  'Partnership',
  'Sole Proprietorship',
  'Government',
  'Non-Profit',
  'Other',
]

export const INDUSTRY_OPTIONS: Industry[] = [
  'IT & Software',
  'Manufacturing',
  'Healthcare',
  'Finance & Banking',
  'Retail',
  'Education',
  'Real Estate',
  'Logistics',
  'Telecommunications',
  'Other',
]
