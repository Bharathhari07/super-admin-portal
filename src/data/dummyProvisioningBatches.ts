import type { ProvisioningBatch } from '../types/provisioningBatch'

export const dummyProvisioningBatches: ProvisioningBatch[] = [
  { id: 'pb1', tenantId: 't1', tenantName: 'Acme Corp', fileName: 'acme_roster_q3.xlsx', totalRecords: 240, successCount: 238, failureCount: 2, status: 'Partial', startedAt: '2026-08-20T09:15:00Z', completedAt: '2026-08-20T09:17:40Z' },
  { id: 'pb2', tenantId: 't2', tenantName: 'TechNova', fileName: 'technova_departments.csv', totalRecords: 85, successCount: 85, failureCount: 0, status: 'Completed', startedAt: '2026-08-18T14:02:00Z', completedAt: '2026-08-18T14:03:12Z' },
  { id: 'pb3', tenantId: 't5', tenantName: 'Nimbus Cloud', fileName: 'nimbus_org_import.xlsx', totalRecords: 312, successCount: 312, failureCount: 0, status: 'Completed', startedAt: '2026-08-15T11:40:00Z', completedAt: '2026-08-15T11:44:05Z' },
  { id: 'pb4', tenantId: 't7', tenantName: 'Quantum Labs', fileName: 'quantum_roster_v2.csv', totalRecords: 150, successCount: 0, failureCount: 150, status: 'Failed', startedAt: '2026-08-10T08:00:00Z', completedAt: '2026-08-10T08:00:45Z' },
  { id: 'pb5', tenantId: 't1', tenantName: 'Acme Corp', fileName: 'acme_new_hires_aug.xlsx', totalRecords: 42, successCount: 42, failureCount: 0, status: 'Completed', startedAt: '2026-08-05T16:20:00Z', completedAt: '2026-08-05T16:20:58Z' },
]
