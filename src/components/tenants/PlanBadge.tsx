import Badge from '../common/Badge'
import type { TenantPlan } from '../../types/tenant'

export default function PlanBadge({ plan }: { plan: TenantPlan }) {
  const tone = plan === 'Basic' ? 'neutral' : plan === 'Pro' ? 'info' : 'warning'
  return <Badge tone={tone}>{plan}</Badge>
}