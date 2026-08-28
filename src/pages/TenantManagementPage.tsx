import { useState } from 'react'
import { Plus } from 'lucide-react'
import Button from '../components/common/Button'
import Pagination from '../components/common/Pagination'
import TenantSearchBar from '../components/tenants/TenantSearchBar'
import TenantFilters from '../components/tenants/TenantFilters'
import TenantTable from '../components/tenants/TenantTable'
import CreateTenantModal from '../components/tenants/CreateTenantModal'
import EditTenantModal from '../components/tenants/EditTenantModal'
import TenantDetailsModal from '../components/tenants/TenantDetailsModal'
import { useTenants } from '../hooks/queries/useTenants'
import { useActivateTenant } from '../hooks/mutations/useActivateTenant'
import { useDeactivateTenant } from '../hooks/mutations/useDeactivateTenant'
import type { Tenant, TenantStatus, TenantPlan, TenantQueryParams } from '../types/tenant'

const PAGE_SIZE = 5

export default function TenantManagementPage() {
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState<TenantStatus | 'All'>('All')
  const [plan, setPlan] = useState<TenantPlan | 'All'>('All')
  const [sortBy, setSortBy] = useState<TenantQueryParams['sortBy']>('createdAt')
  const [sortDir, setSortDir] = useState<TenantQueryParams['sortDir']>('desc')
  const [page, setPage] = useState(1)

  const [createOpen, setCreateOpen] = useState(false)
  const [viewingTenantId, setViewingTenantId] = useState<string | null>(null)
  const [editingTenant, setEditingTenant] = useState<Tenant | null>(null)

  const queryParams: TenantQueryParams = {
    search,
    status,
    plan,
    sortBy,
    sortDir,
    page,
    pageSize: PAGE_SIZE,
  }

  const { data, isLoading, isError } = useTenants(queryParams)
  const activateTenant = useActivateTenant()
  const deactivateTenant = useDeactivateTenant()

  const togglingTenantId = activateTenant.isPending
    ? (activateTenant.variables as string)
    : deactivateTenant.isPending
      ? (deactivateTenant.variables as string)
      : null

  function handleSearchChange(value: string) {
    setSearch(value)
    setPage(1) // reset to first page whenever the search term changes
  }

  function handleStatusChange(nextStatus: TenantStatus | 'All') {
    setStatus(nextStatus)
    setPage(1)
  }

  function handlePlanChange(nextPlan: TenantPlan | 'All') {
    setPlan(nextPlan)
    setPage(1)
  }

  function handleSortChange(nextSortBy: TenantQueryParams['sortBy'], nextSortDir: TenantQueryParams['sortDir']) {
    setSortBy(nextSortBy)
    setSortDir(nextSortDir)
  }

  function handleToggleStatus(tenant: Tenant) {
    if (tenant.status === 'Active') {
      deactivateTenant.mutate(tenant.id)
    } else {
      activateTenant.mutate(tenant.id)
    }
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h2 className="text-xl font-semibold text-sap-text">Tenant Management</h2>
          <p className="text-sm text-sap-text-muted">View, search, and manage every tenant on the platform.</p>
        </div>
        <Button onClick={() => setCreateOpen(true)}>
          <Plus size={16} /> Create Tenant
        </Button>
      </div>

      <div className="rounded-xl border border-sap-border bg-sap-surface p-4 shadow-sm">
        <div className="mb-4 flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
          <TenantSearchBar value={search} onChange={handleSearchChange} />
          <TenantFilters
            status={status}
            plan={plan}
            sortBy={sortBy ?? 'createdAt'}
            sortDir={sortDir ?? 'desc'}
            onStatusChange={handleStatusChange}
            onPlanChange={handlePlanChange}
            onSortChange={handleSortChange}
          />
        </div>

        <TenantTable
          tenants={data?.data ?? []}
          isLoading={isLoading}
          isError={isError}
          onView={(tenant) => setViewingTenantId(tenant.id)}
          onEdit={(tenant) => setEditingTenant(tenant)}
          onToggleStatus={handleToggleStatus}
          togglingTenantId={togglingTenantId}
        />

        <Pagination page={page} pageSize={PAGE_SIZE} total={data?.total ?? 0} onPageChange={setPage} />
      </div>

      <CreateTenantModal open={createOpen} onClose={() => setCreateOpen(false)} onCreated={() => setCreateOpen(false)} />

      <TenantDetailsModal
        tenantId={viewingTenantId}
        onClose={() => setViewingTenantId(null)}
        onEdit={(tenant) => {
          setViewingTenantId(null)
          setEditingTenant(tenant)
        }}
      />

      <EditTenantModal
        tenant={editingTenant}
        onClose={() => setEditingTenant(null)}
        onUpdated={() => setEditingTenant(null)}
      />
    </div>
  )
}