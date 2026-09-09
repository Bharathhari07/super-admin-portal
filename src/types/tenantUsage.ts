export type BillingStatus = 'Paid' | 'Pending' | 'Overdue'

export interface TenantUsageRecord {
  id: string
  tenantId: string
  tenantName: string
  plan: string
  seatsUsed: number
  seatsLimit: number
  storageUsedGb: number
  storageLimitGb: number
  apiCallsUsed: number
  apiCallsLimit: number
  billingStatus: BillingStatus
  currentInvoiceAmount: number
  currency: string
  nextBillingDate: string
}

export interface TenantUsageListResponse {
  data: TenantUsageRecord[]
  total: number
  page: number
  pageSize: number
}

export interface TenantUsageQueryParams {
  search?: string
  billingStatus?: BillingStatus | 'All'
  page?: number
  pageSize?: number
}
