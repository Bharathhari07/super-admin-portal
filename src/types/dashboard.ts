export interface DashboardKpis {
  totalTenants: number
  activeTenants: number
  inactiveTenants: number
  totalUsers: number
  activeLicenses: number
}

export type HealthState = 'Healthy' | 'Degraded' | 'Down' | 'Connected' | 'Running'

export interface PlatformHealth {
  apiGateway: HealthState
  database: HealthState
  server: HealthState
  storagePercent: number
  cpuPercent: number
  memoryPercent: number
}

export interface TenantGrowthPoint {
  month: string
  tenants: number
}

export interface UserGrowthPoint {
  month: string
  users: number
}

export interface TenantStatusBreakdown {
  active: number
  inactive: number
}

export interface DashboardAnalytics {
  tenantGrowth: TenantGrowthPoint[]
  userGrowth: UserGrowthPoint[]
  statusBreakdown: TenantStatusBreakdown
}

export type ActivityType =
  | 'tenant_created'
  | 'tenant_activated'
  | 'tenant_deactivated'
  | 'tenant_config_updated'
  | 'license_renewed'

export interface RecentActivity {
  id: string
  type: ActivityType
  message: string
  timestamp: string // ISO date string
}