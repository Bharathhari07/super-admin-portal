export type SnapshotStatus = 'Available' | 'Restoring' | 'Restored' | 'Failed'

export interface RecoverySnapshot {
  id: string
  tenantId: string
  tenantName: string
  snapshotName: string
  sizeGb: number
  createdAt: string
  status: SnapshotStatus
}

export interface RecoverySnapshotListResponse {
  data: RecoverySnapshot[]
  total: number
  page: number
  pageSize: number
}

export interface RecoverySnapshotQueryParams {
  search?: string
  status?: SnapshotStatus | 'All'
  tenantId?: string | 'All'
  page?: number
  pageSize?: number
}

export interface CreateSnapshotInput {
  tenantId: string
}
