import Select from '../common/Select'
import { dummyBusinessUnits } from '../../data/dummyBusinessUnits'
import { BRANCH_TYPE_OPTIONS } from '../../types/branch'
import type { BranchStatus, BranchType } from '../../types/branch'

interface BranchFiltersProps {
  status: BranchStatus | 'All'
  businessUnitId: string | 'All'
  branchType: BranchType | 'All'
  sortBy: 'name' | 'createdAt'
  sortDir: 'asc' | 'desc'
  onStatusChange: (status: BranchStatus | 'All') => void
  onBusinessUnitChange: (businessUnitId: string | 'All') => void
  onBranchTypeChange: (branchType: BranchType | 'All') => void
  onSortChange: (sortBy: 'name' | 'createdAt', sortDir: 'asc' | 'desc') => void
}

export default function BranchFilters({
  status,
  businessUnitId,
  branchType,
  sortBy,
  sortDir,
  onStatusChange,
  onBusinessUnitChange,
  onBranchTypeChange,
  onSortChange,
}: BranchFiltersProps) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:flex sm:flex-wrap">
      <Select
        aria-label="Filter by status"
        value={status}
        onChange={(e) => onStatusChange(e.target.value as BranchStatus | 'All')}
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
        value={branchType}
        onChange={(e) => onBranchTypeChange(e.target.value as BranchType | 'All')}
        options={[{ label: 'All Types', value: 'All' }, ...BRANCH_TYPE_OPTIONS.map((t) => ({ label: t, value: t }))]}
      />
      <Select
        aria-label="Sort branches"
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
