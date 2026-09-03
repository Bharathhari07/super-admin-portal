import { Pencil, Power, PowerOff } from 'lucide-react'
import type { Feature } from '../../types/feature'
import Badge from '../common/Badge'
import Button from '../common/Button'
import Spinner from '../common/Spinner'
import EmptyState from '../common/EmptyState'

interface FeatureTableProps {
  features: Feature[]
  isLoading: boolean
  isError: boolean
  onEdit: (feature: Feature) => void
  onToggleStatus: (feature: Feature) => void
  togglingFeatureId: string | null
}

const columns = ['Feature', 'Code', 'Module', 'Category', 'Rollout', 'Status', 'Actions']

function statusTone(status: Feature['status']): 'success' | 'danger' | 'warning' | 'neutral' {
  if (status === 'Active') return 'success'
  if (status === 'Disabled') return 'danger'
  if (status === 'Beta') return 'warning'
  return 'neutral'
}

export default function FeatureTable({
  features,
  isLoading,
  isError,
  onEdit,
  onToggleStatus,
  togglingFeatureId,
}: FeatureTableProps) {
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
                Couldn't load features. Please try again.
              </td>
            </tr>
          )}
          {!isLoading && !isError && features.length === 0 && (
            <tr>
              <td colSpan={columns.length}>
                <EmptyState title="No features found" description="Try adjusting your search or filters." />
              </td>
            </tr>
          )}
          {!isLoading &&
            !isError &&
            features.map((feature) => (
              <tr key={feature.id} className="border-b border-sap-border last:border-0 hover:bg-sap-bg/60">
                <td className="whitespace-nowrap px-4 py-3 text-sm font-medium text-sap-text">{feature.name}</td>
                <td className="whitespace-nowrap px-4 py-3 text-sm text-sap-text-muted">{feature.code}</td>
                <td className="whitespace-nowrap px-4 py-3 text-sm text-sap-text-muted">{feature.module}</td>
                <td className="whitespace-nowrap px-4 py-3 text-sm text-sap-text-muted">{feature.featureCategory}</td>
                <td className="whitespace-nowrap px-4 py-3 text-sm text-sap-text-muted">{feature.rolloutPercentage}%</td>
                <td className="whitespace-nowrap px-4 py-3 text-sm">
                  <Badge tone={statusTone(feature.status)} dot>
                    {feature.status}
                  </Badge>
                </td>
                <td className="whitespace-nowrap px-4 py-3 text-sm">
                  <div className="flex items-center gap-1">
                    <Button variant="ghost" size="sm" onClick={() => onEdit(feature)} aria-label="Edit feature">
                      <Pencil size={16} />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onToggleStatus(feature)}
                      isLoading={togglingFeatureId === feature.id}
                      aria-label={feature.status === 'Active' ? 'Disable feature' : 'Activate feature'}
                      className={feature.status === 'Active' ? 'text-sap-danger' : 'text-sap-success'}
                    >
                      {feature.status === 'Active' ? <PowerOff size={16} /> : <Power size={16} />}
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
