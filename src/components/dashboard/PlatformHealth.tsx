import { usePlatformHealth } from '../../hooks/queries/usePlatformHealth'
import Spinner from '../common/Spinner'
import Badge from '../common/Badge'

function healthTone(state: string): 'success' | 'warning' | 'danger' {
  if (state === 'Healthy' || state === 'Connected' || state === 'Running') return 'success'
  if (state === 'Degraded') return 'warning'
  return 'danger'
}

function UsageBar({ label, percent }: { label: string; percent: number }) {
  const tone = percent >= 85 ? 'bg-sap-danger' : percent >= 65 ? 'bg-sap-warning' : 'bg-sap-success'
  return (
    <div>
      <div className="mb-1 flex justify-between text-sm">
        <span className="text-sap-text-muted">{label}</span>
        <span className="font-medium text-sap-text">{percent}%</span>
      </div>
      <div className="h-2 w-full overflow-hidden rounded-full bg-sap-bg">
        <div className={`h-full rounded-full ${tone}`} style={{ width: `${percent}%` }} />
      </div>
    </div>
  )
}

export default function PlatformHealth() {
  const { data, isLoading, isError } = usePlatformHealth()

  return (
    <div className="rounded-xl border border-sap-border bg-sap-surface p-5 shadow-sm">
      <h3 className="mb-4 text-sm font-semibold text-sap-text">Platform Health</h3>

      {isLoading && (
        <div className="flex justify-center py-6">
          <Spinner />
        </div>
      )}

      {isError && <p className="text-sm text-sap-danger">Couldn&apos;t load platform health.</p>}

      {data && (
        <div className="space-y-4">
          <div className="flex flex-wrap gap-2">
            <Badge tone={healthTone(data.apiGateway)} dot>
              API Gateway: {data.apiGateway}
            </Badge>
            <Badge tone={healthTone(data.database)} dot>
              Database: {data.database}
            </Badge>
            <Badge tone={healthTone(data.server)} dot>
              Server: {data.server}
            </Badge>
          </div>
          <div className="space-y-3 pt-1">
            <UsageBar label="Storage" percent={data.storagePercent} />
            <UsageBar label="CPU Usage" percent={data.cpuPercent} />
            <UsageBar label="Memory Usage" percent={data.memoryPercent} />
          </div>
        </div>
      )}
    </div>
  )
}