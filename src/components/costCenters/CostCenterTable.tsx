import { Pencil, Power, PowerOff } from 'lucide-react'
import type { CostCenter } from '../../types/costCenter'
import Badge from '../common/Badge'
import Button from '../common/Button'
import Spinner from '../common/Spinner'
import EmptyState from '../common/EmptyState'

interface CostCenterTableProps {
  centers: CostCenter[]
  isLoading: boolean
  isError: boolean
  onEdit: (center: CostCenter) => void
  onToggleStatus: (center: CostCenter) => void
  togglingCenterId: string | null
}

const columns = ['Cost Center', 'Code', 'Type', 'Budget Owner', 'Budget', 'Status', 'Actions']

function formatBudget(amount: number, currency: string): string {
  return `${currency} ${amount.toLocaleString()}`
}

export default function CostCenterTable({
  centers,
  isLoading,
  isError,
  onEdit,
  onToggleStatus,
  togglingCenterId,
}: CostCenterTableProps) {
  return (
    <div className="overflow-x-auto sap-scroll">
      <table className="w-full min-w-[780px] border-collapse">
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
                Couldn't load cost centers. Please try again.
              </td>
            </tr>
          )}
          {!isLoading && !isError && centers.length === 0 && (
            <tr>
              <td colSpan={columns.length}>
                <EmptyState title="No cost centers found" description="Try adjusting your search or filters." />
              </td>
            </tr>
          )}
          {!isLoading &&
            !isError &&
            centers.map((center) => (
              <tr key={center.id} className="border-b border-sap-border last:border-0 hover:bg-sap-bg/60">
                <td className="whitespace-nowrap px-4 py-3 text-sm font-medium text-sap-text">{center.name}</td>
                <td className="whitespace-nowrap px-4 py-3 text-sm text-sap-text-muted">{center.code}</td>
                <td className="whitespace-nowrap px-4 py-3 text-sm text-sap-text-muted">{center.costCenterType}</td>
                <td className="whitespace-nowrap px-4 py-3 text-sm text-sap-text-muted">{center.budgetOwner}</td>
                <td className="whitespace-nowrap px-4 py-3 text-sm text-sap-text-muted">{formatBudget(center.budgetAllocation, center.currency)}</td>
                <td className="whitespace-nowrap px-4 py-3 text-sm">
                  <Badge tone={center.status === 'Active' ? 'success' : 'danger'} dot>
                    {center.status}
                  </Badge>
                </td>
                <td className="whitespace-nowrap px-4 py-3 text-sm">
                  <div className="flex items-center gap-1">
                    <Button variant="ghost" size="sm" onClick={() => onEdit(center)} aria-label="Edit cost center">
                      <Pencil size={16} />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onToggleStatus(center)}
                      isLoading={togglingCenterId === center.id}
                      aria-label={center.status === 'Active' ? 'Deactivate cost center' : 'Activate cost center'}
                      className={center.status === 'Active' ? 'text-sap-danger' : 'text-sap-success'}
                    >
                      {center.status === 'Active' ? <PowerOff size={16} /> : <Power size={16} />}
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
