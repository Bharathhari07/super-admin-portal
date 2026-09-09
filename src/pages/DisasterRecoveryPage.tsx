import { useState } from 'react'
import { Search, PlusCircle, RotateCcw } from 'lucide-react'
import Select from '../components/common/Select'
import Button from '../components/common/Button'
import Badge from '../components/common/Badge'
import Pagination from '../components/common/Pagination'
import Spinner from '../components/common/Spinner'
import EmptyState from '../components/common/EmptyState'
import { dummyTenants } from '../data/dummyTenants'
import { useRecoverySnapshots } from '../hooks/queries/useRecoverySnapshots'
import { useCreateSnapshot } from '../hooks/mutations/useCreateSnapshot'
import { useStartRestore } from '../hooks/mutations/useStartRestore'
import { useFinishRestore } from '../hooks/mutations/useFinishRestore'
import type { SnapshotStatus, RecoverySnapshotQueryParams } from '../types/recoverySnapshot'

const PAGE_SIZE = 5

function statusTone(status: SnapshotStatus): 'success' | 'danger' | 'warning' | 'neutral' {
  if (status === 'Available') return 'success'
  if (status === 'Restored') return 'success'
  if (status === 'Failed') return 'danger'
  return 'warning'
}

export default function DisasterRecoveryPage() {
  const [createTenantId, setCreateTenantId] = useState(dummyTenants[0]?.id ?? '')

  const [search, setSearch] = useState('')
  const [status, setStatus] = useState<SnapshotStatus | 'All'>('All')
  const [filterTenantId, setFilterTenantId] = useState<string | 'All'>('All')
  const [page, setPage] = useState(1)
  const [restoringId, setRestoringId] = useState<string | null>(null)

  const queryParams: RecoverySnapshotQueryParams = { search, status, tenantId: filterTenantId, page, pageSize: PAGE_SIZE }
  const { data, isLoading } = useRecoverySnapshots(queryParams)
  const createSnapshot = useCreateSnapshot()
  const startRestore = useStartRestore()
  const finishRestore = useFinishRestore()

  const snapshots = data?.data ?? []
  const total = data?.total ?? 0

  function handleCreateSnapshot() {
    createSnapshot.mutate({ tenantId: createTenantId }, { onSuccess: () => setPage(1) })
  }

  function handleRestore(id: string) {
    setRestoringId(id)
    startRestore.mutate(id, {
      onSuccess: () => {
        setTimeout(() => {
          finishRestore.mutate(id, { onSuccess: () => setRestoringId(null) })
        }, 1800)
      },
    })
  }

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-xl font-semibold text-sap-text">Tenant Data Isolation & Recovery</h2>
        <p className="text-sm text-sap-text-muted">Point-in-time recovery and snapshot rollbacks for isolated tenant workspaces.</p>
      </div>

      <div className="rounded-xl border border-sap-border bg-sap-surface p-5 shadow-sm">
        <h3 className="mb-4 text-sm font-semibold text-sap-text">Create New Snapshot</h3>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <Select
            id="createTenantId"
            label="Tenant Workspace"
            value={createTenantId}
            onChange={(e) => setCreateTenantId(e.target.value)}
            options={dummyTenants.map((t) => ({ label: `${t.name} (${t.code})`, value: t.id }))}
          />
          <div className="flex items-end sm:col-span-2">
            <Button onClick={handleCreateSnapshot} isLoading={createSnapshot.isPending}>
              <PlusCircle size={16} /> Take Snapshot Now
            </Button>
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-sap-border bg-sap-surface p-4 shadow-sm">
        <h3 className="mb-4 text-sm font-semibold text-sap-text">Available Snapshots</h3>
        <div className="mb-4 flex flex-col justify-between gap-3 xl:flex-row xl:items-center">
          <div className="relative w-full sm:max-w-xs">
            <Search size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sap-text-muted" />
            <input
              type="text"
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1) }}
              placeholder="Search by snapshot or tenant..."
              className="w-full rounded-lg border border-sap-border bg-sap-surface py-2 pl-9 pr-3 text-sm text-sap-text placeholder:text-sap-text-muted outline-none transition-colors focus:border-sap-primary focus:ring-2 focus:ring-sap-primary/20"
            />
          </div>
          <div className="grid grid-cols-2 gap-3 sm:flex sm:flex-wrap">
            <Select
              aria-label="Filter by status"
              value={status}
              onChange={(e) => { setStatus(e.target.value as SnapshotStatus | 'All'); setPage(1) }}
              options={[
                { label: 'All Statuses', value: 'All' },
                { label: 'Available', value: 'Available' },
                { label: 'Restoring', value: 'Restoring' },
                { label: 'Restored', value: 'Restored' },
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
                <th className="whitespace-nowrap px-4 py-3 text-xs font-semibold uppercase tracking-wide text-sap-text-muted">Snapshot</th>
                <th className="whitespace-nowrap px-4 py-3 text-xs font-semibold uppercase tracking-wide text-sap-text-muted">Tenant</th>
                <th className="whitespace-nowrap px-4 py-3 text-xs font-semibold uppercase tracking-wide text-sap-text-muted">Size</th>
                <th className="whitespace-nowrap px-4 py-3 text-xs font-semibold uppercase tracking-wide text-sap-text-muted">Created</th>
                <th className="whitespace-nowrap px-4 py-3 text-xs font-semibold uppercase tracking-wide text-sap-text-muted">Status</th>
                <th className="whitespace-nowrap px-4 py-3 text-xs font-semibold uppercase tracking-wide text-sap-text-muted">Actions</th>
              </tr>
            </thead>
            <tbody>
              {isLoading && (
                <tr><td colSpan={6} className="py-10"><div className="flex justify-center"><Spinner /></div></td></tr>
              )}
              {!isLoading && snapshots.length === 0 && (
                <tr><td colSpan={6}><EmptyState title="No snapshots found" description="Try adjusting your search or filters." /></td></tr>
              )}
              {!isLoading && snapshots.map((snap) => (
                <tr key={snap.id} className="border-b border-sap-border last:border-0 hover:bg-sap-bg/60">
                  <td className="whitespace-nowrap px-4 py-3 text-sm font-medium text-sap-text">{snap.snapshotName}</td>
                  <td className="whitespace-nowrap px-4 py-3 text-sm text-sap-text-muted">{snap.tenantName}</td>
                  <td className="whitespace-nowrap px-4 py-3 text-sm text-sap-text-muted">{snap.sizeGb} GB</td>
                  <td className="whitespace-nowrap px-4 py-3 text-sm text-sap-text-muted">{new Date(snap.createdAt).toLocaleString()}</td>
                  <td className="whitespace-nowrap px-4 py-3 text-sm">
                    <Badge tone={statusTone(snap.status)} dot>{snap.status}</Badge>
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-sm">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRestore(snap.id)}
                      isLoading={restoringId === snap.id}
                      disabled={snap.status !== 'Available'}
                    >
                      <RotateCcw size={14} /> Restore
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <Pagination page={page} pageSize={PAGE_SIZE} total={total} onPageChange={setPage} itemLabel="snapshots" />
      </div>
    </div>
  )
}
