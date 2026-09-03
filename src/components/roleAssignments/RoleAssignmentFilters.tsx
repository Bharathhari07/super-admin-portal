import Select from '../common/Select'
import { dummyRoles } from '../../data/dummyRoles'
import type { AssignmentStatus } from '../../types/roleAssignment'

interface RoleAssignmentFiltersProps {
  status: AssignmentStatus | 'All'
  roleId: string | 'All'
  onStatusChange: (status: AssignmentStatus | 'All') => void
  onRoleChange: (roleId: string | 'All') => void
}

export default function RoleAssignmentFilters({
  status,
  roleId,
  onStatusChange,
  onRoleChange,
}: RoleAssignmentFiltersProps) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:flex sm:flex-wrap">
      <Select
        aria-label="Filter by status"
        value={status}
        onChange={(e) => onStatusChange(e.target.value as AssignmentStatus | 'All')}
        options={[
          { label: 'All Statuses', value: 'All' },
          { label: 'Active', value: 'Active' },
          { label: 'Inactive', value: 'Inactive' },
        ]}
      />
      <Select
        aria-label="Filter by role"
        value={roleId}
        onChange={(e) => onRoleChange(e.target.value)}
        options={[
          { label: 'All Roles', value: 'All' },
          ...dummyRoles.map((r) => ({ label: r.name, value: r.id })),
        ]}
      />
    </div>
  )
}
