import { Globe } from 'lucide-react'
import Spinner from '../common/Spinner'
import { useOrgOverview } from '../../hooks/queries/useOrgOverview'

export default function LocationsSummaryCard() {
  const { data, isLoading, isError } = useOrgOverview()

  return (
    <div className="flex items-center gap-4 rounded-xl border border-sap-border bg-sap-surface p-4 shadow-sm">
      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-sap-info-bg text-sap-info">
        <Globe size={20} />
      </div>
      <div className="min-w-0">
        <p className="truncate text-sm text-sap-text-muted">Locations</p>
        {isLoading && <Spinner size={18} />}
        {isError && <p className="text-sm text-sap-danger">-</p>}
        {data && <p className="text-xl font-semibold text-sap-text">{data.stats.totalLocations}</p>}
      </div>
    </div>
  )
}
