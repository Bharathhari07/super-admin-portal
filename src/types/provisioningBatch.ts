export type ProvisioningStatus = 'Processing' | 'Completed' | 'Partial' | 'Failed'

export interface ProvisioningBatch {
  id: string
  tenantId: string
  tenantName: string
  fileName: string
  totalRecords: number
  successCount: number
  failureCount: number
  status: ProvisioningStatus
  startedAt: string
  completedAt: string | null
}

export interface ProvisioningBatchListResponse {
  data: ProvisioningBatch[]
  total: number
  page: number
  pageSize: number
}

export interface ProvisioningBatchQueryParams {
  search?: string
  status?: ProvisioningStatus | 'All'
  tenantId?: string | 'All'
  page?: number
  pageSize?: number
}

export interface CreateProvisioningBatchInput {
  tenantId: string
  fileName: string
  totalRecords: number
}
