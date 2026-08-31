import { useState } from 'react'
import { Plus } from 'lucide-react'
import Button from '../components/common/Button'
import Pagination from '../components/common/Pagination'
import BusinessUnitSearchBar from '../components/businessUnits/BusinessUnitSearchBar'
import BusinessUnitFilters from '../components/businessUnits/BusinessUnitFilters'
import BusinessUnitTable from '../components/businessUnits/BusinessUnitTable'
import BusinessUnitModal from '../components/businessUnits/BusinessUnitModal'
import { useBusinessUnits } from '../hooks/queries/useBusinessUnits'
import { useActivateBusinessUnit } from '../hooks/mutations/useActivateBusinessUnit'
import { useDeactivateBusinessUnit } from '../hooks/mutations/useDeactivateBusinessUnit'
import type { BusinessUnit, BusinessUnitStatus, BusinessUnitQueryParams } from '../types/businessUnit'

const PAGE_SIZE = 5

export default function BusinessUnitsPage() {
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState<BusinessUnitStatus | 'All'>('All')
  const [companyId, setCompanyId] = useState<string | 'All'>('All')
  const [sortBy, setSortBy] = useState<BusinessUnitQueryParams['sortBy']>('createdAt')
  const [sortDir, setSortDir] = useState<BusinessUnitQueryParams['sortDir']>('desc')
  const [page, setPage] = useState(1)
  const [modalOpen, setModalOpen] = useState(false)
  const [editingUnit, setEditingUnit] = useState<BusinessUnit | null>(null)

  const queryParams: BusinessUnitQueryParams = { search, status, companyId, sortBy, sortDir, page, pageSize: PAGE_SIZE }
  const { data, isLoading, isError } = useBusinessUnits(queryParams)
  const activateBU = useActivateBusinessUnit()
  const deactivateBU = useDeactivateBusinessUnit()

  const togglingUnitId = activateBU.isPending
    ? (activateBU.variables as string)
    : deactivateBU.isPending
      ? (deactivateBU.variables as string)
      : null

  function handleToggleStatus(unit: BusinessUnit) {
    if (unit.status === 'Active') deactivateBU.mutate(unit.id)
    else activateBU.mutate(unit.id)
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h2 className="text-xl font-semibold text-sap-text">Business Units</h2>
          <p className="text-sm text-sap-text-muted">Manage business divisions within each organization.</p>
        </div>
        <Button onClick={() => { setEditingUnit(null); setModalOpen(true) }}>
          <Plus size={16} /> Create Business Unit
        </Button>
      </div>

      <div className="rounded-xl border border-sap-border bg-sap-surface p-4 shadow-sm">
        <div className="mb-4 flex flex-col justify-between gap-3 xl:flex-row xl:items-center">
          <BusinessUnitSearchBar value={search} onChange={(v) => { setSearch(v); setPage(1) }} />
          <BusinessUnitFilters
            status={status}
            companyId={companyId}
            sortBy={sortBy ?? 'createdAt'}
            sortDir={sortDir ?? 'desc'}
            onStatusChange={(v) => { setStatus(v); setPage(1) }}
            onCompanyChange={(v) => { setCompanyId(v); setPage(1) }}
            onSortChange={(by, dir) => { setSortBy(by); setSortDir(dir) }}
          />
        </div>

        <BusinessUnitTable
          units={data?.data ?? []}
          isLoading={isLoading}
          isError={isError}
          onEdit={(unit) => { setEditingUnit(unit); setModalOpen(true) }}
          onToggleStatus={handleToggleStatus}
          togglingUnitId={togglingUnitId}
        />

        <Pagination page={page} pageSize={PAGE_SIZE} total={data?.total ?? 0} onPageChange={setPage} itemLabel="business units" />
      </div>

      <BusinessUnitModal
        open={modalOpen}
        unit={editingUnit}
        onClose={() => setModalOpen(false)}
        onSaved={() => setModalOpen(false)}
      />
    </div>
  )
}
