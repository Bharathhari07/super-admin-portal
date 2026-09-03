export type LicenseType = 'Trial' | 'Free' | 'Standard' | 'Professional' | 'Enterprise'
export type LicenseStatus = 'Active' | 'Expired' | 'Suspended' | 'Pending Renewal'
export type SubscriptionPlan = 'Basic' | 'Pro' | 'Enterprise'
export type RenewalType = 'Manual' | 'Automatic'

export interface License {
  id: string
  name: string
  licenseType: LicenseType
  licenseStatus: LicenseStatus
  subscriptionPlan: SubscriptionPlan
  tenantId: string
  tenantName: string
  startDate: string
  expiryDate: string
  gracePeriodDays: string
  renewalType: RenewalType
  renewalReminderDays: string
  maximumUsers: string
  maximumStorageGb: string
  maximumApiRequests: string
  maximumOrganizations: string
  maximumBranches: string
  maximumActiveSessions: string
  hrmsEnabled: boolean
  crmEnabled: boolean
  erpEnabled: boolean
  financeEnabled: boolean
  workflowEnabled: boolean
  aiServicesEnabled: boolean
  mobileAppEnabled: boolean
  apiAccessEnabled: boolean
  createdAt: string
}

export interface LicenseListResponse {
  data: License[]
  total: number
  page: number
  pageSize: number
}

export interface LicenseQueryParams {
  search?: string
  licenseStatus?: LicenseStatus | 'All'
  licenseType?: LicenseType | 'All'
  tenantId?: string | 'All'
  sortBy?: 'name' | 'createdAt'
  sortDir?: 'asc' | 'desc'
  page?: number
  pageSize?: number
}

export interface CreateLicenseInput {
  name: string
  licenseType: LicenseType
  licenseStatus: LicenseStatus
  subscriptionPlan: SubscriptionPlan
  tenantId: string
  startDate: string
  expiryDate: string
  gracePeriodDays: string
  renewalType: RenewalType
  renewalReminderDays: string
  maximumUsers: string
  maximumStorageGb: string
  maximumApiRequests: string
  maximumOrganizations: string
  maximumBranches: string
  maximumActiveSessions: string
  hrmsEnabled: boolean
  crmEnabled: boolean
  erpEnabled: boolean
  financeEnabled: boolean
  workflowEnabled: boolean
  aiServicesEnabled: boolean
  mobileAppEnabled: boolean
  apiAccessEnabled: boolean
}

export interface UpdateLicenseInput {
  name: string
  licenseType: LicenseType
  subscriptionPlan: SubscriptionPlan
  tenantId: string
  startDate: string
  expiryDate: string
  gracePeriodDays: string
  renewalType: RenewalType
  renewalReminderDays: string
  maximumUsers: string
  maximumStorageGb: string
  maximumApiRequests: string
  maximumOrganizations: string
  maximumBranches: string
  maximumActiveSessions: string
  hrmsEnabled: boolean
  crmEnabled: boolean
  erpEnabled: boolean
  financeEnabled: boolean
  workflowEnabled: boolean
  aiServicesEnabled: boolean
  mobileAppEnabled: boolean
  apiAccessEnabled: boolean
}

export const LICENSE_TYPE_OPTIONS: LicenseType[] = ['Trial', 'Free', 'Standard', 'Professional', 'Enterprise']
export const SUBSCRIPTION_PLAN_OPTIONS: SubscriptionPlan[] = ['Basic', 'Pro', 'Enterprise']
export const RENEWAL_TYPE_OPTIONS: RenewalType[] = ['Manual', 'Automatic']
