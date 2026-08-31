import Select from '../common/Select'
import { dummyCompanies } from '../../data/dummyCompanies'
import type { BusinessUnitStatus } from '../../types/businessUnit'

interface BusinessUnitFiltersProps {
  status: BusinessUnitStatus | 'All'
  companyId: string | 'All'
  sortBy: 'name' | 'createdAt'
  sortDir: 'asc' | 'desc'
  onStatusChange: (status: BusinessUnitStatus | 'All') => void
  onCompanyChange: (companyId: string | 'All') => void
  onSortChange: (sortBy: 'name' | 'createdAt', sortDir: 'asc' | 'desc') => void
}

export default function BusinessUnitFilters({
  status,
  companyId,
  sortBy,
  sortDir,
  onStatusChange,
  onCompanyChange,
  onSortChange,
}: BusinessUnitFiltersProps) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:flex sm:flex-wrap">
      <Select
        aria-label="Filter by status"
        value={status}
        onChange={(e) => onStatusChange(e.target.value as BusinessUnitStatus | 'All')}
        options={[
          { label: 'All Statuses', value: 'All' },
          { label: 'Active', value: 'Active' },
          { label: 'Inactive', value: 'Inactive' },
        ]}
      />
      <Select
        aria-label="Filter by company"
        value={companyId}
        onChange={(e) => onCompanyChange(e.target.value)}
        options={[
          { label: 'All Companies', value: 'All' },
          ...dummyCompanies.map((c) => ({ label: c.companyName, value: c.id })),
        ]}
      />
      <Select
        aria-label="Sort business units"
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
