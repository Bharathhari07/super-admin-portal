import Modal from '../common/Modal'
import Spinner from '../common/Spinner'
import Button from '../common/Button'
import StatusBadge from './StatusBadge'
import { useTenant } from '../../hooks/queries/useTenant'
import { useTenantStats } from '../../hooks/queries/useTenantStats'
import { useActivateTenant } from '../../hooks/mutations/useActivateTenant'
import { useDeactivateTenant } from '../../hooks/mutations/useDeactivateTenant'
import type { Tenant } from '../../types/tenant'

interface TenantDetailsModalProps {
  tenantId: string | null
  onClose: () => void
  onEdit: (tenant: Tenant) => void
}

export default function TenantDetailsModal({ tenantId, onClose, onEdit }: TenantDetailsModalProps) {
  const { data: tenant, isLoading: tenantLoading } = useTenant(tenantId)
  const { data: stats, isLoading: statsLoading } = useTenantStats(tenantId)
  const activateTenant = useActivateTenant()
  const deactivateTenant = useDeactivateTenant()

  const isLoading = tenantLoading || statsLoading
  const isTogglingStatus = activateTenant.isPending || deactivateTenant.isPending

  function handleToggleStatus() {
    if (!tenant) return
    if (tenant.status === 'Active') {
      deactivateTenant.mutate(tenant.id)
    } else {
      activateTenant.mutate(tenant.id)
    }
  }

  return (
    <Modal open={tenantId !== null} title="Tenant Details" onClose={onClose}>
      {isLoading && (
        <div className="flex justify-center py-10">
          <Spinner />
        </div>
      )}

      {!isLoading && tenant && (
        <div className="space-y-5">
          <div>
            <h3 className="text-lg font-semibold text-sap-text">{tenant.name}</h3>
            <p className="text-sm text-sap-text-muted">{tenant.code}</p>
            <div className="mt-2">
              <StatusBadge status={tenant.status} />
            </div>
          </div>

          <hr className="border-sap-border" />

          <div>
            <h4 className="mb-2 text-xs font-semibold uppercase tracking-wide text-sap-text-muted">
              Tenant Information
            </h4>
            <dl className="grid grid-cols-2 gap-y-2 text-sm">
              <dt className="text-sap-text-muted">Admin</dt>
              <dd className="text-sap-text">{tenant.adminName}</dd>
              <dt className="text-sap-text-muted">Email</dt>
              <dd className="text-sap-text">{tenant.adminEmail}</dd>
              <dt className="text-sap-text-muted">Phone</dt>
              <dd className="text-sap-text">{tenant.phone}</dd>
              <dt className="text-sap-text-muted">Country</dt>
              <dd className="text-sap-text">{tenant.country}</dd>
              <dt className="text-sap-text-muted">Time Zone</dt>
              <dd className="text-sap-text">{tenant.timeZone}</dd>
              <dt className="text-sap-text-muted">Created</dt>
              <dd className="text-sap-text">{tenant.createdAt}</dd>
              <dt className="text-sap-text-muted">Plan</dt>
              <dd className="text-sap-text">{tenant.plan}</dd>
            </dl>
          </div>

          <hr className="border-sap-border" />

          {stats && (
            <div>
              <h4 className="mb-2 text-xs font-semibold uppercase tracking-wide text-sap-text-muted">Statistics</h4>
              <dl className="grid grid-cols-2 gap-y-2 text-sm">
                <dt className="text-sap-text-muted">Users</dt>
                <dd className="text-sap-text">{stats.users}</dd>
                <dt className="text-sap-text-muted">Organizations</dt>
                <dd className="text-sap-text">{stats.organizations}</dd>
                <dt className="text-sap-text-muted">Active Users</dt>
                <dd className="text-sap-text">{stats.activeUsers}</dd>
                <dt className="text-sap-text-muted">Storage</dt>
                <dd className="text-sap-text">{stats.storageUsedPercent}%</dd>
              </dl>
            </div>
          )}

          <hr className="border-sap-border" />

          <div className="flex flex-wrap justify-end gap-2">
            <Button variant="outline" onClick={() => onEdit(tenant)}>
              Edit Tenant
            </Button>
            <Button
              variant={tenant.status === 'Active' ? 'danger' : 'primary'}
              onClick={handleToggleStatus}
              isLoading={isTogglingStatus}
            >
              {tenant.status === 'Active' ? 'Deactivate Tenant' : 'Activate Tenant'}
            </Button>
          </div>
        </div>
      )}
    </Modal>
  )
}