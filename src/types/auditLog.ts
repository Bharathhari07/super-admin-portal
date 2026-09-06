export type AuditAction =
  | 'SECURITY_POLICY_UPDATE'
  | 'STATUS_CHANGE'
  | 'LOGIN'
  | 'LOGIN_SUCCESS'
  | 'LOGIN_FAILED'
  | 'CREATE'
  | 'UPDATE'
  | 'DELETE'
  | 'USER_CREATE'
  | 'USER_UPDATE'
  | 'USER_DELETE'
  | 'ROLE_ASSIGNED'
  | 'ROLE_UPDATE'
  | 'PERMISSION_CHANGED'
  | 'PASSWORD_RESET'
  | 'TENANT_ONBOARD'
  | 'TENANT_SUSPEND'
  | 'LICENSE_UPGRADE'
  | 'EXPORT'

export type AuditModule =
  | 'Security'
  | 'Tenants'
  | 'Tenant Management'
  | 'Roles'
  | 'Users'
  | 'User Management'
  | 'Access Control'
  | 'Platform Configuration'
  | 'Platform Settings'
  | 'Permissions'
  | 'Licenses'
  | 'License Management'
  | 'Organizations'
  | 'Organization'
  | 'Features'

export type AuditStatus = 'Success' | 'Failed' | 'Warning'

export const AUDIT_ACTION_OPTIONS: AuditAction[] = [
  'SECURITY_POLICY_UPDATE',
  'STATUS_CHANGE',
  'LOGIN',
  'CREATE',
  'UPDATE',
  'DELETE',
  'ROLE_ASSIGNED',
  'PERMISSION_CHANGED',
  'PASSWORD_RESET',
  'EXPORT',
]

export const AUDIT_MODULE_OPTIONS: AuditModule[] = [
  'Security',
  'Tenants',
  'Roles',
  'Users',
  'Platform Configuration',
  'Permissions',
  'Licenses',
  'Organizations',
  'Features',
]

export const AUDIT_STATUS_OPTIONS: AuditStatus[] = ['Success', 'Warning', 'Failed']

export interface AuditLogChange {
  field: string
  oldValue: string
  newValue: string
}

export interface AuditLog {
  id: string
  timestamp: string
  actorName: string
  actorEmail: string
  actorRole: string
  action: AuditAction
  module: AuditModule
  targetEntityId?: string
  targetEntityName?: string
  ipAddress: string
  userAgent: string
  location: string
  status: AuditStatus
  description: string
  changes?: AuditLogChange[]
}

export interface AuditLogQueryParams {
  search?: string
  action?: AuditAction | 'All'
  module?: AuditModule | 'All'
  status?: AuditStatus | 'All'
  sortBy?: 'timestamp' | 'actorName'
  sortDir?: 'asc' | 'desc'
  page?: number
  pageSize?: number
}

export interface AuditLogListResponse {
  data: AuditLog[]
  total: number
  page: number
  pageSize: number
}
