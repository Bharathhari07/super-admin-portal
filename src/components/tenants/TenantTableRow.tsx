import { Eye, Pencil, Power, PowerOff } from 'lucide-react'
import type { Tenant } from '../../types/tenant'
import StatusBadge from './StatusBadge'
import PlanBadge from './PlanBadge'
import Button from '../common/Button'

interface TenantTableRowProps {
  tenant: Tenant
  onView: (tenant: Tenant) => void
  onEdit: (tenant: Tenant) => void
  onToggleStatus: (tenant: Tenant) => void
  isTogglingStatus: boolean
}

export default function TenantTableRow({
  tenant,
  onView,
  onEdit,
  onToggleStatus,
  isTogglingStatus,
}: TenantTableRowProps) {
  return (
    <tr className="border-b border-sap-border last:border-0 hover:bg-sap-bg/60">
      <td className="whitespace-nowrap px-4 py-3 text-sm font-medium text-sap-text">{tenant.name}</td>
      <td className="whitespace-nowrap px-4 py-3 text-sm text-sap-text-muted">{tenant.code}</td>
      <td className="whitespace-nowrap px-4 py-3 text-sm text-sap-text-muted">{tenant.organizationType}</td>
      <td className="whitespace-nowrap px-4 py-3 text-sm text-sap-text-muted">{tenant.adminName}</td>
      <td className="whitespace-nowrap px-4 py-3 text-sm">
        <PlanBadge plan={tenant.plan} />
      </td>
      <td className="whitespace-nowrap px-4 py-3 text-sm text-sap-text-muted">{tenant.users}</td>
      <td className="whitespace-nowrap px-4 py-3 text-sm">
        <StatusBadge status={tenant.status} />
      </td>
      <td className="whitespace-nowrap px-4 py-3 text-sm text-sap-text-muted">{tenant.createdAt}</td>
      <td className="whitespace-nowrap px-4 py-3 text-sm">
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="sm" onClick={() => onView(tenant)} aria-label="View tenant">
            <Eye size={16} />
          </Button>
          <Button variant="ghost" size="sm" onClick={() => onEdit(tenant)} aria-label="Edit tenant">
            <Pencil size={16} />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onToggleStatus(tenant)}
            isLoading={isTogglingStatus}
            aria-label={tenant.status === 'Active' ? 'Deactivate tenant' : 'Activate tenant'}
            className={tenant.status === 'Active' ? 'text-sap-danger' : 'text-sap-success'}
          >
            {tenant.status === 'Active' ? <PowerOff size={16} /> : <Power size={16} />}
          </Button>
        </div>
      </td>
    </tr>
  )
}
