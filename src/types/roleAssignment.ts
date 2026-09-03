export type AssignmentStatus = 'Active' | 'Inactive'
export type AssignmentOrgScope = 'Company' | 'Business Unit' | 'Department' | 'Branch'

export interface RoleAssignment {
  id: string
  roleId: string
  roleName: string
  permissionId: string
  permissionName: string
  organizationScope: AssignmentOrgScope
  effectiveDate: string
  expiryDate: string
  status: AssignmentStatus
  createdAt: string
}

export interface RoleAssignmentListResponse {
  data: RoleAssignment[]
  total: number
  page: number
  pageSize: number
}

export interface RoleAssignmentQueryParams {
  search?: string
  status?: AssignmentStatus | 'All'
  roleId?: string | 'All'
  sortBy?: 'createdAt'
  sortDir?: 'asc' | 'desc'
  page?: number
  pageSize?: number
}

export interface CreateRoleAssignmentInput {
  roleId: string
  permissionId: string
  organizationScope: AssignmentOrgScope
  effectiveDate: string
  expiryDate: string
  status: AssignmentStatus
}

export interface UpdateRoleAssignmentInput {
  roleId: string
  permissionId: string
  organizationScope: AssignmentOrgScope
  effectiveDate: string
  expiryDate: string
}

export const ASSIGNMENT_ORG_SCOPE_OPTIONS: AssignmentOrgScope[] = ['Company', 'Business Unit', 'Department', 'Branch']
