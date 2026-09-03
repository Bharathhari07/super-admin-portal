export type DataPermissionStatus = 'Active' | 'Inactive'
export type AccessScope = 'Self' | 'Team' | 'Department' | 'Branch' | 'Business Unit' | 'Company'

export interface DataPermission {
  id: string
  name: string
  module: string
  roleId: string
  roleName: string
  status: DataPermissionStatus
  accessScope: AccessScope
  recordOwnership: boolean
  reportingHierarchy: boolean
  dataFilter: string
  effectiveDate: string
  expiryDate: string
  canView: boolean
  canCreate: boolean
  canUpdate: boolean
  canDelete: boolean
  canApprove: boolean
  canExport: boolean
  createdAt: string
}

export interface DataPermissionListResponse {
  data: DataPermission[]
  total: number
  page: number
  pageSize: number
}

export interface DataPermissionQueryParams {
  search?: string
  status?: DataPermissionStatus | 'All'
  roleId?: string | 'All'
  accessScope?: AccessScope | 'All'
  sortBy?: 'name' | 'createdAt'
  sortDir?: 'asc' | 'desc'
  page?: number
  pageSize?: number
}

export interface CreateDataPermissionInput {
  name: string
  module: string
  roleId: string
  status: DataPermissionStatus
  accessScope: AccessScope
  recordOwnership: boolean
  reportingHierarchy: boolean
  dataFilter: string
  effectiveDate: string
  expiryDate: string
  canView: boolean
  canCreate: boolean
  canUpdate: boolean
  canDelete: boolean
  canApprove: boolean
  canExport: boolean
}

export interface UpdateDataPermissionInput {
  name: string
  module: string
  roleId: string
  accessScope: AccessScope
  recordOwnership: boolean
  reportingHierarchy: boolean
  dataFilter: string
  effectiveDate: string
  expiryDate: string
  canView: boolean
  canCreate: boolean
  canUpdate: boolean
  canDelete: boolean
  canApprove: boolean
  canExport: boolean
}

export const ACCESS_SCOPE_OPTIONS: AccessScope[] = ['Self', 'Team', 'Department', 'Branch', 'Business Unit', 'Company']
export const MODULE_OPTIONS = [
  'Global Dashboard',
  'Tenant Management',
  'Organization Management',
  'User Management',
  'Role Management',
  'Permission Management',
] as const
