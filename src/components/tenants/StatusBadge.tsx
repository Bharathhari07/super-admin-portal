import Badge from '../common/Badge'
import type { TenantStatus } from '../../types/tenant'

function statusTone(status: TenantStatus): 'success' | 'danger' | 'neutral' | 'warning' {
  if (status === 'Active') return 'success'
  if (status === 'Inactive') return 'danger'
  if (status === 'Suspended') return 'warning'
  return 'neutral'
}

export default function StatusBadge({ status }: { status: TenantStatus }) {
  return (
    <Badge tone={statusTone(status)} dot>
      {status}
    </Badge>
  )
}
