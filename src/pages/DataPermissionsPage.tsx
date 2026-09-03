import { useState } from 'react'
import { Plus } from 'lucide-react'
import Button from '../components/common/Button'
import Pagination from '../components/common/Pagination'
import DataPermissionSearchBar from '../components/dataPermissions/DataPermissionSearchBar'
import DataPermissionFilters from '../components/dataPermissions/DataPermissionFilters'
import DataPermissionTable from '../components/dataPermissions/DataPermissionTable'
import DataPermissionModal from '../components/dataPermissions/DataPermissionModal'
import { useDataPermissions } from '../hooks/queries/useDataPermissions'
import { useActivateDataPermission } from '../hooks/mutations/useActivateDataPermission'
import { useDeactivateDataPermission } from '../hooks/mutations/useDeactivateDataPermission'
import type { DataPermission, DataPermissionStatus, AccessScope, DataPermissionQueryParams } from '../types/dataPermission'

const PAGE_SIZE = 5

export default function DataPermissionsPage() {
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState<DataPermissionStatus | 'All'>('All')
  const [roleId, setRoleId] = useState<string | 'All'>('All')
  const [accessScope, setAccessScope] = useState<AccessScope | 'All'>('All')
  const [page, setPage] = useState(1)
  const [modalOpen, setModalOpen] = useState(false)
  const [editingPermission, setEditingPermission] = useState<DataPermission | null>(null)

  const queryParams: DataPermissionQueryParams = { search, status, roleId, accessScope, page, pageSize: PAGE_SIZE }
  const { data, isLoading, isError } = useDataPermissions(queryParams)
  const activatePermission = useActivateDataPermission()
  const deactivatePermission = useDeactivateDataPermission()

  const togglingPermissionId = activatePermission.isPending
    ? (activatePermission.variables as string)
    : deactivatePermission.isPending
      ? (deactivatePermission.variables as string)
      : null

  function handleToggleStatus(permission: DataPermission) {
    if (permission.status === 'Active') deactivatePermission.mutate(permission.id)
    else activatePermission.mutate(permission.id)
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h2 className="text-xl font-semibold text-sap-text">Data Permissions</h2>
          <p className="text-sm text-sap-text-muted">Control what data each role can view, edit, or export, scoped by ownership and hierarchy.</p>
        </div>
        <Button onClick={() => { setEditingPermission(null); setModalOpen(true) }}>
          <Plus size={16} /> Create Data Permission
        </Button>
      </div>

      <div className="rounded-xl border border-sap-border bg-sap-surface p-4 shadow-sm">
        <div className="mb-4 flex flex-col justify-between gap-3 xl:flex-row xl:items-center">
          <DataPermissionSearchBar value={search} onChange={(v) => { setSearch(v); setPage(1) }} />
          <DataPermissionFilters
            status={status}
            roleId={roleId}
            accessScope={accessScope}
            onStatusChange={(v) => { setStatus(v); setPage(1) }}
            onRoleChange={(v) => { setRoleId(v); setPage(1) }}
            onAccessScopeChange={(v) => { setAccessScope(v); setPage(1) }}
          />
        </div>

        <DataPermissionTable
          permissions={data?.data ?? []}
          isLoading={isLoading}
          isError={isError}
          onEdit={(permission) => { setEditingPermission(permission); setModalOpen(true) }}
          onToggleStatus={handleToggleStatus}
          togglingPermissionId={togglingPermissionId}
        />

        <Pagination page={page} pageSize={PAGE_SIZE} total={data?.total ?? 0} onPageChange={setPage} itemLabel="data permissions" />
      </div>

      <DataPermissionModal
        open={modalOpen}
        permission={editingPermission}
        onClose={() => setModalOpen(false)}
        onSaved={() => setModalOpen(false)}
      />
    </div>
  )
}
