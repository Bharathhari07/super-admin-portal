import { useState } from 'react'
import { Plus } from 'lucide-react'
import Button from '../components/common/Button'
import Pagination from '../components/common/Pagination'
import PermissionSearchBar from '../components/permissions/PermissionSearchBar'
import PermissionFilters from '../components/permissions/PermissionFilters'
import PermissionTable from '../components/permissions/PermissionTable'
import PermissionModal from '../components/permissions/PermissionModal'
import { usePermissions } from '../hooks/queries/usePermissions'
import { useActivatePermission } from '../hooks/mutations/useActivatePermission'
import { useDeactivatePermission } from '../hooks/mutations/useDeactivatePermission'
import type { Permission, PermissionStatus, PermissionCategory, PlatformModule, PermissionQueryParams } from '../types/permission'

const PAGE_SIZE = 5

export default function PermissionsPage() {
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState<PermissionStatus | 'All'>('All')
  const [permissionCategory, setPermissionCategory] = useState<PermissionCategory | 'All'>('All')
  const [module, setModule] = useState<PlatformModule | 'All'>('All')
  const [sortBy, setSortBy] = useState<PermissionQueryParams['sortBy']>('createdAt')
  const [sortDir, setSortDir] = useState<PermissionQueryParams['sortDir']>('desc')
  const [page, setPage] = useState(1)
  const [modalOpen, setModalOpen] = useState(false)
  const [editingPermission, setEditingPermission] = useState<Permission | null>(null)

  const queryParams: PermissionQueryParams = { search, status, permissionCategory, module, sortBy, sortDir, page, pageSize: PAGE_SIZE }
  const { data, isLoading, isError } = usePermissions(queryParams)
  const activatePermission = useActivatePermission()
  const deactivatePermission = useDeactivatePermission()

  const togglingPermissionId = activatePermission.isPending
    ? (activatePermission.variables as string)
    : deactivatePermission.isPending
      ? (deactivatePermission.variables as string)
      : null

  function handleToggleStatus(permission: Permission) {
    if (permission.status === 'Active') deactivatePermission.mutate(permission.id)
    else activatePermission.mutate(permission.id)
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h2 className="text-xl font-semibold text-sap-text">Permissions</h2>
          <p className="text-sm text-sap-text-muted">Define granular access permissions and assign them to roles.</p>
        </div>
        <Button onClick={() => { setEditingPermission(null); setModalOpen(true) }}>
          <Plus size={16} /> Create Permission
        </Button>
      </div>

      <div className="rounded-xl border border-sap-border bg-sap-surface p-4 shadow-sm">
        <div className="mb-4 flex flex-col justify-between gap-3 xl:flex-row xl:items-center">
          <PermissionSearchBar value={search} onChange={(v) => { setSearch(v); setPage(1) }} />
          <PermissionFilters
            status={status}
            permissionCategory={permissionCategory}
            module={module}
            sortBy={sortBy ?? 'createdAt'}
            sortDir={sortDir ?? 'desc'}
            onStatusChange={(v) => { setStatus(v); setPage(1) }}
            onPermissionCategoryChange={(v) => { setPermissionCategory(v); setPage(1) }}
            onModuleChange={(v) => { setModule(v); setPage(1) }}
            onSortChange={(by, dir) => { setSortBy(by); setSortDir(dir) }}
          />
        </div>

        <PermissionTable
          permissions={data?.data ?? []}
          isLoading={isLoading}
          isError={isError}
          onEdit={(permission) => { setEditingPermission(permission); setModalOpen(true) }}
          onToggleStatus={handleToggleStatus}
          togglingPermissionId={togglingPermissionId}
        />

        <Pagination page={page} pageSize={PAGE_SIZE} total={data?.total ?? 0} onPageChange={setPage} itemLabel="permissions" />
      </div>

      <PermissionModal
        open={modalOpen}
        permission={editingPermission}
        onClose={() => setModalOpen(false)}
        onSaved={() => setModalOpen(false)}
      />
    </div>
  )
}
