import { useState } from 'react'
import { Plus } from 'lucide-react'
import Button from '../components/common/Button'
import Pagination from '../components/common/Pagination'
import UserSearchBar from '../components/users/UserSearchBar'
import UserFilters from '../components/users/UserFilters'
import UserTable from '../components/users/UserTable'
import UserModal from '../components/users/UserModal'
import { useUsers } from '../hooks/queries/useUsers'
import { useActivateUser } from '../hooks/mutations/useActivateUser'
import { useDeactivateUser } from '../hooks/mutations/useDeactivateUser'
import { useToggleUserLock } from '../hooks/mutations/useToggleUserLock'
import { useResetUserPassword } from '../hooks/mutations/useResetUserPassword'
import type { PlatformUser, UserAccountStatus, UserRole, UserQueryParams } from '../types/user'

const PAGE_SIZE = 5

export default function UserManagementPage() {
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState<UserAccountStatus | 'All'>('All')
  const [role, setRole] = useState<UserRole | 'All'>('All')
  const [companyId, setCompanyId] = useState<string | 'All'>('All')
  const [sortBy, setSortBy] = useState<UserQueryParams['sortBy']>('createdAt')
  const [sortDir, setSortDir] = useState<UserQueryParams['sortDir']>('desc')
  const [page, setPage] = useState(1)
  const [modalOpen, setModalOpen] = useState(false)
  const [editingUser, setEditingUser] = useState<PlatformUser | null>(null)
  const [resetMessage, setResetMessage] = useState<string | null>(null)

  const queryParams: UserQueryParams = { search, status, role, companyId, sortBy, sortDir, page, pageSize: PAGE_SIZE }
  const { data, isLoading, isError } = useUsers(queryParams)
  const activateUser = useActivateUser()
  const deactivateUser = useDeactivateUser()
  const toggleLock = useToggleUserLock()
  const resetPassword = useResetUserPassword()

  const togglingUserId = activateUser.isPending
    ? (activateUser.variables as string)
    : deactivateUser.isPending
      ? (deactivateUser.variables as string)
      : toggleLock.isPending
        ? (toggleLock.variables as string)
        : null

  const resettingUserId = resetPassword.isPending ? (resetPassword.variables as string) : null

  function handleToggleStatus(user: PlatformUser) {
    if (user.status === 'Active') deactivateUser.mutate(user.id)
    else activateUser.mutate(user.id)
  }

  function handleToggleLock(user: PlatformUser) {
    toggleLock.mutate(user.id)
  }

  function handleResetPassword(user: PlatformUser) {
    setResetMessage(null)
    resetPassword.mutate(user.id, {
      onSuccess: () => setResetMessage(`Password reset email sent to ${user.email}.`),
    })
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h2 className="text-xl font-semibold text-sap-text">User Management</h2>
          <p className="text-sm text-sap-text-muted">Register, manage, and control access for every platform user.</p>
        </div>
        <Button onClick={() => { setEditingUser(null); setModalOpen(true) }}>
          <Plus size={16} /> Register User
        </Button>
      </div>

      {resetMessage && (
        <div className="rounded-lg border border-sap-border bg-sap-success-bg px-4 py-2 text-sm text-sap-success">
          {resetMessage}
        </div>
      )}

      <div className="rounded-xl border border-sap-border bg-sap-surface p-4 shadow-sm">
        <div className="mb-4 flex flex-col justify-between gap-3 xl:flex-row xl:items-center">
          <UserSearchBar value={search} onChange={(v) => { setSearch(v); setPage(1) }} />
          <UserFilters
            status={status}
            role={role}
            companyId={companyId}
            sortBy={sortBy ?? 'createdAt'}
            sortDir={sortDir ?? 'desc'}
            onStatusChange={(v) => { setStatus(v); setPage(1) }}
            onRoleChange={(v) => { setRole(v); setPage(1) }}
            onCompanyChange={(v) => { setCompanyId(v); setPage(1) }}
            onSortChange={(by, dir) => { setSortBy(by); setSortDir(dir) }}
          />
        </div>

        <UserTable
          users={data?.data ?? []}
          isLoading={isLoading}
          isError={isError}
          onEdit={(user) => { setEditingUser(user); setModalOpen(true) }}
          onToggleStatus={handleToggleStatus}
          onToggleLock={handleToggleLock}
          onResetPassword={handleResetPassword}
          togglingUserId={togglingUserId}
          resettingUserId={resettingUserId}
        />

        <Pagination page={page} pageSize={PAGE_SIZE} total={data?.total ?? 0} onPageChange={setPage} itemLabel="users" />
      </div>

      <UserModal
        open={modalOpen}
        user={editingUser}
        onClose={() => setModalOpen(false)}
        onSaved={() => setModalOpen(false)}
      />
    </div>
  )
}
