import type { Tenant, TenantStats } from '../types/tenant'

// Simulated tenant database. In a real backend this table would
// live in the platform DB; here it stands in for the /api/tenants
// resource so the rest of the app can be built against a realistic
// shape without needing a server yet.
export const dummyTenants: Tenant[] = [
  { id: 't1', name: 'Acme Corp', code: 'ACM001', adminName: 'John Smith', adminEmail: 'john@acme.com', phone: '+91 98765 43210', country: 'India', timeZone: 'Asia/Kolkata', plan: 'Enterprise', users: 250, status: 'Active', createdAt: '2026-08-01' },
  { id: 't2', name: 'TechNova', code: 'TEC002', adminName: 'David Lee', adminEmail: 'david@technova.com', phone: '+1 415 555 0110', country: 'United States', timeZone: 'America/New_York', plan: 'Pro', users: 120, status: 'Active', createdAt: '2026-08-05' },
  { id: 't3', name: 'Alpha Ltd', code: 'ALP003', adminName: 'Sarah Khan', adminEmail: 'sarah@alphaltd.com', phone: '+44 20 7946 0958', country: 'United Kingdom', timeZone: 'Europe/London', plan: 'Basic', users: 45, status: 'Inactive', createdAt: '2026-08-10' },
  { id: 't4', name: 'Bright Systems', code: 'BRS004', adminName: 'Priya Nair', adminEmail: 'priya@brightsys.com', phone: '+91 98450 12345', country: 'India', timeZone: 'Asia/Kolkata', plan: 'Pro', users: 88, status: 'Active', createdAt: '2026-07-22' },
  { id: 't5', name: 'Nimbus Cloud', code: 'NIM005', adminName: 'Arjun Reddy', adminEmail: 'arjun@nimbuscloud.com', phone: '+61 2 9876 5432', country: 'Australia', timeZone: 'Australia/Sydney', plan: 'Enterprise', users: 310, status: 'Active', createdAt: '2026-07-15' },
  { id: 't6', name: 'Vertex Retail', code: 'VRT006', adminName: 'Meera Iyer', adminEmail: 'meera@vertexretail.com', phone: '+65 6123 4567', country: 'Singapore', timeZone: 'Asia/Singapore', plan: 'Basic', users: 22, status: 'Inactive', createdAt: '2026-06-30' },
  { id: 't7', name: 'Quantum Labs', code: 'QTM007', adminName: 'Karthik Rao', adminEmail: 'karthik@quantumlabs.com', phone: '+91 90000 11122', country: 'India', timeZone: 'Asia/Kolkata', plan: 'Enterprise', users: 415, status: 'Active', createdAt: '2026-06-18' },
  { id: 't8', name: 'Orbit Finance', code: 'ORB008', adminName: 'Divya Menon', adminEmail: 'divya@orbitfinance.com', phone: '+1 212 555 0148', country: 'United States', timeZone: 'America/New_York', plan: 'Pro', users: 96, status: 'Active', createdAt: '2026-06-02' },
  { id: 't9', name: 'Skyline Logistics', code: 'SKY009', adminName: 'Rohan Gupta', adminEmail: 'rohan@skylinelog.com', phone: '+44 161 555 0192', country: 'United Kingdom', timeZone: 'Europe/London', plan: 'Basic', users: 30, status: 'Inactive', createdAt: '2026-05-27' },
  { id: 't10', name: 'Fusion Health', code: 'FUS010', adminName: 'Ananya Sharma', adminEmail: 'ananya@fusionhealth.com', phone: '+91 98123 45678', country: 'India', timeZone: 'Asia/Kolkata', plan: 'Enterprise', users: 275, status: 'Active', createdAt: '2026-05-14' },
  { id: 't11', name: 'Pinnacle Media', code: 'PIN011', adminName: 'Vikram Singh', adminEmail: 'vikram@pinnaclemedia.com', phone: '+61 3 8765 4321', country: 'Australia', timeZone: 'Australia/Sydney', plan: 'Pro', users: 65, status: 'Active', createdAt: '2026-05-03' },
  { id: 't12', name: 'Cedar Analytics', code: 'CED012', adminName: 'Neha Kapoor', adminEmail: 'neha@cedaranalytics.com', phone: '+65 6987 6543', country: 'Singapore', timeZone: 'Asia/Singapore', plan: 'Basic', users: 18, status: 'Inactive', createdAt: '2026-04-21' },
]

// Simulated per-tenant stats for the Tenant Details view (GET /api/tenants/:id/stats)
export const dummyTenantStats: Record<string, TenantStats> = Object.fromEntries(
  dummyTenants.map((t) => [
    t.id,
    {
      tenantId: t.id,
      users: t.users,
      organizations: Math.max(1, Math.round(t.users / 30)),
      activeUsers: Math.round(t.users * 0.87),
      storageUsedPercent: Math.min(95, 20 + Math.round(t.users / 5)),
    } satisfies TenantStats,
  ]),
)