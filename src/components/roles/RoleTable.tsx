import { Pencil, Power, PowerOff } from 'lucide-react'
import type { Role } from '../../types/role'
import Badge from '../common/Badge'
import Button from '../common/Button'
import Spinner from '../common/Spinner'
import EmptyState from '../common/EmptyState'

interface RoleTableProps {
  roles: Role[]
  isLoading: boolean
  isError: boolean
  onEdit: (role: Role) => void
  onToggleStatus: (role: Role) => void
  togglingRoleId: string | null
}

const columns = ['Role', 'Code', 'Category', 'Type', 'Scope', 'Status', 'Actions']

export default function RoleTable({
  roles,
  isLoading,
  isError,
  onEdit,
  onToggleStatus,
  togglingRoleId,
}: RoleTableProps) {
  return (
    <div className="overflow-x-auto sap-scroll">
      <table className="w-full min-w-[760px] border-collapse">
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
                Couldn't load roles. Please try again.
              </td>
            </tr>
          )}
          {!isLoading && !isError && roles.length === 0 && (
            <tr>
              <td colSpan={columns.length}>
                <EmptyState title="No roles found" description="Try adjusting your search or filters." />
              </td>
            </tr>
          )}
          {!isLoading &&
            !isError &&
            roles.map((role) => (
              <tr key={role.id} className="border-b border-sap-border last:border-0 hover:bg-sap-bg/60">
                <td className="whitespace-nowrap px-4 py-3 text-sm font-medium text-sap-text">
                  {role.name}
                  {role.isDefaultRole && <span className="ml-2 text-xs text-sap-text-muted">(default)</span>}
                </td>
                <td className="whitespace-nowrap px-4 py-3 text-sm text-sap-text-muted">{role.code}</td>
                <td className="whitespace-nowrap px-4 py-3 text-sm text-sap-text-muted">{role.roleCategory}</td>
                <td className="whitespace-nowrap px-4 py-3 text-sm text-sap-text-muted">{role.roleType}</td>
                <td className="whitespace-nowrap px-4 py-3 text-sm text-sap-text-muted">{role.organizationScope}</td>
                <td className="whitespace-nowrap px-4 py-3 text-sm">
                  <Badge tone={role.status === 'Active' ? 'success' : 'danger'} dot>
                    {role.status}
                  </Badge>
                </td>
                <td className="whitespace-nowrap px-4 py-3 text-sm">
                  <div className="flex items-center gap-1">
                    <Button variant="ghost" size="sm" onClick={() => onEdit(role)} aria-label="Edit role">
                      <Pencil size={16} />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onToggleStatus(role)}
                      isLoading={togglingRoleId === role.id}
                      aria-label={role.status === 'Active' ? 'Deactivate role' : 'Activate role'}
                      className={role.status === 'Active' ? 'text-sap-danger' : 'text-sap-success'}
                    >
                      {role.status === 'Active' ? <PowerOff size={16} /> : <Power size={16} />}
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
