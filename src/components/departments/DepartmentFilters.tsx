import Select from '../common/Select'
import { dummyBusinessUnits } from '../../data/dummyBusinessUnits'
import { DEPARTMENT_TYPE_OPTIONS } from '../../types/department'
import type { DepartmentStatus, DepartmentType } from '../../types/department'

interface DepartmentFiltersProps {
  status: DepartmentStatus | 'All'
  businessUnitId: string | 'All'
  departmentType: DepartmentType | 'All'
  sortBy: 'name' | 'createdAt'
  sortDir: 'asc' | 'desc'
  onStatusChange: (status: DepartmentStatus | 'All') => void
  onBusinessUnitChange: (businessUnitId: string | 'All') => void
  onDepartmentTypeChange: (departmentType: DepartmentType | 'All') => void
  onSortChange: (sortBy: 'name' | 'createdAt', sortDir: 'asc' | 'desc') => void
}

export default function DepartmentFilters({
  status,
  businessUnitId,
  departmentType,
  sortBy,
  sortDir,
  onStatusChange,
  onBusinessUnitChange,
  onDepartmentTypeChange,
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
        aria-label="Filter by type"
        value={departmentType}
        onChange={(e) => onDepartmentTypeChange(e.target.value as DepartmentType | 'All')}
        options={[{ label: 'All Types', value: 'All' }, ...DEPARTMENT_TYPE_OPTIONS.map((t) => ({ label: t, value: t }))]}
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
