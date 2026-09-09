import { dummyTenantUsage } from '../data/dummyTenantUsage'
import { simulateDelay, simulateMutationDelay } from './mockClient'
import type {
  TenantUsageRecord,
  TenantUsageListResponse,
  TenantUsageQueryParams,
} from '../types/tenantUsage'

let usageStore: TenantUsageRecord[] = [...dummyTenantUsage]

function applyFilters(records: TenantUsageRecord[], params: TenantUsageQueryParams): TenantUsageRecord[] {
  let result = [...records]
  if (params.search && params.search.trim() !== '') {
    const term = params.search.trim().toLowerCase()
    result = result.filter((r) => r.tenantName.toLowerCase().includes(term))
  }
  if (params.billingStatus && params.billingStatus !== 'All') {
    result = result.filter((r) => r.billingStatus === params.billingStatus)
  }
  result.sort((a, b) => a.tenantName.localeCompare(b.tenantName))
  return result
}

export async function fetchTenantUsage(params: TenantUsageQueryParams): Promise<TenantUsageListResponse> {
  const filtered = applyFilters(usageStore, params)
  const page = params.page ?? 1
  const pageSize = params.pageSize ?? 5
  const start = (page - 1) * pageSize
  return simulateDelay({ data: filtered.slice(start, start + pageSize), total: filtered.length, page, pageSize })
}

export async function markInvoicePaid(id: string): Promise<TenantUsageRecord> {
  const index = usageStore.findIndex((r) => r.id === id)
  if (index === -1) throw new Error('Usage record not found')
  const current = usageStore[index]
  const nextMonth = new Date(current.nextBillingDate)
  nextMonth.setMonth(nextMonth.getMonth() + 1)
  const updated: TenantUsageRecord = {
    ...current,
    billingStatus: 'Paid',
    nextBillingDate: nextMonth.toISOString().slice(0, 10),
  }
  usageStore = usageStore.map((r) => (r.id === id ? updated : r))
  return simulateMutationDelay(updated)
}

export async function exportInvoice(id: string): Promise<string> {
  const record = usageStore.find((r) => r.id === id)
  if (!record) throw new Error('Usage record not found')
  await simulateDelay(null)
  const header = 'Tenant,Plan,Seats,Storage (GB),API Calls,Amount,Currency,Status,Next Billing Date'
  const row = `${record.tenantName},${record.plan},${record.seatsUsed}/${record.seatsLimit},${record.storageUsedGb}/${record.storageLimitGb},${record.apiCallsUsed}/${record.apiCallsLimit},${record.currentInvoiceAmount},${record.currency},${record.billingStatus},${record.nextBillingDate}`
  return `${header}\n${row}`
}
