import Select from '../common/Select'
import { dummyBranches } from '../../data/dummyBranches'
import { LOCATION_TYPE_OPTIONS } from '../../types/location'
import type { LocationStatus, LocationType } from '../../types/location'

interface LocationFiltersProps {
  status: LocationStatus | 'All'
  branchId: string | 'All'
  locationType: LocationType | 'All'
  sortBy: 'name' | 'createdAt'
  sortDir: 'asc' | 'desc'
  onStatusChange: (status: LocationStatus | 'All') => void
  onBranchChange: (branchId: string | 'All') => void
  onLocationTypeChange: (locationType: LocationType | 'All') => void
  onSortChange: (sortBy: 'name' | 'createdAt', sortDir: 'asc' | 'desc') => void
}

export default function LocationFilters({
  status,
  branchId,
  locationType,
  sortBy,
  sortDir,
  onStatusChange,
  onBranchChange,
  onLocationTypeChange,
  onSortChange,
}: LocationFiltersProps) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:flex sm:flex-wrap">
      <Select
        aria-label="Filter by status"
        value={status}
        onChange={(e) => onStatusChange(e.target.value as LocationStatus | 'All')}
        options={[
          { label: 'All Statuses', value: 'All' },
          { label: 'Active', value: 'Active' },
          { label: 'Inactive', value: 'Inactive' },
        ]}
      />
      <Select
        aria-label="Filter by branch"
        value={branchId}
        onChange={(e) => onBranchChange(e.target.value)}
        options={[
          { label: 'All Branches', value: 'All' },
          ...dummyBranches.map((b) => ({ label: b.name, value: b.id })),
        ]}
      />
      <Select
        aria-label="Filter by location type"
        value={locationType}
        onChange={(e) => onLocationTypeChange(e.target.value as LocationType | 'All')}
        options={[{ label: 'All Types', value: 'All' }, ...LOCATION_TYPE_OPTIONS.map((t) => ({ label: t, value: t }))]}
      />
      <Select
        aria-label="Sort locations"
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
