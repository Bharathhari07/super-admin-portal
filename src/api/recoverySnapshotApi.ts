import { dummyRecoverySnapshots } from '../data/dummyRecoverySnapshots'
import { dummyTenants } from '../data/dummyTenants'
import { simulateDelay, simulateMutationDelay } from './mockClient'
import type {
  RecoverySnapshot,
  RecoverySnapshotListResponse,
  RecoverySnapshotQueryParams,
  CreateSnapshotInput,
} from '../types/recoverySnapshot'

let snapshotStore: RecoverySnapshot[] = [...dummyRecoverySnapshots]

function applyFilters(snapshots: RecoverySnapshot[], params: RecoverySnapshotQueryParams): RecoverySnapshot[] {
  let result = [...snapshots]
  if (params.search && params.search.trim() !== '') {
    const term = params.search.trim().toLowerCase()
    result = result.filter((s) => s.snapshotName.toLowerCase().includes(term) || s.tenantName.toLowerCase().includes(term))
  }
  if (params.status && params.status !== 'All') {
    result = result.filter((s) => s.status === params.status)
  }
  if (params.tenantId && params.tenantId !== 'All') {
    result = result.filter((s) => s.tenantId === params.tenantId)
  }
  result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
  return result
}

export async function fetchRecoverySnapshots(params: RecoverySnapshotQueryParams): Promise<RecoverySnapshotListResponse> {
  const filtered = applyFilters(snapshotStore, params)
  const page = params.page ?? 1
  const pageSize = params.pageSize ?? 5
  const start = (page - 1) * pageSize
  return simulateDelay({ data: filtered.slice(start, start + pageSize), total: filtered.length, page, pageSize })
}

export async function createSnapshot(input: CreateSnapshotInput): Promise<RecoverySnapshot> {
  const tenant = dummyTenants.find((t) => t.id === input.tenantId)
  const slug = tenant ? tenant.name.toLowerCase().replace(/[^a-z0-9]+/g, '-') : 'unknown'
  const timestamp = new Date().toISOString().slice(0, 16).replace('T', '-').replace(':', '')
  const newSnapshot: RecoverySnapshot = {
    id: `snap${Date.now()}`,
    tenantId: input.tenantId,
    tenantName: tenant ? tenant.name : 'Unknown',
    snapshotName: `${slug}-${timestamp}`,
    sizeGb: Math.round((10 + Math.random() * 90) * 10) / 10,
    createdAt: new Date().toISOString(),
    status: 'Available',
  }
  snapshotStore = [newSnapshot, ...snapshotStore]
  return simulateMutationDelay(newSnapshot)
}

export async function startRestore(id: string): Promise<RecoverySnapshot> {
  const index = snapshotStore.findIndex((s) => s.id === id)
  if (index === -1) throw new Error('Snapshot not found')
  const updated: RecoverySnapshot = { ...snapshotStore[index], status: 'Restoring' }
  snapshotStore = snapshotStore.map((s) => (s.id === id ? updated : s))
  return simulateMutationDelay(updated)
}

// Called by the UI a couple of seconds after startRestore, since a real
// restore has no actual database to roll back here.
export async function finishRestore(id: string): Promise<RecoverySnapshot> {
  const index = snapshotStore.findIndex((s) => s.id === id)
  if (index === -1) throw new Error('Snapshot not found')
  const updated: RecoverySnapshot = { ...snapshotStore[index], status: 'Restored' }
  snapshotStore = snapshotStore.map((s) => (s.id === id ? updated : s))
  return simulateMutationDelay(updated)
}
