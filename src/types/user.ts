export type UserAccountStatus = 'Pending Activation' | 'Active' | 'Inactive' | 'Locked'
export type Gender = 'Male' | 'Female' | 'Other' | 'Prefer not to say'
export type AuthenticationMethod = 'Password' | 'SSO' | 'MFA'
export type EmploymentType = 'Full-Time' | 'Part-Time' | 'Contract' | 'Intern'

// Placeholder role list until the Role Management module exists.
// Once built, Role selection here should pull from that module's
// role list instead of this fixed array.
export const ROLE_OPTIONS = ['Super Admin', 'Admin', 'HR Manager', 'Finance Manager', 'Employee', 'Viewer'] as const
export type UserRole = (typeof ROLE_OPTIONS)[number]

export interface PlatformUser {
  id: string
  employeeId: string
  firstName: string
  middleName: string
  lastName: string
  gender: Gender
  dateOfBirth: string
  email: string
  mobile: string
  alternateMobile: string
  alternateEmail: string
  username: string
  temporaryPassword: string
  authenticationMethod: AuthenticationMethod
  companyId: string
  companyName: string
  businessUnitId: string
  businessUnitName: string
  departmentId: string
  departmentName: string
  branchId: string
  branchName: string
  locationId: string
  locationName: string
  reportingManager: string
  designation: string
  employmentType: EmploymentType
  joiningDate: string
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
  employeeId: string
  firstName: string
  middleName: string
  lastName: string
  gender: Gender
  dateOfBirth: string
  email: string
  mobile: string
  alternateMobile: string
  alternateEmail: string
  username: string
  temporaryPassword: string
  authenticationMethod: AuthenticationMethod
  companyId: string
  businessUnitId: string
  departmentId: string
  branchId: string
  locationId: string
  reportingManager: string
  designation: string
  employmentType: EmploymentType
  joiningDate: string
  role: UserRole
  status: UserAccountStatus
}

export interface UpdateUserInput {
  employeeId: string
  firstName: string
  middleName: string
  lastName: string
  gender: Gender
  dateOfBirth: string
  email: string
  mobile: string
  alternateMobile: string
  alternateEmail: string
  username: string
  authenticationMethod: AuthenticationMethod
  companyId: string
  businessUnitId: string
  departmentId: string
  branchId: string
  locationId: string
  reportingManager: string
  designation: string
  employmentType: EmploymentType
  joiningDate: string
  role: UserRole
}

export const GENDER_OPTIONS: Gender[] = ['Male', 'Female', 'Other', 'Prefer not to say']
export const AUTHENTICATION_METHOD_OPTIONS: AuthenticationMethod[] = ['Password', 'SSO', 'MFA']
export const EMPLOYMENT_TYPE_OPTIONS: EmploymentType[] = ['Full-Time', 'Part-Time', 'Contract', 'Intern']
