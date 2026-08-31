import { Pencil, Power, PowerOff } from 'lucide-react'
import type { BusinessUnit } from '../../types/businessUnit'
import Badge from '../common/Badge'
import Button from '../common/Button'
import Spinner from '../common/Spinner'
import EmptyState from '../common/EmptyState'

interface BusinessUnitTableProps {
  units: BusinessUnit[]
  isLoading: boolean
  isError: boolean
  onEdit: (unit: BusinessUnit) => void
  onToggleStatus: (unit: BusinessUnit) => void
  togglingUnitId: string | null
}

const columns = ['Business Unit', 'Code', 'Company', 'Head', 'Status', 'Created', 'Actions']

export default function BusinessUnitTable({
  units,
  isLoading,
  isError,
  onEdit,
  onToggleStatus,
  togglingUnitId,
}: BusinessUnitTableProps) {
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
                Couldn't load business units. Please try again.
              </td>
            </tr>
          )}
          {!isLoading && !isError && units.length === 0 && (
            <tr>
              <td colSpan={columns.length}>
                <EmptyState title="No business units found" description="Try adjusting your search or filters." />
              </td>
            </tr>
          )}
          {!isLoading &&
            !isError &&
            units.map((unit) => (
              <tr key={unit.id} className="border-b border-sap-border last:border-0 hover:bg-sap-bg/60">
                <td className="whitespace-nowrap px-4 py-3 text-sm font-medium text-sap-text">{unit.name}</td>
                <td className="whitespace-nowrap px-4 py-3 text-sm text-sap-text-muted">{unit.code}</td>
                <td className="whitespace-nowrap px-4 py-3 text-sm text-sap-text-muted">{unit.companyName}</td>
                <td className="whitespace-nowrap px-4 py-3 text-sm text-sap-text-muted">{unit.head}</td>
                <td className="whitespace-nowrap px-4 py-3 text-sm">
                  <Badge tone={unit.status === 'Active' ? 'success' : 'danger'} dot>
                    {unit.status}
                  </Badge>
                </td>
                <td className="whitespace-nowrap px-4 py-3 text-sm text-sap-text-muted">{unit.createdAt}</td>
                <td className="whitespace-nowrap px-4 py-3 text-sm">
                  <div className="flex items-center gap-1">
                    <Button variant="ghost" size="sm" onClick={() => onEdit(unit)} aria-label="Edit business unit">
                      <Pencil size={16} />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onToggleStatus(unit)}
                      isLoading={togglingUnitId === unit.id}
                      aria-label={unit.status === 'Active' ? 'Deactivate business unit' : 'Activate business unit'}
                      className={unit.status === 'Active' ? 'text-sap-danger' : 'text-sap-success'}
                    >
                      {unit.status === 'Active' ? <PowerOff size={16} /> : <Power size={16} />}
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
