export type RoleStatus = 'Active' | 'Inactive'
export type RoleCategory = 'System' | 'Business' | 'Administrative' | 'Custom'
export type RoleType = 'System Role' | 'Custom Role'
export type OrganizationScope = 'Company' | 'Business Unit' | 'Department' | 'Branch'
export type ApplicableUserType = 'Employee' | 'Customer' | 'Vendor' | 'Partner' | 'Admin'

export interface Role {
  id: string
  code: string
  name: string
  roleCategory: RoleCategory
  parentRole: string | null
  status: RoleStatus
  roleType: RoleType
  isDefaultRole: boolean
  isAssignable: boolean
  priorityLevel: string
  effectiveDate: string
  expiryDate: string
  applicableUserTypes: ApplicableUserType[]
  organizationScope: OrganizationScope
  maximumUsers: string
  description: string
  createdAt: string
}

export interface RoleListResponse {
  data: Role[]
  total: number
  page: number
  pageSize: number
}

export interface RoleQueryParams {
  search?: string
  status?: RoleStatus | 'All'
  roleCategory?: RoleCategory | 'All'
  sortBy?: 'name' | 'createdAt'
  sortDir?: 'asc' | 'desc'
  page?: number
  pageSize?: number
}

export interface CreateRoleInput {
  code: string
  name: string
  roleCategory: RoleCategory
  parentRole: string | null
  status: RoleStatus
  roleType: RoleType
  isDefaultRole: boolean
  isAssignable: boolean
  priorityLevel: string
  effectiveDate: string
  expiryDate: string
  applicableUserTypes: ApplicableUserType[]
  organizationScope: OrganizationScope
  maximumUsers: string
  description: string
}

export interface UpdateRoleInput {
  code: string
  name: string
  roleCategory: RoleCategory
  parentRole: string | null
  roleType: RoleType
  isDefaultRole: boolean
  isAssignable: boolean
  priorityLevel: string
  effectiveDate: string
  expiryDate: string
  applicableUserTypes: ApplicableUserType[]
  organizationScope: OrganizationScope
  maximumUsers: string
  description: string
}

export const ROLE_CATEGORY_OPTIONS: RoleCategory[] = ['System', 'Business', 'Administrative', 'Custom']
export const ROLE_TYPE_OPTIONS: RoleType[] = ['System Role', 'Custom Role']
export const ORGANIZATION_SCOPE_OPTIONS: OrganizationScope[] = ['Company', 'Business Unit', 'Department', 'Branch']
export const APPLICABLE_USER_TYPE_OPTIONS: ApplicableUserType[] = ['Employee', 'Customer', 'Vendor', 'Partner', 'Admin']
