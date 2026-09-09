import type { RecoverySnapshot } from '../types/recoverySnapshot'

export const dummyRecoverySnapshots: RecoverySnapshot[] = [
  { id: 'snap1', tenantId: 't1', tenantName: 'Acme Corp', snapshotName: 'acme-corp-2026-08-25-0300', sizeGb: 42.6, createdAt: '2026-08-25T03:00:00Z', status: 'Available' },
  { id: 'snap2', tenantId: 't1', tenantName: 'Acme Corp', snapshotName: 'acme-corp-2026-08-18-0300', sizeGb: 41.2, createdAt: '2026-08-18T03:00:00Z', status: 'Available' },
  { id: 'snap3', tenantId: 't2', tenantName: 'TechNova', snapshotName: 'technova-2026-08-24-0300', sizeGb: 28.9, createdAt: '2026-08-24T03:00:00Z', status: 'Available' },
  { id: 'snap4', tenantId: 't5', tenantName: 'Nimbus Cloud', snapshotName: 'nimbus-cloud-2026-08-23-0300', sizeGb: 63.4, createdAt: '2026-08-23T03:00:00Z', status: 'Restored' },
  { id: 'snap5', tenantId: 't7', tenantName: 'Quantum Labs', snapshotName: 'quantum-labs-2026-08-20-0300', sizeGb: 91.1, createdAt: '2026-08-20T03:00:00Z', status: 'Available' },
  { id: 'snap6', tenantId: 't8', tenantName: 'Orbit Finance', snapshotName: 'orbit-finance-2026-08-19-0300', sizeGb: 15.8, createdAt: '2026-08-19T03:00:00Z', status: 'Failed' },
]
