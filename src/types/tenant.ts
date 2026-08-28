export type TenantStatus = 'Active' | 'Inactive'
export type TenantPlan = 'Basic' | 'Pro' | 'Enterprise'

export interface Tenant {
  id: string
  name: string
  code: string
  adminName: string
  adminEmail: string
  phone: string
  country: string
  timeZone: string
  plan: TenantPlan
  users: number
  status: TenantStatus
  createdAt: string // ISO date string
}

export interface TenantStats {
  tenantId: string
  users: number
  organizations: number
  activeUsers: number
  storageUsedPercent: number
}

// Shape returned by GET /api/tenants (paginated list)
export interface TenantListResponse {
  data: Tenant[]
  total: number
  page: number
  pageSize: number
}

// Query params sent to GET /api/tenants
export interface TenantQueryParams {
  search?: string
  status?: TenantStatus | 'All'
  plan?: TenantPlan | 'All'
  sortBy?: 'name' | 'createdAt' | 'users'
  sortDir?: 'asc' | 'desc'
  page?: number
  pageSize?: number
}

// Body for POST /api/tenants
export interface CreateTenantInput {
  name: string
  code: string
  adminName: string
  adminEmail: string
  phone: string
  plan: TenantPlan
  country: string
  timeZone: string
  status: TenantStatus
}

// Body for PUT /api/tenants/:id
export interface UpdateTenantInput {
  name: string
  code: string
  adminName: string
  adminEmail: string
  phone: string
  plan: TenantPlan
  country: string
  timeZone: string
}

// Common option lists used by Create/Edit tenant forms
export const COUNTRY_OPTIONS = ['India', 'United States', 'United Kingdom', 'Australia', 'Singapore'] as const
export const TIME_ZONE_OPTIONS = [
  'Asia/Kolkata',
  'America/New_York',
  'Europe/London',
  'Australia/Sydney',
  'Asia/Singapore',
] as const