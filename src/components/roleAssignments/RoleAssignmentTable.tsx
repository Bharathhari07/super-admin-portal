import { Pencil, Power, PowerOff } from 'lucide-react'
import type { RoleAssignment } from '../../types/roleAssignment'
import Badge from '../common/Badge'
import Button from '../common/Button'
import Spinner from '../common/Spinner'
import EmptyState from '../common/EmptyState'

interface RoleAssignmentTableProps {
  assignments: RoleAssignment[]
  isLoading: boolean
  isError: boolean
  onEdit: (assignment: RoleAssignment) => void
  onToggleStatus: (assignment: RoleAssignment) => void
  togglingAssignmentId: string | null
}

const columns = ['Role', 'Permission', 'Scope', 'Effective Date', 'Status', 'Actions']

export default function RoleAssignmentTable({
  assignments,
  isLoading,
  isError,
  onEdit,
  onToggleStatus,
  togglingAssignmentId,
}: RoleAssignmentTableProps) {
  return (
    <div className="overflow-x-auto sap-scroll">
      <table className="w-full min-w-[700px] border-collapse">
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
                Couldn't load role assignments. Please try again.
              </td>
            </tr>
          )}
          {!isLoading && !isError && assignments.length === 0 && (
            <tr>
              <td colSpan={columns.length}>
                <EmptyState title="No role assignments found" description="Try adjusting your search or filters." />
              </td>
            </tr>
          )}
          {!isLoading &&
            !isError &&
            assignments.map((assignment) => (
              <tr key={assignment.id} className="border-b border-sap-border last:border-0 hover:bg-sap-bg/60">
                <td className="whitespace-nowrap px-4 py-3 text-sm font-medium text-sap-text">{assignment.roleName}</td>
                <td className="whitespace-nowrap px-4 py-3 text-sm text-sap-text-muted">{assignment.permissionName}</td>
                <td className="whitespace-nowrap px-4 py-3 text-sm text-sap-text-muted">{assignment.organizationScope}</td>
                <td className="whitespace-nowrap px-4 py-3 text-sm text-sap-text-muted">{assignment.effectiveDate}</td>
                <td className="whitespace-nowrap px-4 py-3 text-sm">
                  <Badge tone={assignment.status === 'Active' ? 'success' : 'danger'} dot>
                    {assignment.status}
                  </Badge>
                </td>
                <td className="whitespace-nowrap px-4 py-3 text-sm">
                  <div className="flex items-center gap-1">
                    <Button variant="ghost" size="sm" onClick={() => onEdit(assignment)} aria-label="Edit assignment">
                      <Pencil size={16} />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onToggleStatus(assignment)}
                      isLoading={togglingAssignmentId === assignment.id}
                      aria-label={assignment.status === 'Active' ? 'Deactivate assignment' : 'Activate assignment'}
                      className={assignment.status === 'Active' ? 'text-sap-danger' : 'text-sap-success'}
                    >
                      {assignment.status === 'Active' ? <PowerOff size={16} /> : <Power size={16} />}
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
