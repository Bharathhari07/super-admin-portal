export type TenantStatus = 'Draft' | 'Active' | 'Suspended' | 'Inactive'
export type TenantPlan = 'Basic' | 'Pro' | 'Enterprise'
export type OrganizationType = 'Enterprise' | 'SME' | 'Startup' | 'Government' | 'Non-Profit'

export interface Tenant {
  id: string
  name: string
  legalBusinessName: string
  code: string
  businessRegistrationNumber: string
  organizationType: OrganizationType
  adminName: string
  adminEmail: string
  phone: string
  telephone: string
  website: string
  addressLine1: string
  addressLine2: string
  city: string
  state: string
  country: string
  postalCode: string
  timeZone: string
  plan: TenantPlan
  users: number
  status: TenantStatus
  createdAt: string
}

export interface TenantStats {
  tenantId: string
  users: number
  organizations: number
  activeUsers: number
  storageUsedPercent: number
}

export interface TenantListResponse {
  data: Tenant[]
  total: number
  page: number
  pageSize: number
}

export interface TenantQueryParams {
  search?: string
  status?: TenantStatus | 'All'
  plan?: TenantPlan | 'All'
  sortBy?: 'name' | 'createdAt' | 'users'
  sortDir?: 'asc' | 'desc'
  page?: number
  pageSize?: number
}

export interface CreateTenantInput {
  name: string
  legalBusinessName: string
  code: string
  businessRegistrationNumber: string
  organizationType: OrganizationType
  adminName: string
  adminEmail: string
  phone: string
  telephone: string
  website: string
  addressLine1: string
  addressLine2: string
  city: string
  state: string
  country: string
  postalCode: string
  timeZone: string
  plan: TenantPlan
  status: TenantStatus
}

export interface UpdateTenantInput {
  name: string
  legalBusinessName: string
  code: string
  businessRegistrationNumber: string
  organizationType: OrganizationType
  adminName: string
  adminEmail: string
  phone: string
  telephone: string
  website: string
  addressLine1: string
  addressLine2: string
  city: string
  state: string
  country: string
  postalCode: string
  timeZone: string
  plan: TenantPlan
}

export const ORGANIZATION_TYPE_OPTIONS: OrganizationType[] = ['Enterprise', 'SME', 'Startup', 'Government', 'Non-Profit']
export const COUNTRY_OPTIONS = ['India', 'United States', 'United Kingdom', 'Australia', 'Singapore'] as const
export const TIME_ZONE_OPTIONS = [
  'Asia/Kolkata',
  'America/New_York',
  'Europe/London',
  'Australia/Sydney',
  'Asia/Singapore',
] as const
