import Select from '../common/Select'
import { dummyCompanies } from '../../data/dummyCompanies'
import { ROLE_OPTIONS } from '../../types/user'
import type { UserAccountStatus, UserRole } from '../../types/user'

interface UserFiltersProps {
  status: UserAccountStatus | 'All'
  role: UserRole | 'All'
  companyId: string | 'All'
  sortBy: 'firstName' | 'createdAt'
  sortDir: 'asc' | 'desc'
  onStatusChange: (status: UserAccountStatus | 'All') => void
  onRoleChange: (role: UserRole | 'All') => void
  onCompanyChange: (companyId: string | 'All') => void
  onSortChange: (sortBy: 'firstName' | 'createdAt', sortDir: 'asc' | 'desc') => void
}

export default function UserFilters({
  status,
  role,
  companyId,
  sortBy,
  sortDir,
  onStatusChange,
  onRoleChange,
  onCompanyChange,
  onSortChange,
}: UserFiltersProps) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:flex sm:flex-wrap">
      <Select
        aria-label="Filter by status"
        value={status}
        onChange={(e) => onStatusChange(e.target.value as UserAccountStatus | 'All')}
        options={[
          { label: 'All Statuses', value: 'All' },
          { label: 'Active', value: 'Active' },
          { label: 'Inactive', value: 'Inactive' },
          { label: 'Locked', value: 'Locked' },
        ]}
      />
      <Select
        aria-label="Filter by role"
        value={role}
        onChange={(e) => onRoleChange(e.target.value as UserRole | 'All')}
        options={[{ label: 'All Roles', value: 'All' }, ...ROLE_OPTIONS.map((r) => ({ label: r, value: r }))]}
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
        aria-label="Sort users"
        className="col-span-2 sm:col-span-1"
        value={`${sortBy}:${sortDir}`}
        onChange={(e) => {
          const [nextSortBy, nextSortDir] = e.target.value.split(':') as ['firstName' | 'createdAt', 'asc' | 'desc']
          onSortChange(nextSortBy, nextSortDir)
        }}
        options={[
          { label: 'Newest first', value: 'createdAt:desc' },
          { label: 'Oldest first', value: 'createdAt:asc' },
          { label: 'Name A-Z', value: 'firstName:asc' },
          { label: 'Name Z-A', value: 'firstName:desc' },
        ]}
      />
    </div>
  )
}
