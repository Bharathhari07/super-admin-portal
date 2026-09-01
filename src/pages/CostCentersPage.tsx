import { useState } from 'react'
import { Plus } from 'lucide-react'
import Button from '../components/common/Button'
import Pagination from '../components/common/Pagination'
import CostCenterSearchBar from '../components/costCenters/CostCenterSearchBar'
import CostCenterFilters from '../components/costCenters/CostCenterFilters'
import CostCenterTable from '../components/costCenters/CostCenterTable'
import CostCenterModal from '../components/costCenters/CostCenterModal'
import { useCostCenters } from '../hooks/queries/useCostCenters'
import { useActivateCostCenter } from '../hooks/mutations/useActivateCostCenter'
import { useDeactivateCostCenter } from '../hooks/mutations/useDeactivateCostCenter'
import type { CostCenter, CostCenterStatus, CostCenterQueryParams } from '../types/costCenter'

const PAGE_SIZE = 5

export default function CostCentersPage() {
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState<CostCenterStatus | 'All'>('All')
  const [businessUnitId, setBusinessUnitId] = useState<string | 'All'>('All')
  const [sortBy, setSortBy] = useState<CostCenterQueryParams['sortBy']>('createdAt')
  const [sortDir, setSortDir] = useState<CostCenterQueryParams['sortDir']>('desc')
  const [page, setPage] = useState(1)
  const [modalOpen, setModalOpen] = useState(false)
  const [editingCenter, setEditingCenter] = useState<CostCenter | null>(null)

  const queryParams: CostCenterQueryParams = { search, status, businessUnitId, sortBy, sortDir, page, pageSize: PAGE_SIZE }
  const { data, isLoading, isError } = useCostCenters(queryParams)
  const activateCC = useActivateCostCenter()
  const deactivateCC = useDeactivateCostCenter()

  const togglingCenterId = activateCC.isPending
    ? (activateCC.variables as string)
    : deactivateCC.isPending
      ? (deactivateCC.variables as string)
      : null

  function handleToggleStatus(center: CostCenter) {
    if (center.status === 'Active') deactivateCC.mutate(center.id)
    else activateCC.mutate(center.id)
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h2 className="text-xl font-semibold text-sap-text">Cost Centers</h2>
          <p className="text-sm text-sap-text-muted">Manage budget allocations tied to departments and business units.</p>
        </div>
        <Button onClick={() => { setEditingCenter(null); setModalOpen(true) }}>
          <Plus size={16} /> Create Cost Center
        </Button>
      </div>

      <div className="rounded-xl border border-sap-border bg-sap-surface p-4 shadow-sm">
        <div className="mb-4 flex flex-col justify-between gap-3 xl:flex-row xl:items-center">
          <CostCenterSearchBar value={search} onChange={(v) => { setSearch(v); setPage(1) }} />
          <CostCenterFilters
            status={status}
            businessUnitId={businessUnitId}
            sortBy={sortBy ?? 'createdAt'}
            sortDir={sortDir ?? 'desc'}
            onStatusChange={(v) => { setStatus(v); setPage(1) }}
            onBusinessUnitChange={(v) => { setBusinessUnitId(v); setPage(1) }}
            onSortChange={(by, dir) => { setSortBy(by); setSortDir(dir) }}
          />
        </div>

        <CostCenterTable
          centers={data?.data ?? []}
          isLoading={isLoading}
          isError={isError}
          onEdit={(center) => { setEditingCenter(center); setModalOpen(true) }}
          onToggleStatus={handleToggleStatus}
          togglingCenterId={togglingCenterId}
        />

        <Pagination page={page} pageSize={PAGE_SIZE} total={data?.total ?? 0} onPageChange={setPage} itemLabel="cost centers" />
      </div>

      <CostCenterModal
        open={modalOpen}
        center={editingCenter}
        onClose={() => setModalOpen(false)}
        onSaved={() => setModalOpen(false)}
      />
    </div>
  )
}
