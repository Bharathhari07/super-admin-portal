import { useState } from 'react'
import { Plus } from 'lucide-react'
import Button from '../components/common/Button'
import Pagination from '../components/common/Pagination'
import CompanySearchBar from '../components/companies/CompanySearchBar'
import CompanyFilters from '../components/companies/CompanyFilters'
import CompanyTable from '../components/companies/CompanyTable'
import CompanyModal from '../components/companies/CompanyModal'
import { useCompanies } from '../hooks/queries/useCompanies'
import { useActivateCompany } from '../hooks/mutations/useActivateCompany'
import { useDeactivateCompany } from '../hooks/mutations/useDeactivateCompany'
import type { Company, CompanyStatus, BusinessType, CompanyQueryParams } from '../types/company'

const PAGE_SIZE = 5

export default function CompanySetupPage() {
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState<CompanyStatus | 'All'>('All')
  const [businessType, setBusinessType] = useState<BusinessType | 'All'>('All')
  const [sortBy, setSortBy] = useState<CompanyQueryParams['sortBy']>('createdAt')
  const [sortDir, setSortDir] = useState<CompanyQueryParams['sortDir']>('desc')
  const [page, setPage] = useState(1)
  const [modalOpen, setModalOpen] = useState(false)
  const [editingCompany, setEditingCompany] = useState<Company | null>(null)

  const queryParams: CompanyQueryParams = { search, status, businessType, sortBy, sortDir, page, pageSize: PAGE_SIZE }
  const { data, isLoading, isError } = useCompanies(queryParams)
  const activateCompany = useActivateCompany()
  const deactivateCompany = useDeactivateCompany()

  const togglingCompanyId = activateCompany.isPending
    ? (activateCompany.variables as string)
    : deactivateCompany.isPending
      ? (deactivateCompany.variables as string)
      : null

  function handleToggleStatus(company: Company) {
    if (company.status === 'Active') deactivateCompany.mutate(company.id)
    else activateCompany.mutate(company.id)
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h2 className="text-xl font-semibold text-sap-text">Company Setup</h2>
          <p className="text-sm text-sap-text-muted">Register and manage organization profiles on the platform.</p>
        </div>
        <Button onClick={() => { setEditingCompany(null); setModalOpen(true) }}>
          <Plus size={16} /> Create Company
        </Button>
      </div>

      <div className="rounded-xl border border-sap-border bg-sap-surface p-4 shadow-sm">
        <div className="mb-4 flex flex-col justify-between gap-3 xl:flex-row xl:items-center">
          <CompanySearchBar value={search} onChange={(v) => { setSearch(v); setPage(1) }} />
          <CompanyFilters
            status={status}
            businessType={businessType}
            sortBy={sortBy ?? 'createdAt'}
            sortDir={sortDir ?? 'desc'}
            onStatusChange={(v) => { setStatus(v); setPage(1) }}
            onBusinessTypeChange={(v) => { setBusinessType(v); setPage(1) }}
            onSortChange={(by, dir) => { setSortBy(by); setSortDir(dir) }}
          />
        </div>

        <CompanyTable
          companies={data?.data ?? []}
          isLoading={isLoading}
          isError={isError}
          onEdit={(company) => { setEditingCompany(company); setModalOpen(true) }}
          onToggleStatus={handleToggleStatus}
          togglingCompanyId={togglingCompanyId}
        />

        <Pagination page={page} pageSize={PAGE_SIZE} total={data?.total ?? 0} onPageChange={setPage} itemLabel="companies" />
      </div>

      <CompanyModal
        open={modalOpen}
        company={editingCompany}
        onClose={() => setModalOpen(false)}
        onSaved={() => setModalOpen(false)}
      />
    </div>
  )
}