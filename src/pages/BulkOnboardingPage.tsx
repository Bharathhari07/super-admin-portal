import { useState } from 'react'
import { UploadCloud, Search } from 'lucide-react'
import Select from '../components/common/Select'
import Input from '../components/common/Input'
import Button from '../components/common/Button'
import Badge from '../components/common/Badge'
import Pagination from '../components/common/Pagination'
import Spinner from '../components/common/Spinner'
import EmptyState from '../components/common/EmptyState'
import { dummyTenants } from '../data/dummyTenants'
import { useProvisioningBatches } from '../hooks/queries/useProvisioningBatches'
import { useCreateProvisioningBatch } from '../hooks/mutations/useCreateProvisioningBatch'
import { useFinalizeProvisioningBatch } from '../hooks/mutations/useFinalizeProvisioningBatch'
import type { ProvisioningStatus, ProvisioningBatchQueryParams } from '../types/provisioningBatch'

const PAGE_SIZE = 5

function statusTone(status: ProvisioningStatus): 'success' | 'danger' | 'warning' | 'neutral' {
  if (status === 'Completed') return 'success'
  if (status === 'Failed') return 'danger'
  if (status === 'Partial') return 'warning'
  return 'neutral'
}

export default function BulkOnboardingPage() {
  const [tenantId, setTenantId] = useState(dummyTenants[0]?.id ?? '')
  const [fileName, setFileName] = useState('')
  const [formError, setFormError] = useState<string | null>(null)

  const [search, setSearch] = useState('')
  const [status, setStatus] = useState<ProvisioningStatus | 'All'>('All')
  const [filterTenantId, setFilterTenantId] = useState<string | 'All'>('All')
  const [page, setPage] = useState(1)

  const queryParams: ProvisioningBatchQueryParams = { search, status, tenantId: filterTenantId, page, pageSize: PAGE_SIZE }
  const { data, isLoading } = useProvisioningBatches(queryParams)
  const createBatch = useCreateProvisioningBatch()
  const finalizeBatch = useFinalizeProvisioningBatch()

  const batches = data?.data ?? []
  const total = data?.total ?? 0

  function handleStartImport() {
    setFormError(null)
    if (!fileName.trim()) {
      setFormError('Enter the name of the file you are importing.')
      return
    }
    const totalRecords = 40 + Math.floor(Math.random() * 260)
    createBatch.mutate(
      { tenantId, fileName: fileName.trim(), totalRecords },
      {
        onSuccess: (newBatch) => {
          setFileName('')
          setPage(1)
          setTimeout(() => {
            finalizeBatch.mutate(newBatch.id)
          }, 1800)
        },
      },
    )
  }

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-xl font-semibold text-sap-text">Batch Tenant Provisioning</h2>
        <p className="text-sm text-sap-text-muted">Bulk-import organization rosters, departments, and user roles from a spreadsheet.</p>
      </div>

      <div className="rounded-xl border border-sap-border bg-sap-surface p-5 shadow-sm">
        <h3 className="mb-4 text-sm font-semibold text-sap-text">Start New Import</h3>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <Select
            id="tenantId"
            label="Target Tenant Workspace"
            value={tenantId}
            onChange={(e) => setTenantId(e.target.value)}
            options={dummyTenants.map((t) => ({ label: `${t.name} (${t.code})`, value: t.id }))}
          />
          <Input
            id="fileName"
            label="Roster File Name"
            value={fileName}
            onChange={(e) => setFileName(e.target.value)}
            placeholder="e.g. acme_roster_q4.xlsx"
            error={formError ?? undefined}
          />
          <div className="flex items-end">
            <Button onClick={handleStartImport} isLoading={createBatch.isPending} className="w-full justify-center">
              <UploadCloud size={16} /> Start Import
            </Button>
          </div>
        </div>
        <div className="mt-4 rounded-xl border-2 border-dashed border-sap-border bg-sap-bg/40 p-6 text-center">
          <UploadCloud className="mx-auto mb-2 text-sap-primary" size={28} />
          <p className="text-xs text-sap-text-muted">Real file upload requires a backend to store and parse the spreadsheet - this demo simulates the import using the file name and tenant you provide above.</p>
        </div>
      </div>

      <div className="rounded-xl border border-sap-border bg-sap-surface p-4 shadow-sm">
        <h3 className="mb-4 text-sm font-semibold text-sap-text">Import History</h3>
        <div className="mb-4 flex flex-col justify-between gap-3 xl:flex-row xl:items-center">
          <div className="relative w-full sm:max-w-xs">
            <Search size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sap-text-muted" />
            <input
              type="text"
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1) }}
              placeholder="Search by file name or tenant..."
              className="w-full rounded-lg border border-sap-border bg-sap-surface py-2 pl-9 pr-3 text-sm text-sap-text placeholder:text-sap-text-muted outline-none transition-colors focus:border-sap-primary focus:ring-2 focus:ring-sap-primary/20"
            />
          </div>
          <div className="grid grid-cols-2 gap-3 sm:flex sm:flex-wrap">
            <Select
              aria-label="Filter by status"
              value={status}
              onChange={(e) => { setStatus(e.target.value as ProvisioningStatus | 'All'); setPage(1) }}
              options={[
                { label: 'All Statuses', value: 'All' },
                { label: 'Processing', value: 'Processing' },
                { label: 'Completed', value: 'Completed' },
                { label: 'Partial', value: 'Partial' },
                { label: 'Failed', value: 'Failed' },
              ]}
            />
            <Select
              aria-label="Filter by tenant"
              value={filterTenantId}
              onChange={(e) => { setFilterTenantId(e.target.value); setPage(1) }}
              options={[{ label: 'All Tenants', value: 'All' }, ...dummyTenants.map((t) => ({ label: t.name, value: t.id }))]}
            />
          </div>
        </div>

        <div className="overflow-x-auto sap-scroll">
          <table className="w-full min-w-[720px] border-collapse">
            <thead>
              <tr className="border-b border-sap-border bg-sap-bg/60 text-left">
                <th className="whitespace-nowrap px-4 py-3 text-xs font-semibold uppercase tracking-wide text-sap-text-muted">File</th>
                <th className="whitespace-nowrap px-4 py-3 text-xs font-semibold uppercase tracking-wide text-sap-text-muted">Tenant</th>
                <th className="whitespace-nowrap px-4 py-3 text-xs font-semibold uppercase tracking-wide text-sap-text-muted">Records</th>
                <th className="whitespace-nowrap px-4 py-3 text-xs font-semibold uppercase tracking-wide text-sap-text-muted">Status</th>
                <th className="whitespace-nowrap px-4 py-3 text-xs font-semibold uppercase tracking-wide text-sap-text-muted">Started</th>
              </tr>
            </thead>
            <tbody>
              {isLoading && (
                <tr><td colSpan={5} className="py-10"><div className="flex justify-center"><Spinner /></div></td></tr>
              )}
              {!isLoading && batches.length === 0 && (
                <tr><td colSpan={5}><EmptyState title="No import batches found" description="Try adjusting your search or filters." /></td></tr>
              )}
              {!isLoading && batches.map((batch) => (
                <tr key={batch.id} className="border-b border-sap-border last:border-0 hover:bg-sap-bg/60">
                  <td className="whitespace-nowrap px-4 py-3 text-sm font-medium text-sap-text">{batch.fileName}</td>
                  <td className="whitespace-nowrap px-4 py-3 text-sm text-sap-text-muted">{batch.tenantName}</td>
                  <td className="whitespace-nowrap px-4 py-3 text-sm text-sap-text-muted">
                    {batch.status === 'Processing' ? `${batch.totalRecords} pending` : `${batch.successCount} / ${batch.totalRecords} succeeded`}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-sm">
                    <Badge tone={statusTone(batch.status)} dot>{batch.status}</Badge>
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-sm text-sap-text-muted">{new Date(batch.startedAt).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <Pagination page={page} pageSize={PAGE_SIZE} total={total} onPageChange={setPage} itemLabel="batches" />
      </div>
    </div>
  )
}
