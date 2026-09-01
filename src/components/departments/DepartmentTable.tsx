import { Pencil, Power, PowerOff } from 'lucide-react'
import type { Department } from '../../types/department'
import Badge from '../common/Badge'
import Button from '../common/Button'
import Spinner from '../common/Spinner'
import EmptyState from '../common/EmptyState'

interface DepartmentTableProps {
  departments: Department[]
  isLoading: boolean
  isError: boolean
  onEdit: (dept: Department) => void
  onToggleStatus: (dept: Department) => void
  togglingDeptId: string | null
}

const columns = ['Department', 'Code', 'Business Unit', 'Head', 'Status', 'Created', 'Actions']

export default function DepartmentTable({
  departments,
  isLoading,
  isError,
  onEdit,
  onToggleStatus,
  togglingDeptId,
}: DepartmentTableProps) {
  return (
    <div className="overflow-x-auto sap-scroll">
      <table className="w-full min-w-[720px] border-collapse">
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
                Couldn't load departments. Please try again.
              </td>
            </tr>
          )}
          {!isLoading && !isError && departments.length === 0 && (
            <tr>
              <td colSpan={columns.length}>
                <EmptyState title="No departments found" description="Try adjusting your search or filters." />
              </td>
            </tr>
          )}
          {!isLoading &&
            !isError &&
            departments.map((dept) => (
              <tr key={dept.id} className="border-b border-sap-border last:border-0 hover:bg-sap-bg/60">
                <td className="whitespace-nowrap px-4 py-3 text-sm font-medium text-sap-text">{dept.name}</td>
                <td className="whitespace-nowrap px-4 py-3 text-sm text-sap-text-muted">{dept.code}</td>
                <td className="whitespace-nowrap px-4 py-3 text-sm text-sap-text-muted">{dept.businessUnitName}</td>
                <td className="whitespace-nowrap px-4 py-3 text-sm text-sap-text-muted">{dept.head}</td>
                <td className="whitespace-nowrap px-4 py-3 text-sm">
                  <Badge tone={dept.status === 'Active' ? 'success' : 'danger'} dot>
                    {dept.status}
                  </Badge>
                </td>
                <td className="whitespace-nowrap px-4 py-3 text-sm text-sap-text-muted">{dept.createdAt}</td>
                <td className="whitespace-nowrap px-4 py-3 text-sm">
                  <div className="flex items-center gap-1">
                    <Button variant="ghost" size="sm" onClick={() => onEdit(dept)} aria-label="Edit department">
                      <Pencil size={16} />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onToggleStatus(dept)}
                      isLoading={togglingDeptId === dept.id}
                      aria-label={dept.status === 'Active' ? 'Deactivate department' : 'Activate department'}
                      className={dept.status === 'Active' ? 'text-sap-danger' : 'text-sap-success'}
                    >
                      {dept.status === 'Active' ? <PowerOff size={16} /> : <Power size={16} />}
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
