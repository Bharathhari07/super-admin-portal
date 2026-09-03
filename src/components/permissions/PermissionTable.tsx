import { Pencil, Power, PowerOff } from 'lucide-react'
import type { Permission } from '../../types/permission'
import Badge from '../common/Badge'
import Button from '../common/Button'
import Spinner from '../common/Spinner'
import EmptyState from '../common/EmptyState'

interface PermissionTableProps {
  permissions: Permission[]
  isLoading: boolean
  isError: boolean
  onEdit: (permission: Permission) => void
  onToggleStatus: (permission: Permission) => void
  togglingPermissionId: string | null
}

const columns = ['Permission', 'Code', 'Module', 'Type', 'Access Level', 'Status', 'Actions']

export default function PermissionTable({
  permissions,
  isLoading,
  isError,
  onEdit,
  onToggleStatus,
  togglingPermissionId,
}: PermissionTableProps) {
  return (
    <div className="overflow-x-auto sap-scroll">
      <table className="w-full min-w-[820px] border-collapse">
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
                Couldn't load permissions. Please try again.
              </td>
            </tr>
          )}
          {!isLoading && !isError && permissions.length === 0 && (
            <tr>
              <td colSpan={columns.length}>
                <EmptyState title="No permissions found" description="Try adjusting your search or filters." />
              </td>
            </tr>
          )}
          {!isLoading &&
            !isError &&
            permissions.map((permission) => (
              <tr key={permission.id} className="border-b border-sap-border last:border-0 hover:bg-sap-bg/60">
                <td className="whitespace-nowrap px-4 py-3 text-sm font-medium text-sap-text">
                  {permission.name}
                  {permission.isDefaultPermission && <span className="ml-2 text-xs text-sap-text-muted">(default)</span>}
                </td>
                <td className="whitespace-nowrap px-4 py-3 text-sm text-sap-text-muted">{permission.code}</td>
                <td className="whitespace-nowrap px-4 py-3 text-sm text-sap-text-muted">{permission.module}</td>
                <td className="whitespace-nowrap px-4 py-3 text-sm text-sap-text-muted">{permission.permissionType}</td>
                <td className="whitespace-nowrap px-4 py-3 text-sm text-sap-text-muted">{permission.accessLevel}</td>
                <td className="whitespace-nowrap px-4 py-3 text-sm">
                  <Badge tone={permission.status === 'Active' ? 'success' : 'danger'} dot>
                    {permission.status}
                  </Badge>
                </td>
                <td className="whitespace-nowrap px-4 py-3 text-sm">
                  <div className="flex items-center gap-1">
                    <Button variant="ghost" size="sm" onClick={() => onEdit(permission)} aria-label="Edit permission">
                      <Pencil size={16} />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onToggleStatus(permission)}
                      isLoading={togglingPermissionId === permission.id}
                      aria-label={permission.status === 'Active' ? 'Deactivate permission' : 'Activate permission'}
                      className={permission.status === 'Active' ? 'text-sap-danger' : 'text-sap-success'}
                    >
                      {permission.status === 'Active' ? <PowerOff size={16} /> : <Power size={16} />}
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
