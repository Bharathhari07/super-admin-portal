import { useState } from 'react'
import { Plus } from 'lucide-react'
import Button from '../components/common/Button'
import Pagination from '../components/common/Pagination'
import FeatureSearchBar from '../components/features/FeatureSearchBar'
import FeatureFilters from '../components/features/FeatureFilters'
import FeatureTable from '../components/features/FeatureTable'
import FeatureModal from '../components/features/FeatureModal'
import { useFeatures } from '../hooks/queries/useFeatures'
import { useActivateFeature } from '../hooks/mutations/useActivateFeature'
import { useDisableFeature } from '../hooks/mutations/useDisableFeature'
import type { Feature, FeatureStatus, FeatureCategory, PlatformModule, FeatureQueryParams } from '../types/feature'

const PAGE_SIZE = 5

export default function FeatureManagementPage() {
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState<FeatureStatus | 'All'>('All')
  const [featureCategory, setFeatureCategory] = useState<FeatureCategory | 'All'>('All')
  const [module, setModule] = useState<PlatformModule | 'All'>('All')
  const [page, setPage] = useState(1)
  const [modalOpen, setModalOpen] = useState(false)
  const [editingFeature, setEditingFeature] = useState<Feature | null>(null)

  const queryParams: FeatureQueryParams = { search, status, featureCategory, module, page, pageSize: PAGE_SIZE }
  const { data, isLoading, isError } = useFeatures(queryParams)
  const activateFeature = useActivateFeature()
  const disableFeature = useDisableFeature()

  const togglingFeatureId = activateFeature.isPending
    ? (activateFeature.variables as string)
    : disableFeature.isPending
      ? (disableFeature.variables as string)
      : null

  function handleToggleStatus(feature: Feature) {
    if (feature.status === 'Active') disableFeature.mutate(feature.id)
    else activateFeature.mutate(feature.id)
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h2 className="text-xl font-semibold text-sap-text">Feature Management</h2>
          <p className="text-sm text-sap-text-muted">Control feature rollout across the platform, tenants, and subscription plans.</p>
        </div>
        <Button onClick={() => { setEditingFeature(null); setModalOpen(true) }}>
          <Plus size={16} /> Create Feature
        </Button>
      </div>

      <div className="rounded-xl border border-sap-border bg-sap-surface p-4 shadow-sm">
        <div className="mb-4 flex flex-col justify-between gap-3 xl:flex-row xl:items-center">
          <FeatureSearchBar value={search} onChange={(v) => { setSearch(v); setPage(1) }} />
          <FeatureFilters
            status={status}
            featureCategory={featureCategory}
            module={module}
            onStatusChange={(v) => { setStatus(v); setPage(1) }}
            onFeatureCategoryChange={(v) => { setFeatureCategory(v); setPage(1) }}
            onModuleChange={(v) => { setModule(v); setPage(1) }}
          />
        </div>

        <FeatureTable
          features={data?.data ?? []}
          isLoading={isLoading}
          isError={isError}
          onEdit={(feature) => { setEditingFeature(feature); setModalOpen(true) }}
          onToggleStatus={handleToggleStatus}
          togglingFeatureId={togglingFeatureId}
        />

        <Pagination page={page} pageSize={PAGE_SIZE} total={data?.total ?? 0} onPageChange={setPage} itemLabel="features" />
      </div>

      <FeatureModal
        open={modalOpen}
        feature={editingFeature}
        onClose={() => setModalOpen(false)}
        onSaved={() => setModalOpen(false)}
      />
    </div>
  )
}
