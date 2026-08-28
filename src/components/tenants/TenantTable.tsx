import type { Tenant } from '../../types/tenant'
import TenantTableRow from './TenantTableRow'
import Spinner from '../common/Spinner'
import EmptyState from '../common/EmptyState'

interface TenantTableProps {
  tenants: Tenant[]
  isLoading: boolean
  isError: boolean
  onView: (tenant: Tenant) => void
  onEdit: (tenant: Tenant) => void
  onToggleStatus: (tenant: Tenant) => void
  togglingTenantId: string | null
}

const columns = ['Tenant', 'Code', 'Admin', 'Plan', 'Users', 'Status', 'Created', 'Actions']

export default function TenantTable({
  tenants,
  isLoading,
  isError,
  onView,
  onEdit,
  onToggleStatus,
  togglingTenantId,
}: TenantTableProps) {
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
                Couldn&apos;t load tenants. Please try again.
              </td>
            </tr>
          )}

          {!isLoading && !isError && tenants.length === 0 && (
            <tr>
              <td colSpan={columns.length}>
                <EmptyState title="No tenants found" description="Try adjusting your search or filters." />
              </td>
            </tr>
          )}

          {!isLoading &&
            !isError &&
            tenants.map((tenant) => (
              <TenantTableRow
                key={tenant.id}
                tenant={tenant}
                onView={onView}
                onEdit={onEdit}
                onToggleStatus={onToggleStatus}
                isTogglingStatus={togglingTenantId === tenant.id}
              />
            ))}
        </tbody>
      </table>
    </div>
  )
}