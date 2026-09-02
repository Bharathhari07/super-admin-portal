import { Pencil, Power, PowerOff } from 'lucide-react'
import type { Location } from '../../types/location'
import Badge from '../common/Badge'
import Button from '../common/Button'
import Spinner from '../common/Spinner'
import EmptyState from '../common/EmptyState'

interface LocationTableProps {
  locations: Location[]
  isLoading: boolean
  isError: boolean
  onEdit: (location: Location) => void
  onToggleStatus: (location: Location) => void
  togglingLocationId: string | null
}

const columns = ['Location', 'Code', 'Type', 'Manager', 'City', 'Status', 'Actions']

export default function LocationTable({
  locations,
  isLoading,
  isError,
  onEdit,
  onToggleStatus,
  togglingLocationId,
}: LocationTableProps) {
  return (
    <div className="overflow-x-auto sap-scroll">
      <table className="w-full min-w-[760px] border-collapse">
        <thead>
          <tr className="border-b border-sap-border bg-sap-bg/60 text-left">
            {columns.map((col) => (
              <th key={col} className="whitespace-nowrap px-4 py-3 text-xs font-semibold uppercase tracking-wide text-sap-text-muted">
                {col}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {isLoading && (
            <tr>
              <td colSpan={columns.length} className="py-10">
                <div className="flex justify-center">
                  <Spinner />
                </div>
              </td>
            </tr>
          )}
          {isError && !isLoading && (
            <tr>
              <td colSpan={columns.length} className="py-10 text-center text-sm text-sap-danger">
                Couldn't load locations. Please try again.
              </td>
            </tr>
          )}
          {!isLoading && !isError && locations.length === 0 && (
            <tr>
              <td colSpan={columns.length}>
                <EmptyState title="No locations found" description="Try adjusting your search or filters." />
              </td>
            </tr>
          )}
          {!isLoading &&
            !isError &&
            locations.map((location) => (
              <tr key={location.id} className="border-b border-sap-border last:border-0 hover:bg-sap-bg/60">
                <td className="whitespace-nowrap px-4 py-3 text-sm font-medium text-sap-text">{location.name}</td>
                <td className="whitespace-nowrap px-4 py-3 text-sm text-sap-text-muted">{location.code}</td>
                <td className="whitespace-nowrap px-4 py-3 text-sm text-sap-text-muted">{location.locationType}</td>
                <td className="whitespace-nowrap px-4 py-3 text-sm text-sap-text-muted">{location.locationManager}</td>
                <td className="whitespace-nowrap px-4 py-3 text-sm text-sap-text-muted">{location.city}, {location.country}</td>
                <td className="whitespace-nowrap px-4 py-3 text-sm">
                  <Badge tone={location.status === 'Active' ? 'success' : 'danger'} dot>
                    {location.status}
                  </Badge>
                </td>
                <td className="whitespace-nowrap px-4 py-3 text-sm">
                  <div className="flex items-center gap-1">
                    <Button variant="ghost" size="sm" onClick={() => onEdit(location)} aria-label="Edit location">
                      <Pencil size={16} />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onToggleStatus(location)}
                      isLoading={togglingLocationId === location.id}
                      aria-label={location.status === 'Active' ? 'Deactivate location' : 'Activate location'}
                      className={location.status === 'Active' ? 'text-sap-danger' : 'text-sap-success'}
                    >
                      {location.status === 'Active' ? <PowerOff size={16} /> : <Power size={16} />}
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  )
}
