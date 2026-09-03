import Select from '../common/Select'
import { FEATURE_CATEGORY_OPTIONS, MODULE_OPTIONS } from '../../types/feature'
import type { FeatureStatus, FeatureCategory, PlatformModule } from '../../types/feature'

interface FeatureFiltersProps {
  status: FeatureStatus | 'All'
  featureCategory: FeatureCategory | 'All'
  module: PlatformModule | 'All'
  onStatusChange: (status: FeatureStatus | 'All') => void
  onFeatureCategoryChange: (featureCategory: FeatureCategory | 'All') => void
  onModuleChange: (module: PlatformModule | 'All') => void
}

export default function FeatureFilters({
  status,
  featureCategory,
  module,
  onStatusChange,
  onFeatureCategoryChange,
  onModuleChange,
}: FeatureFiltersProps) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:flex sm:flex-wrap">
      <Select
        aria-label="Filter by status"
        value={status}
        onChange={(e) => onStatusChange(e.target.value as FeatureStatus | 'All')}
        options={[
          { label: 'All Statuses', value: 'All' },
          { label: 'Active', value: 'Active' },
          { label: 'Disabled', value: 'Disabled' },
          { label: 'Beta', value: 'Beta' },
          { label: 'Deprecated', value: 'Deprecated' },
        ]}
      />
      <Select
        aria-label="Filter by category"
        value={featureCategory}
        onChange={(e) => onFeatureCategoryChange(e.target.value as FeatureCategory | 'All')}
        options={[{ label: 'All Categories', value: 'All' }, ...FEATURE_CATEGORY_OPTIONS.map((c) => ({ label: c, value: c }))]}
      />
      <Select
        aria-label="Filter by module"
        value={module}
        onChange={(e) => onModuleChange(e.target.value as PlatformModule | 'All')}
        options={[{ label: 'All Modules', value: 'All' }, ...MODULE_OPTIONS.map((m) => ({ label: m, value: m }))]}
      />
    </div>
  )
}
