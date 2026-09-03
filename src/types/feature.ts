export type FeatureStatus = 'Active' | 'Disabled' | 'Beta' | 'Deprecated'
export type FeatureCategory = 'Core' | 'Add-on' | 'Experimental' | 'Integration' | 'Reporting'
export type ReleaseType = 'General' | 'Beta' | 'Pilot'
export type DefaultStatus = 'Enabled' | 'Disabled'
export type SubscriptionPlan = 'Basic' | 'Pro' | 'Enterprise'

export const MODULE_OPTIONS = [
  'Global Dashboard',
  'Tenant Management',
  'Organization Management',
  'User Management',
  'Role Management',
  'Permission Management',
] as const
export type PlatformModule = (typeof MODULE_OPTIONS)[number]

export interface Feature {
  id: string
  name: string
  code: string
  module: PlatformModule
  featureCategory: FeatureCategory
  status: FeatureStatus
  platformEnabled: boolean
  tenantEnabled: boolean
  organizationEnabled: boolean
  subscriptionPlan: SubscriptionPlan
  featureVersion: string
  rolloutPercentage: string
  releaseType: ReleaseType
  defaultStatus: DefaultStatus
  effectiveDate: string
  expiryDate: string
  remarks: string
  createdAt: string
}

export interface FeatureListResponse {
  data: Feature[]
  total: number
  page: number
  pageSize: number
}

export interface FeatureQueryParams {
  search?: string
  status?: FeatureStatus | 'All'
  module?: PlatformModule | 'All'
  featureCategory?: FeatureCategory | 'All'
  sortBy?: 'name' | 'createdAt'
  sortDir?: 'asc' | 'desc'
  page?: number
  pageSize?: number
}

export interface CreateFeatureInput {
  name: string
  code: string
  module: PlatformModule
  featureCategory: FeatureCategory
  status: FeatureStatus
  platformEnabled: boolean
  tenantEnabled: boolean
  organizationEnabled: boolean
  subscriptionPlan: SubscriptionPlan
  featureVersion: string
  rolloutPercentage: string
  releaseType: ReleaseType
  defaultStatus: DefaultStatus
  effectiveDate: string
  expiryDate: string
  remarks: string
}

export interface UpdateFeatureInput {
  name: string
  code: string
  module: PlatformModule
  featureCategory: FeatureCategory
  platformEnabled: boolean
  tenantEnabled: boolean
  organizationEnabled: boolean
  subscriptionPlan: SubscriptionPlan
  featureVersion: string
  rolloutPercentage: string
  releaseType: ReleaseType
  defaultStatus: DefaultStatus
  effectiveDate: string
  expiryDate: string
  remarks: string
}

export const FEATURE_CATEGORY_OPTIONS: FeatureCategory[] = ['Core', 'Add-on', 'Experimental', 'Integration', 'Reporting']
export const RELEASE_TYPE_OPTIONS: ReleaseType[] = ['General', 'Beta', 'Pilot']
export const SUBSCRIPTION_PLAN_OPTIONS: SubscriptionPlan[] = ['Basic', 'Pro', 'Enterprise']
