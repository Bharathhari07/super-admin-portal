import { Pencil, Power, PowerOff, Lock, Unlock, KeyRound } from 'lucide-react'
import type { PlatformUser } from '../../types/user'
import Badge from '../common/Badge'
import Button from '../common/Button'
import Spinner from '../common/Spinner'
import EmptyState from '../common/EmptyState'

interface UserTableProps {
  users: PlatformUser[]
  isLoading: boolean
  isError: boolean
  onEdit: (user: PlatformUser) => void
  onToggleStatus: (user: PlatformUser) => void
  onToggleLock: (user: PlatformUser) => void
  onResetPassword: (user: PlatformUser) => void
  togglingUserId: string | null
  resettingUserId: string | null
}

const columns = ['Name', 'Employee ID', 'Email', 'Company', 'Role', 'Status', 'Actions']

function statusTone(status: PlatformUser['status']): 'success' | 'danger' | 'warning' {
  if (status === 'Active') return 'success'
  if (status === 'Locked') return 'warning'
  return 'danger'
}

export default function UserTable({
  users,
  isLoading,
  isError,
  onEdit,
  onToggleStatus,
  onToggleLock,
  onResetPassword,
  togglingUserId,
  resettingUserId,
}: UserTableProps) {
  return (
    <div className="overflow-x-auto sap-scroll">
      <table className="w-full min-w-[840px] border-collapse">
        <thead>
          <tr className="border-b border-sap-border bg-sap-bg/60 text-left">
            {columns.map((col) => (
              <th key={col} className="whitespace-nowrap px-4 py-3 text-xs font-semibold uppercase tracking-wide text-sap-text-muted">
                {col}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {isLoading && (
            <tr>
              <td colSpan={columns.length} className="py-10">
                <div className="flex justify-center">
                  <Spinner />
                </div>
              </td>
            </tr>
          )}
          {isError && !isLoading && (
            <tr>
              <td colSpan={columns.length} className="py-10 text-center text-sm text-sap-danger">
                Couldn't load users. Please try again.
              </td>
            </tr>
          )}
          {!isLoading && !isError && users.length === 0 && (
            <tr>
              <td colSpan={columns.length}>
                <EmptyState title="No users found" description="Try adjusting your search or filters." />
              </td>
            </tr>
          )}
          {!isLoading &&
            !isError &&
            users.map((user) => (
              <tr key={user.id} className="border-b border-sap-border last:border-0 hover:bg-sap-bg/60">
                <td className="whitespace-nowrap px-4 py-3 text-sm font-medium text-sap-text">{user.firstName} {user.lastName}</td>
                <td className="whitespace-nowrap px-4 py-3 text-sm text-sap-text-muted">{user.employeeId}</td>
                <td className="whitespace-nowrap px-4 py-3 text-sm text-sap-text-muted">{user.email}</td>
                <td className="whitespace-nowrap px-4 py-3 text-sm text-sap-text-muted">{user.companyName}</td>
                <td className="whitespace-nowrap px-4 py-3 text-sm text-sap-text-muted">{user.role}</td>
                <td className="whitespace-nowrap px-4 py-3 text-sm">
                  <Badge tone={statusTone(user.status)} dot>
                    {user.status}
                  </Badge>
                </td>
                <td className="whitespace-nowrap px-4 py-3 text-sm">
                  <div className="flex items-center gap-1">
                    <Button variant="ghost" size="sm" onClick={() => onEdit(user)} aria-label="Edit user">
                      <Pencil size={16} />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onResetPassword(user)}
                      isLoading={resettingUserId === user.id}
                      aria-label="Reset password"
                    >
                      <KeyRound size={16} />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onToggleLock(user)}
                      isLoading={togglingUserId === user.id}
                      aria-label={user.status === 'Locked' ? 'Unlock account' : 'Lock account'}
                      className="text-sap-warning"
                    >
                      {user.status === 'Locked' ? <Unlock size={16} /> : <Lock size={16} />}
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onToggleStatus(user)}
                      isLoading={togglingUserId === user.id}
                      aria-label={user.status === 'Active' ? 'Deactivate user' : 'Activate user'}
                      className={user.status === 'Active' ? 'text-sap-danger' : 'text-sap-success'}
                    >
                      {user.status === 'Active' ? <PowerOff size={16} /> : <Power size={16} />}
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  )
}
