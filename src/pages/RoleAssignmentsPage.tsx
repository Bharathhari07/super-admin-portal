import { useState } from 'react'
import { Plus } from 'lucide-react'
import Button from '../components/common/Button'
import RoleAssignmentSearchBar from '../components/roleAssignments/RoleAssignmentSearchBar'
import RoleAssignmentFilters from '../components/roleAssignments/RoleAssignmentFilters'
import RoleAssignmentTable from '../components/roleAssignments/RoleAssignmentTable'
import RoleAssignmentModal from '../components/roleAssignments/RoleAssignmentModal'
import { useRoleAssignments } from '../hooks/queries/useRoleAssignments'
import { useActivateRoleAssignment } from '../hooks/mutations/useActivateRoleAssignment'
import { useDeactivateRoleAssignment } from '../hooks/mutations/useDeactivateRoleAssignment'
import type { RoleAssignment, AssignmentStatus, RoleAssignmentQueryParams } from '../types/roleAssignment'

export default function RoleAssignmentsPage() {
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState<AssignmentStatus | 'All'>('All')
  const [roleId, setRoleId] = useState<string | 'All'>('All')
  const [modalOpen, setModalOpen] = useState(false)
  const [editingAssignment, setEditingAssignment] = useState<RoleAssignment | null>(null)

  const queryParams: RoleAssignmentQueryParams = { search, status, roleId, page: 1, pageSize: 50 }
  const { data, isLoading, isError } = useRoleAssignments(queryParams)
  const activateAssignment = useActivateRoleAssignment()
  const deactivateAssignment = useDeactivateRoleAssignment()

  const togglingAssignmentId = activateAssignment.isPending
    ? (activateAssignment.variables as string)
    : deactivateAssignment.isPending
      ? (deactivateAssignment.variables as string)
      : null

  function handleToggleStatus(assignment: RoleAssignment) {
    if (assignment.status === 'Active') deactivateAssignment.mutate(assignment.id)
    else activateAssignment.mutate(assignment.id)
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h2 className="text-xl font-semibold text-sap-text">Role-Based Access Control</h2>
          <p className="text-sm text-sap-text-muted">Assign permissions to roles and manage their organizational scope.</p>
        </div>
        <Button onClick={() => { setEditingAssignment(null); setModalOpen(true) }}>
          <Plus size={16} /> Assign Permission
        </Button>
      </div>

      <div className="rounded-xl border border-sap-border bg-sap-surface p-4 shadow-sm">
        <div className="mb-4 flex flex-col justify-between gap-3 xl:flex-row xl:items-center">
          <RoleAssignmentSearchBar value={search} onChange={setSearch} />
          <RoleAssignmentFilters
            status={status}
            roleId={roleId}
            onStatusChange={setStatus}
            onRoleChange={setRoleId}
          />
        </div>

        <RoleAssignmentTable
          assignments={data?.data ?? []}
          isLoading={isLoading}
          isError={isError}
          onEdit={(assignment) => { setEditingAssignment(assignment); setModalOpen(true) }}
          onToggleStatus={handleToggleStatus}
          togglingAssignmentId={togglingAssignmentId}
        />
      </div>

      <RoleAssignmentModal
        open={modalOpen}
        assignment={editingAssignment}
        onClose={() => setModalOpen(false)}
        onSaved={() => setModalOpen(false)}
      />
    </div>
  )
}
