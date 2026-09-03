import { useState } from 'react'
import { Plus } from 'lucide-react'
import Button from '../components/common/Button'
import Pagination from '../components/common/Pagination'
import RoleSearchBar from '../components/roles/RoleSearchBar'
import RoleFilters from '../components/roles/RoleFilters'
import RoleTable from '../components/roles/RoleTable'
import RoleModal from '../components/roles/RoleModal'
import { useRoles } from '../hooks/queries/useRoles'
import { useActivateRole } from '../hooks/mutations/useActivateRole'
import { useDeactivateRole } from '../hooks/mutations/useDeactivateRole'
import type { Role, RoleStatus, RoleCategory, RoleQueryParams } from '../types/role'

const PAGE_SIZE = 5

export default function RolesPage() {
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState<RoleStatus | 'All'>('All')
  const [roleCategory, setRoleCategory] = useState<RoleCategory | 'All'>('All')
  const [sortBy, setSortBy] = useState<RoleQueryParams['sortBy']>('createdAt')
  const [sortDir, setSortDir] = useState<RoleQueryParams['sortDir']>('desc')
  const [page, setPage] = useState(1)
  const [modalOpen, setModalOpen] = useState(false)
  const [editingRole, setEditingRole] = useState<Role | null>(null)

  const queryParams: RoleQueryParams = { search, status, roleCategory, sortBy, sortDir, page, pageSize: PAGE_SIZE }
  const { data, isLoading, isError } = useRoles(queryParams)
  const activateRole = useActivateRole()
  const deactivateRole = useDeactivateRole()

  const togglingRoleId = activateRole.isPending
    ? (activateRole.variables as string)
    : deactivateRole.isPending
      ? (deactivateRole.variables as string)
      : null

  function handleToggleStatus(role: Role) {
    if (role.status === 'Active') deactivateRole.mutate(role.id)
    else activateRole.mutate(role.id)
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h2 className="text-xl font-semibold text-sap-text">Roles</h2>
          <p className="text-sm text-sap-text-muted">Define roles and their organizational scope for access control.</p>
        </div>
        <Button onClick={() => { setEditingRole(null); setModalOpen(true) }}>
          <Plus size={16} /> Create Role
        </Button>
      </div>

      <div className="rounded-xl border border-sap-border bg-sap-surface p-4 shadow-sm">
        <div className="mb-4 flex flex-col justify-between gap-3 xl:flex-row xl:items-center">
          <RoleSearchBar value={search} onChange={(v) => { setSearch(v); setPage(1) }} />
          <RoleFilters
            status={status}
            roleCategory={roleCategory}
            sortBy={sortBy ?? 'createdAt'}
            sortDir={sortDir ?? 'desc'}
            onStatusChange={(v) => { setStatus(v); setPage(1) }}
            onRoleCategoryChange={(v) => { setRoleCategory(v); setPage(1) }}
            onSortChange={(by, dir) => { setSortBy(by); setSortDir(dir) }}
          />
        </div>

        <RoleTable
          roles={data?.data ?? []}
          isLoading={isLoading}
          isError={isError}
          onEdit={(role) => { setEditingRole(role); setModalOpen(true) }}
          onToggleStatus={handleToggleStatus}
          togglingRoleId={togglingRoleId}
        />

        <Pagination page={page} pageSize={PAGE_SIZE} total={data?.total ?? 0} onPageChange={setPage} itemLabel="roles" />
      </div>

      <RoleModal
        open={modalOpen}
        role={editingRole}
        onClose={() => setModalOpen(false)}
        onSaved={() => setModalOpen(false)}
      />
    </div>
  )
}
