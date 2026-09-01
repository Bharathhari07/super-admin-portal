export type UserAccountStatus = 'Active' | 'Inactive' | 'Locked'
export type EmploymentType = 'Full-Time' | 'Part-Time' | 'Contract' | 'Intern'

// Placeholder role list until the Role Management module exists.
// Once built, Role selection here should pull from that module's
// role list instead of this fixed array.
export const ROLE_OPTIONS = ['Super Admin', 'Admin', 'HR Manager', 'Finance Manager', 'Employee', 'Viewer'] as const
export type UserRole = (typeof ROLE_OPTIONS)[number]

export interface PlatformUser {
  id: string
  firstName: string
  lastName: string
  employeeId: string
  email: string
  mobile: string
  companyId: string
  companyName: string
  businessUnitId: string
  businessUnitName: string
  departmentId: string
  departmentName: string
  branchId: string
  branchName: string
  designation: string
  reportingManager: string
  employmentType: EmploymentType
  joiningDate: string
  username: string
  role: UserRole
  status: UserAccountStatus
  createdAt: string
}

export interface UserListResponse {
  data: PlatformUser[]
  total: number
  page: number
  pageSize: number
}

export interface UserQueryParams {
  search?: string
  status?: UserAccountStatus | 'All'
  role?: UserRole | 'All'
  companyId?: string | 'All'
  sortBy?: 'firstName' | 'createdAt'
  sortDir?: 'asc' | 'desc'
  page?: number
  pageSize?: number
}

export interface CreateUserInput {
  firstName: string
  lastName: string
  employeeId: string
  email: string
  mobile: string
  companyId: string
  businessUnitId: string
  departmentId: string
  branchId: string
  designation: string
  reportingManager: string
  employmentType: EmploymentType
  joiningDate: string
  username: string
  role: UserRole
  status: UserAccountStatus
}

export interface UpdateUserInput {
  firstName: string
  lastName: string
  employeeId: string
  email: string
  mobile: string
  companyId: string
  businessUnitId: string
  departmentId: string
  branchId: string
  designation: string
  reportingManager: string
  employmentType: EmploymentType
  joiningDate: string
  username: string
  role: UserRole
}
