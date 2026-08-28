import { PlusCircle, CheckCircle2, XCircle, Settings2, KeyRound } from 'lucide-react'
import { useRecentActivities } from '../../hooks/queries/useRecentActivities'
import Spinner from '../common/Spinner'
import EmptyState from '../common/EmptyState'
import type { ActivityType } from '../../types/dashboard'

const iconMap: Record<ActivityType, typeof PlusCircle> = {
  tenant_created: PlusCircle,
  tenant_activated: CheckCircle2,
  tenant_deactivated: XCircle,
  tenant_config_updated: Settings2,
  license_renewed: KeyRound,
}

const colorMap: Record<ActivityType, string> = {
  tenant_created: 'text-sap-primary bg-sap-primary/10',
  tenant_activated: 'text-sap-success bg-sap-success-bg',
  tenant_deactivated: 'text-sap-danger bg-sap-danger-bg',
  tenant_config_updated: 'text-sap-info bg-sap-info-bg',
  license_renewed: 'text-sap-warning bg-sap-warning-bg',
}

function timeAgo(iso: string): string {
  const diffMs = Date.now() - new Date(iso).getTime()
  const hours = Math.floor(diffMs / (1000 * 60 * 60))
  if (hours < 1) return 'Just now'
  if (hours < 24) return `${hours}h ago`
  const days = Math.floor(hours / 24)
  return `${days}d ago`
}

export default function RecentActivities() {
  const { data, isLoading, isError } = useRecentActivities()

  return (
    <div className="rounded-xl border border-sap-border bg-sap-surface p-5 shadow-sm">
      <h3 className="mb-4 text-sm font-semibold text-sap-text">Recent Activities</h3>

      {isLoading && (
        <div className="flex justify-center py-8">
          <Spinner />
        </div>
      )}

      {isError && <p className="text-sm text-sap-danger">Couldn&apos;t load recent activities.</p>}

      {data && data.length === 0 && <EmptyState title="No recent activity" />}

      {data && data.length > 0 && (
        <ul className="space-y-3">
          {data.map((activity) => {
            const Icon = iconMap[activity.type]
            return (
              <li key={activity.id} className="flex items-start gap-3">
                <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${colorMap[activity.type]}`}>
                  <Icon size={16} />
                </div>
                <div className="min-w-0">
                  <p className="text-sm text-sap-text">{activity.message}</p>
                  <p className="text-xs text-sap-text-muted">{timeAgo(activity.timestamp)}</p>
                </div>
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}