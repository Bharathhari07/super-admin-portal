export type CompanyStatus = 'Draft' | 'Active' | 'Inactive'

export type CompanyType = 'Parent Company' | 'Subsidiary' | 'Branch Office' | 'Holding Company' | 'Standalone'

export type LegalEntityType =
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
  companyType: CompanyType
  industry: Industry
  status: CompanyStatus

  registrationNumber: string
  gstVatNumber: string
  taxId: string
  incorporationDate: string
  registrationCountry: string
  legalEntityType: LegalEntityType

  primaryContactPerson: string
  email: string
  mobile: string
  telephone: string
  website: string

  addressLine1: string
  addressLine2: string
  city: string
  state: string
  country: string
  postalCode: string

  defaultCurrency: string
  financialYear: string
  timeZone: string
  defaultLanguage: string
  workingCalendar: string
  logoUrl: string

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
  legalEntityType?: LegalEntityType | 'All'
  sortBy?: 'companyName' | 'createdAt'
  sortDir?: 'asc' | 'desc'
  page?: number
  pageSize?: number
}

export interface CreateCompanyInput {
  companyName: string
  legalCompanyName: string
  companyCode: string
  companyType: CompanyType
  industry: Industry
  status: CompanyStatus
  registrationNumber: string
  gstVatNumber: string
  taxId: string
  incorporationDate: string
  registrationCountry: string
  legalEntityType: LegalEntityType
  primaryContactPerson: string
  email: string
  mobile: string
  telephone: string
  website: string
  addressLine1: string
  addressLine2: string
  city: string
  state: string
  country: string
  postalCode: string
  defaultCurrency: string
  financialYear: string
  timeZone: string
  defaultLanguage: string
  workingCalendar: string
  logoUrl: string
}

export interface UpdateCompanyInput {
  companyName: string
  legalCompanyName: string
  companyCode: string
  companyType: CompanyType
  industry: Industry
  registrationNumber: string
  gstVatNumber: string
  taxId: string
  incorporationDate: string
  registrationCountry: string
  legalEntityType: LegalEntityType
  primaryContactPerson: string
  email: string
  mobile: string
  telephone: string
  website: string
  addressLine1: string
  addressLine2: string
  city: string
  state: string
  country: string
  postalCode: string
  defaultCurrency: string
  financialYear: string
  timeZone: string
  defaultLanguage: string
  workingCalendar: string
  logoUrl: string
}

export const COMPANY_TYPE_OPTIONS: CompanyType[] = [
  'Parent Company',
  'Subsidiary',
  'Branch Office',
  'Holding Company',
  'Standalone',
]

export const LEGAL_ENTITY_TYPE_OPTIONS: LegalEntityType[] = [
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

export const CURRENCY_OPTIONS = ['INR', 'USD', 'GBP', 'EUR', 'AUD', 'SGD'] as const
export const FINANCIAL_YEAR_OPTIONS = ['Jan - Dec', 'Apr - Mar', 'Jul - Jun', 'Oct - Sep'] as const
export const LANGUAGE_OPTIONS = ['English', 'Hindi', 'Spanish', 'French', 'German', 'Mandarin'] as const
export const WORKING_CALENDAR_OPTIONS = ['Standard 5-Day', '6-Day Working', '24x7 Operations'] as const
export const TIME_ZONE_OPTIONS = [
  'Asia/Kolkata',
  'America/New_York',
  'Europe/London',
  'Australia/Sydney',
  'Asia/Singapore',
] as const
