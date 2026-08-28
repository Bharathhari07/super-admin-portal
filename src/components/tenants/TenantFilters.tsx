import Select from '../common/Select'
import type { TenantStatus, TenantPlan } from '../../types/tenant'

interface TenantFiltersProps {
  status: TenantStatus | 'All'
  plan: TenantPlan | 'All'
  sortBy: 'name' | 'createdAt' | 'users'
  sortDir: 'asc' | 'desc'
  onStatusChange: (status: TenantStatus | 'All') => void
  onPlanChange: (plan: TenantPlan | 'All') => void
  onSortChange: (sortBy: 'name' | 'createdAt' | 'users', sortDir: 'asc' | 'desc') => void
}

export default function TenantFilters({
  status,
  plan,
  sortBy,
  sortDir,
  onStatusChange,
  onPlanChange,
  onSortChange,
}: TenantFiltersProps) {
  return (
    <div className="flex flex-wrap gap-3">
      <Select
        aria-label="Filter by status"
        value={status}
        onChange={(e) => onStatusChange(e.target.value as TenantStatus | 'All')}
        options={[
          { label: 'All Statuses', value: 'All' },
          { label: 'Active', value: 'Active' },
          { label: 'Inactive', value: 'Inactive' },
        ]}
      />
      <Select
        aria-label="Filter by plan"
        value={plan}
        onChange={(e) => onPlanChange(e.target.value as TenantPlan | 'All')}
        options={[
          { label: 'All Plans', value: 'All' },
          { label: 'Basic', value: 'Basic' },
          { label: 'Pro', value: 'Pro' },
          { label: 'Enterprise', value: 'Enterprise' },
        ]}
      />
      <Select
        aria-label="Sort tenants"
        value={`${sortBy}:${sortDir}`}
        onChange={(e) => {
          const [nextSortBy, nextSortDir] = e.target.value.split(':') as [
            'name' | 'createdAt' | 'users',
            'asc' | 'desc',
          ]
          onSortChange(nextSortBy, nextSortDir)
        }}
        options={[
          { label: 'Newest first', value: 'createdAt:desc' },
          { label: 'Oldest first', value: 'createdAt:asc' },
          { label: 'Name A-Z', value: 'name:asc' },
          { label: 'Name Z-A', value: 'name:desc' },
          { label: 'Most users', value: 'users:desc' },
          { label: 'Fewest users', value: 'users:asc' },
        ]}
      />
    </div>
  )
}