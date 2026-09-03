import type { RoleAssignment } from '../types/roleAssignment'

export const dummyRoleAssignments: RoleAssignment[] = [
  { id: 'ra1', roleId: 'r1', roleName: 'Super Admin', permissionId: 'p1', permissionName: 'View Tenants', organizationScope: 'Company', effectiveDate: '2026-07-01', expiryDate: '', status: 'Active', createdAt: '2026-07-01' },
  { id: 'ra2', roleId: 'r1', roleName: 'Super Admin', permissionId: 'p3', permissionName: 'Manage Companies', organizationScope: 'Company', effectiveDate: '2026-07-01', expiryDate: '', status: 'Active', createdAt: '2026-07-01' },
  { id: 'ra3', roleId: 'r2', roleName: 'Tenant Admin', permissionId: 'p2', permissionName: 'Create Tenant', organizationScope: 'Company', effectiveDate: '2026-07-02', expiryDate: '', status: 'Active', createdAt: '2026-07-02' },
  { id: 'ra4', roleId: 'r3', roleName: 'HR Manager', permissionId: 'p5', permissionName: 'Register Users', organizationScope: 'Department', effectiveDate: '2026-07-06', expiryDate: '', status: 'Active', createdAt: '2026-07-06' },
  { id: 'ra5', roleId: 'r3', roleName: 'HR Manager', permissionId: 'p6', permissionName: 'Reset User Password', organizationScope: 'Department', effectiveDate: '2026-07-06', expiryDate: '', status: 'Active', createdAt: '2026-07-06' },
  { id: 'ra6', roleId: 'r4', roleName: 'Finance Manager', permissionId: 'p7', permissionName: 'Approve Budget Requests', organizationScope: 'Department', effectiveDate: '2026-07-08', expiryDate: '', status: 'Active', createdAt: '2026-07-08' },
  { id: 'ra7', roleId: 'r5', roleName: 'Department Head', permissionId: 'p4', permissionName: 'View Departments', organizationScope: 'Department', effectiveDate: '2026-07-08', expiryDate: '', status: 'Active', createdAt: '2026-07-08' },
  { id: 'ra8', roleId: 'r6', roleName: 'Employee', permissionId: 'p8', permissionName: 'View Global Dashboard', organizationScope: 'Branch', effectiveDate: '2026-07-01', expiryDate: '', status: 'Active', createdAt: '2026-07-01' },
  { id: 'ra9', roleId: 'r7', roleName: 'Viewer', permissionId: 'p8', permissionName: 'View Global Dashboard', organizationScope: 'Branch', effectiveDate: '2026-07-01', expiryDate: '', status: 'Active', createdAt: '2026-07-01' },
  { id: 'ra10', roleId: 'r1', roleName: 'Super Admin', permissionId: 'p10', permissionName: 'Manage Roles', organizationScope: 'Company', effectiveDate: '2026-07-01', expiryDate: '', status: 'Active', createdAt: '2026-07-01' },
  { id: 'ra11', roleId: 'r1', roleName: 'Super Admin', permissionId: 'p11', permissionName: 'Delete Records', organizationScope: 'Company', effectiveDate: '2026-06-15', expiryDate: '2026-12-31', status: 'Inactive', createdAt: '2026-06-15' },
  { id: 'ra12', roleId: 'r2', roleName: 'Tenant Admin', permissionId: 'p12', permissionName: 'View Permissions', organizationScope: 'Company', effectiveDate: '2026-07-01', expiryDate: '', status: 'Active', createdAt: '2026-07-01' },
]
