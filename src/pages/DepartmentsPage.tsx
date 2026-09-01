import { useState } from 'react'
import { Plus } from 'lucide-react'
import Button from '../components/common/Button'
import Pagination from '../components/common/Pagination'
import DepartmentSearchBar from '../components/departments/DepartmentSearchBar'
import DepartmentFilters from '../components/departments/DepartmentFilters'
import DepartmentTable from '../components/departments/DepartmentTable'
import DepartmentModal from '../components/departments/DepartmentModal'
import { useDepartments } from '../hooks/queries/useDepartments'
import { useActivateDepartment } from '../hooks/mutations/useActivateDepartment'
import { useDeactivateDepartment } from '../hooks/mutations/useDeactivateDepartment'
import type { Department, DepartmentStatus, DepartmentQueryParams } from '../types/department'

const PAGE_SIZE = 5

export default function DepartmentsPage() {
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState<DepartmentStatus | 'All'>('All')
  const [businessUnitId, setBusinessUnitId] = useState<string | 'All'>('All')
  const [sortBy, setSortBy] = useState<DepartmentQueryParams['sortBy']>('createdAt')
  const [sortDir, setSortDir] = useState<DepartmentQueryParams['sortDir']>('desc')
  const [page, setPage] = useState(1)
  const [modalOpen, setModalOpen] = useState(false)
  const [editingDept, setEditingDept] = useState<Department | null>(null)

  const queryParams: DepartmentQueryParams = { search, status, businessUnitId, sortBy, sortDir, page, pageSize: PAGE_SIZE }
  const { data, isLoading, isError } = useDepartments(queryParams)
  const activateDept = useActivateDepartment()
  const deactivateDept = useDeactivateDepartment()

  const togglingDeptId = activateDept.isPending
    ? (activateDept.variables as string)
    : deactivateDept.isPending
      ? (deactivateDept.variables as string)
      : null

  function handleToggleStatus(dept: Department) {
    if (dept.status === 'Active') deactivateDept.mutate(dept.id)
    else activateDept.mutate(dept.id)
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h2 className="text-xl font-semibold text-sap-text">Departments</h2>
          <p className="text-sm text-sap-text-muted">Manage departments within each business unit.</p>
        </div>
        <Button onClick={() => { setEditingDept(null); setModalOpen(true) }}>
          <Plus size={16} /> Create Department
        </Button>
      </div>

      <div className="rounded-xl border border-sap-border bg-sap-surface p-4 shadow-sm">
        <div className="mb-4 flex flex-col justify-between gap-3 xl:flex-row xl:items-center">
          <DepartmentSearchBar value={search} onChange={(v) => { setSearch(v); setPage(1) }} />
          <DepartmentFilters
            status={status}
            businessUnitId={businessUnitId}
            sortBy={sortBy ?? 'createdAt'}
            sortDir={sortDir ?? 'desc'}
            onStatusChange={(v) => { setStatus(v); setPage(1) }}
            onBusinessUnitChange={(v) => { setBusinessUnitId(v); setPage(1) }}
            onSortChange={(by, dir) => { setSortBy(by); setSortDir(dir) }}
          />
        </div>

        <DepartmentTable
          departments={data?.data ?? []}
          isLoading={isLoading}
          isError={isError}
          onEdit={(dept) => { setEditingDept(dept); setModalOpen(true) }}
          onToggleStatus={handleToggleStatus}
          togglingDeptId={togglingDeptId}
        />

        <Pagination page={page} pageSize={PAGE_SIZE} total={data?.total ?? 0} onPageChange={setPage} itemLabel="departments" />
      </div>

      <DepartmentModal
        open={modalOpen}
        department={editingDept}
        onClose={() => setModalOpen(false)}
        onSaved={() => setModalOpen(false)}
      />
    </div>
  )
}
