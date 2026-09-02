import { useState } from 'react'
import { Plus } from 'lucide-react'
import Button from '../components/common/Button'
import Pagination from '../components/common/Pagination'
import BranchSearchBar from '../components/branches/BranchSearchBar'
import BranchFilters from '../components/branches/BranchFilters'
import BranchTable from '../components/branches/BranchTable'
import BranchModal from '../components/branches/BranchModal'
import { useBranches } from '../hooks/queries/useBranches'
import { useActivateBranch } from '../hooks/mutations/useActivateBranch'
import { useDeactivateBranch } from '../hooks/mutations/useDeactivateBranch'
import type { Branch, BranchStatus, BranchType, BranchQueryParams } from '../types/branch'

const PAGE_SIZE = 5

export default function BranchesPage() {
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState<BranchStatus | 'All'>('All')
  const [businessUnitId, setBusinessUnitId] = useState<string | 'All'>('All')
  const [branchType, setBranchType] = useState<BranchType | 'All'>('All')
  const [sortBy, setSortBy] = useState<BranchQueryParams['sortBy']>('createdAt')
  const [sortDir, setSortDir] = useState<BranchQueryParams['sortDir']>('desc')
  const [page, setPage] = useState(1)
  const [modalOpen, setModalOpen] = useState(false)
  const [editingBranch, setEditingBranch] = useState<Branch | null>(null)

  const queryParams: BranchQueryParams = { search, status, businessUnitId, branchType, sortBy, sortDir, page, pageSize: PAGE_SIZE }
  const { data, isLoading, isError } = useBranches(queryParams)
  const activateBranch = useActivateBranch()
  const deactivateBranch = useDeactivateBranch()

  const togglingBranchId = activateBranch.isPending
    ? (activateBranch.variables as string)
    : deactivateBranch.isPending
      ? (deactivateBranch.variables as string)
      : null

  function handleToggleStatus(branch: Branch) {
    if (branch.status === 'Active') deactivateBranch.mutate(branch.id)
    else activateBranch.mutate(branch.id)
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h2 className="text-xl font-semibold text-sap-text">Branches</h2>
          <p className="text-sm text-sap-text-muted">Manage physical branch locations within each business unit.</p>
        </div>
        <Button onClick={() => { setEditingBranch(null); setModalOpen(true) }}>
          <Plus size={16} /> Create Branch
        </Button>
      </div>

      <div className="rounded-xl border border-sap-border bg-sap-surface p-4 shadow-sm">
        <div className="mb-4 flex flex-col justify-between gap-3 xl:flex-row xl:items-center">
          <BranchSearchBar value={search} onChange={(v) => { setSearch(v); setPage(1) }} />
          <BranchFilters
            status={status}
            businessUnitId={businessUnitId}
            branchType={branchType}
            sortBy={sortBy ?? 'createdAt'}
            sortDir={sortDir ?? 'desc'}
            onStatusChange={(v) => { setStatus(v); setPage(1) }}
            onBusinessUnitChange={(v) => { setBusinessUnitId(v); setPage(1) }}
            onBranchTypeChange={(v) => { setBranchType(v); setPage(1) }}
            onSortChange={(by, dir) => { setSortBy(by); setSortDir(dir) }}
          />
        </div>

        <BranchTable
          branches={data?.data ?? []}
          isLoading={isLoading}
          isError={isError}
          onEdit={(branch) => { setEditingBranch(branch); setModalOpen(true) }}
          onToggleStatus={handleToggleStatus}
          togglingBranchId={togglingBranchId}
        />

        <Pagination page={page} pageSize={PAGE_SIZE} total={data?.total ?? 0} onPageChange={setPage} itemLabel="branches" />
      </div>

      <BranchModal
        open={modalOpen}
        branch={editingBranch}
        onClose={() => setModalOpen(false)}
        onSaved={() => setModalOpen(false)}
      />
    </div>
  )
}
