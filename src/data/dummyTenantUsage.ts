import type { TenantUsageRecord } from '../types/tenantUsage'

export const dummyTenantUsage: TenantUsageRecord[] = [
  { id: 'usage-t1', tenantId: 't1', tenantName: 'Acme Corp', plan: 'Enterprise', seatsUsed: 187, seatsLimit: 250, storageUsedGb: 620, storageLimitGb: 1000, apiCallsUsed: 812000, apiCallsLimit: 1000000, billingStatus: 'Paid', currentInvoiceAmount: 4200, currency: 'USD', nextBillingDate: '2026-09-01' },
  { id: 'usage-t2', tenantId: 't2', tenantName: 'TechNova', plan: 'Pro', seatsUsed: 95, seatsLimit: 120, storageUsedGb: 210, storageLimitGb: 500, apiCallsUsed: 340000, apiCallsLimit: 500000, billingStatus: 'Pending', currentInvoiceAmount: 1250, currency: 'USD', nextBillingDate: '2026-09-05' },
  { id: 'usage-t3', tenantId: 't3', tenantName: 'Alpha Ltd', plan: 'Basic', seatsUsed: 38, seatsLimit: 45, storageUsedGb: 62, storageLimitGb: 100, apiCallsUsed: 41000, apiCallsLimit: 50000, billingStatus: 'Overdue', currentInvoiceAmount: 350, currency: 'GBP', nextBillingDate: '2026-08-15' },
  { id: 'usage-t5', tenantId: 't5', tenantName: 'Nimbus Cloud', plan: 'Enterprise', seatsUsed: 512, seatsLimit: 600, storageUsedGb: 1740, storageLimitGb: 2000, apiCallsUsed: 1650000, apiCallsLimit: 2000000, billingStatus: 'Paid', currentInvoiceAmount: 5800, currency: 'AUD', nextBillingDate: '2026-09-10' },
  { id: 'usage-t7', tenantId: 't7', tenantName: 'Quantum Labs', plan: 'Enterprise', seatsUsed: 680, seatsLimit: 800, storageUsedGb: 2450, storageLimitGb: 3000, apiCallsUsed: 2600000, apiCallsLimit: 3000000, billingStatus: 'Pending', currentInvoiceAmount: 7100, currency: 'INR', nextBillingDate: '2026-09-15' },
]
