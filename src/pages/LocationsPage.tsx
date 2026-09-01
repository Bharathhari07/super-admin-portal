import { useState } from 'react'
import { Plus } from 'lucide-react'
import Button from '../components/common/Button'
import Pagination from '../components/common/Pagination'
import LocationSearchBar from '../components/locations/LocationSearchBar'
import LocationFilters from '../components/locations/LocationFilters'
import LocationTable from '../components/locations/LocationTable'
import LocationModal from '../components/locations/LocationModal'
import { useLocations } from '../hooks/queries/useLocations'
import { useActivateLocation } from '../hooks/mutations/useActivateLocation'
import { useDeactivateLocation } from '../hooks/mutations/useDeactivateLocation'
import type { Location, LocationStatus, LocationType, LocationQueryParams } from '../types/location'

const PAGE_SIZE = 5

export default function LocationsPage() {
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState<LocationStatus | 'All'>('All')
  const [branchId, setBranchId] = useState<string | 'All'>('All')
  const [locationType, setLocationType] = useState<LocationType | 'All'>('All')
  const [sortBy, setSortBy] = useState<LocationQueryParams['sortBy']>('createdAt')
  const [sortDir, setSortDir] = useState<LocationQueryParams['sortDir']>('desc')
  const [page, setPage] = useState(1)
  const [modalOpen, setModalOpen] = useState(false)
  const [editingLocation, setEditingLocation] = useState<Location | null>(null)

  const queryParams: LocationQueryParams = { search, status, branchId, locationType, sortBy, sortDir, page, pageSize: PAGE_SIZE }
  const { data, isLoading, isError } = useLocations(queryParams)
  const activateLoc = useActivateLocation()
  const deactivateLoc = useDeactivateLocation()

  const togglingLocationId = activateLoc.isPending
    ? (activateLoc.variables as string)
    : deactivateLoc.isPending
      ? (deactivateLoc.variables as string)
      : null

  function handleToggleStatus(location: Location) {
    if (location.status === 'Active') deactivateLoc.mutate(location.id)
    else activateLoc.mutate(location.id)
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h2 className="text-xl font-semibold text-sap-text">Locations</h2>
          <p className="text-sm text-sap-text-muted">Manage physical sites tied to each branch.</p>
        </div>
        <Button onClick={() => { setEditingLocation(null); setModalOpen(true) }}>
          <Plus size={16} /> Create Location
        </Button>
      </div>

      <div className="rounded-xl border border-sap-border bg-sap-surface p-4 shadow-sm">
        <div className="mb-4 flex flex-col justify-between gap-3 xl:flex-row xl:items-center">
          <LocationSearchBar value={search} onChange={(v) => { setSearch(v); setPage(1) }} />
          <LocationFilters
            status={status}
            branchId={branchId}
            locationType={locationType}
            sortBy={sortBy ?? 'createdAt'}
            sortDir={sortDir ?? 'desc'}
            onStatusChange={(v) => { setStatus(v); setPage(1) }}
            onBranchChange={(v) => { setBranchId(v); setPage(1) }}
            onLocationTypeChange={(v) => { setLocationType(v); setPage(1) }}
            onSortChange={(by, dir) => { setSortBy(by); setSortDir(dir) }}
          />
        </div>

        <LocationTable
          locations={data?.data ?? []}
          isLoading={isLoading}
          isError={isError}
          onEdit={(location) => { setEditingLocation(location); setModalOpen(true) }}
          onToggleStatus={handleToggleStatus}
          togglingLocationId={togglingLocationId}
        />

        <Pagination page={page} pageSize={PAGE_SIZE} total={data?.total ?? 0} onPageChange={setPage} itemLabel="locations" />
      </div>

      <LocationModal
        open={modalOpen}
        location={editingLocation}
        onClose={() => setModalOpen(false)}
        onSaved={() => setModalOpen(false)}
      />
    </div>
  )
}
