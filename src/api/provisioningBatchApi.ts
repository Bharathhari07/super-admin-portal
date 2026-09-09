import { dummyProvisioningBatches } from '../data/dummyProvisioningBatches'
import { dummyTenants } from '../data/dummyTenants'
import { simulateDelay, simulateMutationDelay } from './mockClient'
import type {
  ProvisioningBatch,
  ProvisioningBatchListResponse,
  ProvisioningBatchQueryParams,
  CreateProvisioningBatchInput,
} from '../types/provisioningBatch'

let batchStore: ProvisioningBatch[] = [...dummyProvisioningBatches]

function applyFilters(batches: ProvisioningBatch[], params: ProvisioningBatchQueryParams): ProvisioningBatch[] {
  let result = [...batches]
  if (params.search && params.search.trim() !== '') {
    const term = params.search.trim().toLowerCase()
    result = result.filter((b) => b.fileName.toLowerCase().includes(term) || b.tenantName.toLowerCase().includes(term))
  }
  if (params.status && params.status !== 'All') {
    result = result.filter((b) => b.status === params.status)
  }
  if (params.tenantId && params.tenantId !== 'All') {
    result = result.filter((b) => b.tenantId === params.tenantId)
  }
  result.sort((a, b) => new Date(b.startedAt).getTime() - new Date(a.startedAt).getTime())
  return result
}

export async function fetchProvisioningBatches(params: ProvisioningBatchQueryParams): Promise<ProvisioningBatchListResponse> {
  const filtered = applyFilters(batchStore, params)
  const page = params.page ?? 1
  const pageSize = params.pageSize ?? 5
  const start = (page - 1) * pageSize
  return simulateDelay({ data: filtered.slice(start, start + pageSize), total: filtered.length, page, pageSize })
}

export async function createProvisioningBatch(input: CreateProvisioningBatchInput): Promise<ProvisioningBatch> {
  const tenant = dummyTenants.find((t) => t.id === input.tenantId)
  const newBatch: ProvisioningBatch = {
    id: `pb${Date.now()}`,
    tenantId: input.tenantId,
    tenantName: tenant ? tenant.name : 'Unknown',
    fileName: input.fileName,
    totalRecords: input.totalRecords,
    successCount: 0,
    failureCount: 0,
    status: 'Processing',
    startedAt: new Date().toISOString(),
    completedAt: null,
  }
  batchStore = [newBatch, ...batchStore]
  return simulateMutationDelay(newBatch)
}

// Called by the UI a few seconds after createProvisioningBatch to mark
// the batch as finished, since real row-by-row import validation has
// no backend here to run against.
export async function finalizeProvisioningBatch(id: string): Promise<ProvisioningBatch> {
  const index = batchStore.findIndex((b) => b.id === id)
  if (index === -1) throw new Error('Batch not found')
  const batch = batchStore[index]
  const failureCount = Math.floor(batch.totalRecords * 0.02)
  const successCount = batch.totalRecords - failureCount
  const updated: ProvisioningBatch = {
    ...batch,
    successCount,
    failureCount,
    status: failureCount === 0 ? 'Completed' : 'Partial',
    completedAt: new Date().toISOString(),
  }
  batchStore = batchStore.map((b) => (b.id === id ? updated : b))
  return simulateMutationDelay(updated)
}
