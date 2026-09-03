import Select from '../common/Select'
import { dummyRoles } from '../../data/dummyRoles'
import { ACCESS_SCOPE_OPTIONS } from '../../types/dataPermission'
import type { DataPermissionStatus, AccessScope } from '../../types/dataPermission'

interface DataPermissionFiltersProps {
  status: DataPermissionStatus | 'All'
  roleId: string | 'All'
  accessScope: AccessScope | 'All'
  onStatusChange: (status: DataPermissionStatus | 'All') => void
  onRoleChange: (roleId: string | 'All') => void
  onAccessScopeChange: (accessScope: AccessScope | 'All') => void
}

export default function DataPermissionFilters({
  status,
  roleId,
  accessScope,
  onStatusChange,
  onRoleChange,
  onAccessScopeChange,
}: DataPermissionFiltersProps) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:flex sm:flex-wrap">
      <Select
        aria-label="Filter by status"
        value={status}
        onChange={(e) => onStatusChange(e.target.value as DataPermissionStatus | 'All')}
        options={[
          { label: 'All Statuses', value: 'All' },
          { label: 'Active', value: 'Active' },
          { label: 'Inactive', value: 'Inactive' },
        ]}
      />
      <Select
        aria-label="Filter by role"
        value={roleId}
        onChange={(e) => onRoleChange(e.target.value)}
        options={[{ label: 'All Roles', value: 'All' }, ...dummyRoles.map((r) => ({ label: r.name, value: r.id }))]}
      />
      <Select
        aria-label="Filter by access scope"
        value={accessScope}
        onChange={(e) => onAccessScopeChange(e.target.value as AccessScope | 'All')}
        options={[{ label: 'All Scopes', value: 'All' }, ...ACCESS_SCOPE_OPTIONS.map((s) => ({ label: s, value: s }))]}
      />
    </div>
  )
}
