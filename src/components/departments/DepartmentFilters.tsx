import Select from '../common/Select'
import { dummyBusinessUnits } from '../../data/dummyBusinessUnits'
import type { DepartmentStatus } from '../../types/department'

interface DepartmentFiltersProps {
  status: DepartmentStatus | 'All'
  businessUnitId: string | 'All'
  sortBy: 'name' | 'createdAt'
  sortDir: 'asc' | 'desc'
  onStatusChange: (status: DepartmentStatus | 'All') => void
  onBusinessUnitChange: (businessUnitId: string | 'All') => void
  onSortChange: (sortBy: 'name' | 'createdAt', sortDir: 'asc' | 'desc') => void
}

export default function DepartmentFilters({
  status,
  businessUnitId,
  sortBy,
  sortDir,
  onStatusChange,
  onBusinessUnitChange,
  onSortChange,
}: DepartmentFiltersProps) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:flex sm:flex-wrap">
      <Select
        aria-label="Filter by status"
        value={status}
        onChange={(e) => onStatusChange(e.target.value as DepartmentStatus | 'All')}
        options={[
          { label: 'All Statuses', value: 'All' },
          { label: 'Active', value: 'Active' },
          { label: 'Inactive', value: 'Inactive' },
        ]}
      />
      <Select
        aria-label="Filter by business unit"
        value={businessUnitId}
        onChange={(e) => onBusinessUnitChange(e.target.value)}
        options={[
          { label: 'All Business Units', value: 'All' },
          ...dummyBusinessUnits.map((u) => ({ label: u.name, value: u.id })),
        ]}
      />
      <Select
        aria-label="Sort departments"
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
