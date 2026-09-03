import Select from '../common/Select'
import { PERMISSION_CATEGORY_OPTIONS, MODULE_OPTIONS } from '../../types/permission'
import type { PermissionStatus, PermissionCategory, PlatformModule } from '../../types/permission'

interface PermissionFiltersProps {
  status: PermissionStatus | 'All'
  permissionCategory: PermissionCategory | 'All'
  module: PlatformModule | 'All'
  sortBy: 'name' | 'createdAt'
  sortDir: 'asc' | 'desc'
  onStatusChange: (status: PermissionStatus | 'All') => void
  onPermissionCategoryChange: (permissionCategory: PermissionCategory | 'All') => void
  onModuleChange: (module: PlatformModule | 'All') => void
  onSortChange: (sortBy: 'name' | 'createdAt', sortDir: 'asc' | 'desc') => void
}

export default function PermissionFilters({
  status,
  permissionCategory,
  module,
  sortBy,
  sortDir,
  onStatusChange,
  onPermissionCategoryChange,
  onModuleChange,
  onSortChange,
}: PermissionFiltersProps) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:flex sm:flex-wrap">
      <Select
        aria-label="Filter by status"
        value={status}
        onChange={(e) => onStatusChange(e.target.value as PermissionStatus | 'All')}
        options={[
          { label: 'All Statuses', value: 'All' },
          { label: 'Active', value: 'Active' },
          { label: 'Inactive', value: 'Inactive' },
        ]}
      />
      <Select
        aria-label="Filter by category"
        value={permissionCategory}
        onChange={(e) => onPermissionCategoryChange(e.target.value as PermissionCategory | 'All')}
        options={[{ label: 'All Categories', value: 'All' }, ...PERMISSION_CATEGORY_OPTIONS.map((c) => ({ label: c, value: c }))]}
      />
      <Select
        aria-label="Filter by module"
        value={module}
        onChange={(e) => onModuleChange(e.target.value as PlatformModule | 'All')}
        options={[{ label: 'All Modules', value: 'All' }, ...MODULE_OPTIONS.map((m) => ({ label: m, value: m }))]}
      />
      <Select
        aria-label="Sort permissions"
        className="col-span-2 sm:col-span-1"
        value={`${sortBy}:${sortDir}`}
        onChange={(e) => {
          const [nextSortBy, nextSortDir] = e.target.value.split(':') as ['name' | 'createdAt', 'asc' | 'desc']
          onSortChange(nextSortBy, nextSortDir)
        }}
        options={[
          { label: 'Newest first', value: 'createdAt:desc' },
          { label: 'Oldest first', value: 'createdAt:asc' },
          { label: 'Name A-Z', value: 'name:asc' },
          { label: 'Name Z-A', value: 'name:desc' },
        ]}
      />
    </div>
  )
}
