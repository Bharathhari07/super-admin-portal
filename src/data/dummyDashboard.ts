import type {
  DashboardKpis,
  PlatformHealth,
  DashboardAnalytics,
  RecentActivity,
} from '../types/dashboard'

// Simulated aggregate stats for GET /api/dashboard/stats
export const dummyKpis: DashboardKpis = {
  totalTenants: 125,
  activeTenants: 112,
  inactiveTenants: 13,
  totalUsers: 5240,
  activeLicenses: 98,
}

// Simulated GET /api/dashboard/health
export const dummyHealth: PlatformHealth = {
  apiGateway: 'Healthy',
  database: 'Connected',
  server: 'Running',
  storagePercent: 68,
  cpuPercent: 42,
  memoryPercent: 61,
}

// Simulated GET /api/dashboard/analytics
export const dummyAnalytics: DashboardAnalytics = {
  tenantGrowth: [
    { month: 'Mar', tenants: 78 },
    { month: 'Apr', tenants: 86 },
    { month: 'May', tenants: 95 },
    { month: 'Jun', tenants: 104 },
    { month: 'Jul', tenants: 116 },
    { month: 'Aug', tenants: 125 },
  ],
  userGrowth: [
    { month: 'Mar', users: 3120 },
    { month: 'Apr', users: 3580 },
    { month: 'May', users: 4020 },
    { month: 'Jun', users: 4460 },
    { month: 'Jul', users: 4890 },
    { month: 'Aug', users: 5240 },
  ],
  statusBreakdown: {
    active: 112,
    inactive: 13,
  },
}

// Simulated GET /api/dashboard/activities
export const dummyActivities: RecentActivity[] = [
  { id: 'a1', type: 'tenant_created', message: 'New tenant "Fusion Health" was created', timestamp: '2026-08-26T09:12:00Z' },
  { id: 'a2', type: 'tenant_activated', message: 'Tenant "Pinnacle Media" was activated', timestamp: '2026-08-25T15:40:00Z' },
  { id: 'a3', type: 'tenant_config_updated', message: 'Tenant configuration updated for "Acme Corp"', timestamp: '2026-08-25T11:05:00Z' },
  { id: 'a4', type: 'license_renewed', message: 'License renewed for "Quantum Labs"', timestamp: '2026-08-24T18:22:00Z' },
  { id: 'a5', type: 'tenant_deactivated', message: 'Tenant "Cedar Analytics" was deactivated', timestamp: '2026-08-24T08:47:00Z' },
]