import Select from '../common/Select'
import { dummyBusinessUnits } from '../../data/dummyBusinessUnits'
import type { CostCenterStatus } from '../../types/costCenter'

interface CostCenterFiltersProps {
  status: CostCenterStatus | 'All'
  businessUnitId: string | 'All'
  sortBy: 'name' | 'createdAt' | 'budgetAllocation'
  sortDir: 'asc' | 'desc'
  onStatusChange: (status: CostCenterStatus | 'All') => void
  onBusinessUnitChange: (businessUnitId: string | 'All') => void
  onSortChange: (sortBy: 'name' | 'createdAt' | 'budgetAllocation', sortDir: 'asc' | 'desc') => void
}

export default function CostCenterFilters({
  status,
  businessUnitId,
  sortBy,
  sortDir,
  onStatusChange,
  onBusinessUnitChange,
  onSortChange,
}: CostCenterFiltersProps) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:flex sm:flex-wrap">
      <Select
        aria-label="Filter by status"
        value={status}
        onChange={(e) => onStatusChange(e.target.value as CostCenterStatus | 'All')}
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
        aria-label="Sort cost centers"
        className="col-span-2 sm:col-span-1"
        value={`${sortBy}:${sortDir}`}
        onChange={(e) => {
          const [nextSortBy, nextSortDir] = e.target.value.split(':') as ['name' | 'createdAt' | 'budgetAllocation', 'asc' | 'desc']
          onSortChange(nextSortBy, nextSortDir)
        }}
        options={[
          { label: 'Newest first', value: 'createdAt:desc' },
          { label: 'Oldest first', value: 'createdAt:asc' },
          { label: 'Name A-Z', value: 'name:asc' },
          { label: 'Name Z-A', value: 'name:desc' },
          { label: 'Highest budget', value: 'budgetAllocation:desc' },
          { label: 'Lowest budget', value: 'budgetAllocation:asc' },
        ]}
      />
    </div>
  )
}
