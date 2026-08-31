import Select from '../common/Select'
import { BUSINESS_TYPE_OPTIONS } from '../../types/company'
import type { CompanyStatus, BusinessType } from '../../types/company'

interface CompanyFiltersProps {
  status: CompanyStatus | 'All'
  businessType: BusinessType | 'All'
  sortBy: 'companyName' | 'createdAt'
  sortDir: 'asc' | 'desc'
  onStatusChange: (status: CompanyStatus | 'All') => void
  onBusinessTypeChange: (businessType: BusinessType | 'All') => void
  onSortChange: (sortBy: 'companyName' | 'createdAt', sortDir: 'asc' | 'desc') => void
}

export default function CompanyFilters({
  status,
  businessType,
  sortBy,
  sortDir,
  onStatusChange,
  onBusinessTypeChange,
  onSortChange,
}: CompanyFiltersProps) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:flex sm:flex-wrap">
      <Select
        aria-label="Filter by status"
        value={status}
        onChange={(e) => onStatusChange(e.target.value as CompanyStatus | 'All')}
        options={[
          { label: 'All Statuses', value: 'All' },
          { label: 'Active', value: 'Active' },
          { label: 'Inactive', value: 'Inactive' },
        ]}
      />
      <Select
        aria-label="Filter by business type"
        value={businessType}
        onChange={(e) => onBusinessTypeChange(e.target.value as BusinessType | 'All')}
        options={[{ label: 'All Types', value: 'All' }, ...BUSINESS_TYPE_OPTIONS.map((t) => ({ label: t, value: t }))]}
      />
      <Select
        aria-label="Sort companies"
        className="col-span-2 sm:col-span-1"
        value={`${sortBy}:${sortDir}`}
        onChange={(e) => {
          const [nextSortBy, nextSortDir] = e.target.value.split(':') as ['companyName' | 'createdAt', 'asc' | 'desc']
          onSortChange(nextSortBy, nextSortDir)
        }}
        options={[
          { label: 'Newest first', value: 'createdAt:desc' },
          { label: 'Oldest first', value: 'createdAt:asc' },
          { label: 'Name A-Z', value: 'companyName:asc' },
          { label: 'Name Z-A', value: 'companyName:desc' },
        ]}
      />
    </div>
  )
}
