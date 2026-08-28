import Badge from '../common/Badge'
import type { TenantStatus } from '../../types/tenant'

export default function StatusBadge({ status }: { status: TenantStatus }) {
  return (
    <Badge tone={status === 'Active' ? 'success' : 'danger'} dot>
      {status}
    </Badge>
  )
}