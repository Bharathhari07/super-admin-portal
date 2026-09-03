import Select from '../common/Select'
import { dummyTenants } from '../../data/dummyTenants'
import { LICENSE_TYPE_OPTIONS } from '../../types/license'
import type { LicenseStatus, LicenseType } from '../../types/license'

interface LicenseFiltersProps {
  licenseStatus: LicenseStatus | 'All'
  licenseType: LicenseType | 'All'
  tenantId: string | 'All'
  onStatusChange: (status: LicenseStatus | 'All') => void
  onTypeChange: (type: LicenseType | 'All') => void
  onTenantChange: (tenantId: string | 'All') => void
}

export default function LicenseFilters({
  licenseStatus,
  licenseType,
  tenantId,
  onStatusChange,
  onTypeChange,
  onTenantChange,
}: LicenseFiltersProps) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:flex sm:flex-wrap">
      <Select
        aria-label="Filter by status"
        value={licenseStatus}
        onChange={(e) => onStatusChange(e.target.value as LicenseStatus | 'All')}
        options={[
          { label: 'All Statuses', value: 'All' },
          { label: 'Active', value: 'Active' },
          { label: 'Expired', value: 'Expired' },
          { label: 'Suspended', value: 'Suspended' },
          { label: 'Pending Renewal', value: 'Pending Renewal' },
        ]}
      />
      <Select
        aria-label="Filter by license type"
        value={licenseType}
        onChange={(e) => onTypeChange(e.target.value as LicenseType | 'All')}
        options={[{ label: 'All Types', value: 'All' }, ...LICENSE_TYPE_OPTIONS.map((t) => ({ label: t, value: t }))]}
      />
      <Select
        aria-label="Filter by tenant"
        value={tenantId}
        onChange={(e) => onTenantChange(e.target.value)}
        options={[{ label: 'All Tenants', value: 'All' }, ...dummyTenants.map((t) => ({ label: t.name, value: t.id }))]}
      />
    </div>
  )
}
