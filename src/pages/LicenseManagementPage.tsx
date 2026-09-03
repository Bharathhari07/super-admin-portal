import { useState } from 'react'
import { Plus } from 'lucide-react'
import Button from '../components/common/Button'
import Pagination from '../components/common/Pagination'
import LicenseSearchBar from '../components/licenses/LicenseSearchBar'
import LicenseFilters from '../components/licenses/LicenseFilters'
import LicenseTable from '../components/licenses/LicenseTable'
import LicenseModal from '../components/licenses/LicenseModal'
import { useLicenses } from '../hooks/queries/useLicenses'
import { useActivateLicense } from '../hooks/mutations/useActivateLicense'
import { useSuspendLicense } from '../hooks/mutations/useSuspendLicense'
import type { License, LicenseStatus, LicenseType, LicenseQueryParams } from '../types/license'

const PAGE_SIZE = 5

export default function LicenseManagementPage() {
  const [search, setSearch] = useState('')
  const [licenseStatus, setLicenseStatus] = useState<LicenseStatus | 'All'>('All')
  const [licenseType, setLicenseType] = useState<LicenseType | 'All'>('All')
  const [tenantId, setTenantId] = useState<string | 'All'>('All')
  const [page, setPage] = useState(1)
  const [modalOpen, setModalOpen] = useState(false)
  const [editingLicense, setEditingLicense] = useState<License | null>(null)

  const queryParams: LicenseQueryParams = { search, licenseStatus, licenseType, tenantId, page, pageSize: PAGE_SIZE }
  const { data, isLoading, isError } = useLicenses(queryParams)
  const activateLicense = useActivateLicense()
  const suspendLicense = useSuspendLicense()

  const togglingLicenseId = activateLicense.isPending
    ? (activateLicense.variables as string)
    : suspendLicense.isPending
      ? (suspendLicense.variables as string)
      : null

  function handleToggleStatus(license: License) {
    if (license.licenseStatus === 'Active') suspendLicense.mutate(license.id)
    else activateLicense.mutate(license.id)
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h2 className="text-xl font-semibold text-sap-text">Subscription & License</h2>
          <p className="text-sm text-sap-text-muted">Manage tenant licenses, usage limits, and module entitlements.</p>
        </div>
        <Button onClick={() => { setEditingLicense(null); setModalOpen(true) }}>
          <Plus size={16} /> Create License
        </Button>
      </div>

      <div className="rounded-xl border border-sap-border bg-sap-surface p-4 shadow-sm">
        <div className="mb-4 flex flex-col justify-between gap-3 xl:flex-row xl:items-center">
          <LicenseSearchBar value={search} onChange={(v) => { setSearch(v); setPage(1) }} />
          <LicenseFilters
            licenseStatus={licenseStatus}
            licenseType={licenseType}
            tenantId={tenantId}
            onStatusChange={(v) => { setLicenseStatus(v); setPage(1) }}
            onTypeChange={(v) => { setLicenseType(v); setPage(1) }}
            onTenantChange={(v) => { setTenantId(v); setPage(1) }}
          />
        </div>

        <LicenseTable
          licenses={data?.data ?? []}
          isLoading={isLoading}
          isError={isError}
          onEdit={(license) => { setEditingLicense(license); setModalOpen(true) }}
          onToggleStatus={handleToggleStatus}
          togglingLicenseId={togglingLicenseId}
        />

        <Pagination page={page} pageSize={PAGE_SIZE} total={data?.total ?? 0} onPageChange={setPage} itemLabel="licenses" />
      </div>

      <LicenseModal
        open={modalOpen}
        license={editingLicense}
        onClose={() => setModalOpen(false)}
        onSaved={() => setModalOpen(false)}
      />
    </div>
  )
}
