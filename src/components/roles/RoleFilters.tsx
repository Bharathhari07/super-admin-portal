import Select from '../common/Select'
import { ROLE_CATEGORY_OPTIONS } from '../../types/role'
import type { RoleStatus, RoleCategory } from '../../types/role'

interface RoleFiltersProps {
  status: RoleStatus | 'All'
  roleCategory: RoleCategory | 'All'
  sortBy: 'name' | 'createdAt'
  sortDir: 'asc' | 'desc'
  onStatusChange: (status: RoleStatus | 'All') => void
  onRoleCategoryChange: (roleCategory: RoleCategory | 'All') => void
  onSortChange: (sortBy: 'name' | 'createdAt', sortDir: 'asc' | 'desc') => void
}

export default function RoleFilters({
  status,
  roleCategory,
  sortBy,
  sortDir,
  onStatusChange,
  onRoleCategoryChange,
  onSortChange,
}: RoleFiltersProps) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:flex sm:flex-wrap">
      <Select
        aria-label="Filter by status"
        value={status}
        onChange={(e) => onStatusChange(e.target.value as RoleStatus | 'All')}
        options={[
          { label: 'All Statuses', value: 'All' },
          { label: 'Active', value: 'Active' },
          { label: 'Inactive', value: 'Inactive' },
        ]}
      />
      <Select
        aria-label="Filter by category"
        value={roleCategory}
        onChange={(e) => onRoleCategoryChange(e.target.value as RoleCategory | 'All')}
        options={[{ label: 'All Categories', value: 'All' }, ...ROLE_CATEGORY_OPTIONS.map((c) => ({ label: c, value: c }))]}
      />
      <Select
        aria-label="Sort roles"
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
