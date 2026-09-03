import { Pencil, Power, PowerOff } from 'lucide-react'
import type { License } from '../../types/license'
import Badge from '../common/Badge'
import Button from '../common/Button'
import Spinner from '../common/Spinner'
import EmptyState from '../common/EmptyState'

interface LicenseTableProps {
  licenses: License[]
  isLoading: boolean
  isError: boolean
  onEdit: (license: License) => void
  onToggleStatus: (license: License) => void
  togglingLicenseId: string | null
}

const columns = ['License', 'Tenant', 'Type', 'Plan', 'Expiry Date', 'Status', 'Actions']

function statusTone(status: License['licenseStatus']): 'success' | 'danger' | 'warning' | 'neutral' {
  if (status === 'Active') return 'success'
  if (status === 'Expired') return 'danger'
  if (status === 'Suspended') return 'danger'
  return 'warning'
}

export default function LicenseTable({
  licenses,
  isLoading,
  isError,
  onEdit,
  onToggleStatus,
  togglingLicenseId,
}: LicenseTableProps) {
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
                Couldn't load licenses. Please try again.
              </td>
            </tr>
          )}
          {!isLoading && !isError && licenses.length === 0 && (
            <tr>
              <td colSpan={columns.length}>
                <EmptyState title="No licenses found" description="Try adjusting your search or filters." />
              </td>
            </tr>
          )}
          {!isLoading &&
            !isError &&
            licenses.map((license) => (
              <tr key={license.id} className="border-b border-sap-border last:border-0 hover:bg-sap-bg/60">
                <td className="whitespace-nowrap px-4 py-3 text-sm font-medium text-sap-text">{license.name}</td>
                <td className="whitespace-nowrap px-4 py-3 text-sm text-sap-text-muted">{license.tenantName}</td>
                <td className="whitespace-nowrap px-4 py-3 text-sm text-sap-text-muted">{license.licenseType}</td>
                <td className="whitespace-nowrap px-4 py-3 text-sm text-sap-text-muted">{license.subscriptionPlan}</td>
                <td className="whitespace-nowrap px-4 py-3 text-sm text-sap-text-muted">{license.expiryDate}</td>
                <td className="whitespace-nowrap px-4 py-3 text-sm">
                  <Badge tone={statusTone(license.licenseStatus)} dot>
                    {license.licenseStatus}
                  </Badge>
                </td>
                <td className="whitespace-nowrap px-4 py-3 text-sm">
                  <div className="flex items-center gap-1">
                    <Button variant="ghost" size="sm" onClick={() => onEdit(license)} aria-label="Edit license">
                      <Pencil size={16} />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onToggleStatus(license)}
                      isLoading={togglingLicenseId === license.id}
                      aria-label={license.licenseStatus === 'Active' ? 'Suspend license' : 'Activate license'}
                      className={license.licenseStatus === 'Active' ? 'text-sap-danger' : 'text-sap-success'}
                    >
                      {license.licenseStatus === 'Active' ? <PowerOff size={16} /> : <Power size={16} />}
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
