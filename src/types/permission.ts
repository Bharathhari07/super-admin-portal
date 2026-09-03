export type PermissionStatus = 'Active' | 'Inactive'
export type PermissionCategory = 'Menu' | 'Function' | 'API' | 'Report' | 'Workflow'
export type PermissionType = 'View' | 'Create' | 'Update' | 'Delete' | 'Approve' | 'Export'
export type AccessLevel = 'Read Only' | 'Read & Write' | 'Full Control'
export type PermissionOrganizationScope = 'Company' | 'Business Unit' | 'Department' | 'Branch'

// Placeholder module list until a dedicated Module Registry screen exists.
// Mirrors the app's own top-level modules.
export const MODULE_OPTIONS = [
  'Global Dashboard',
  'Tenant Management',
  'Organization Management',
  'User Management',
  'Role Management',
  'Permission Management',
] as const
export type PlatformModule = (typeof MODULE_OPTIONS)[number]

export interface Permission {
  id: string
  code: string
  name: string
  permissionCategory: PermissionCategory
  module: PlatformModule
  status: PermissionStatus
  permissionType: PermissionType
  accessLevel: AccessLevel
  parentPermission: string | null
  isDefaultPermission: boolean
  effectiveDate: string
  expiryDate: string
  applicableRoleIds: string[]
  organizationScope: PermissionOrganizationScope
  description: string
  createdAt: string
}

export interface PermissionListResponse {
  data: Permission[]
  total: number
  page: number
  pageSize: number
}

export interface PermissionQueryParams {
  search?: string
  status?: PermissionStatus | 'All'
  permissionCategory?: PermissionCategory | 'All'
  module?: PlatformModule | 'All'
  sortBy?: 'name' | 'createdAt'
  sortDir?: 'asc' | 'desc'
  page?: number
  pageSize?: number
}

export interface CreatePermissionInput {
  code: string
  name: string
  permissionCategory: PermissionCategory
  module: PlatformModule
  status: PermissionStatus
  permissionType: PermissionType
  accessLevel: AccessLevel
  parentPermission: string | null
  isDefaultPermission: boolean
  effectiveDate: string
  expiryDate: string
  applicableRoleIds: string[]
  organizationScope: PermissionOrganizationScope
  description: string
}

export interface UpdatePermissionInput {
  code: string
  name: string
  permissionCategory: PermissionCategory
  module: PlatformModule
  permissionType: PermissionType
  accessLevel: AccessLevel
  parentPermission: string | null
  isDefaultPermission: boolean
  effectiveDate: string
  expiryDate: string
  applicableRoleIds: string[]
  organizationScope: PermissionOrganizationScope
  description: string
}

export const PERMISSION_CATEGORY_OPTIONS: PermissionCategory[] = ['Menu', 'Function', 'API', 'Report', 'Workflow']
export const PERMISSION_TYPE_OPTIONS: PermissionType[] = ['View', 'Create', 'Update', 'Delete', 'Approve', 'Export']
export const ACCESS_LEVEL_OPTIONS: AccessLevel[] = ['Read Only', 'Read & Write', 'Full Control']
export const PERMISSION_ORGANIZATION_SCOPE_OPTIONS: PermissionOrganizationScope[] = ['Company', 'Business Unit', 'Department', 'Branch']
