import { useState, type FormEvent } from 'react'
import Input from '../common/Input'
import Select from '../common/Select'
import Button from '../common/Button'
import { useCreateFeature } from '../../hooks/mutations/useCreateFeature'
import { useUpdateFeature } from '../../hooks/mutations/useUpdateFeature'
import { FEATURE_CATEGORY_OPTIONS, MODULE_OPTIONS, RELEASE_TYPE_OPTIONS, SUBSCRIPTION_PLAN_OPTIONS } from '../../types/feature'
import type {
  Feature,
  FeatureStatus,
  FeatureCategory,
  PlatformModule,
  ReleaseType,
  DefaultStatus,
  SubscriptionPlan,
} from '../../types/feature'

interface FormState {
  name: string
  code: string
  module: PlatformModule
  featureCategory: FeatureCategory
  status: FeatureStatus
  platformEnabled: boolean
  tenantEnabled: boolean
  organizationEnabled: boolean
  subscriptionPlan: SubscriptionPlan
  featureVersion: string
  rolloutPercentage: string
  releaseType: ReleaseType
  defaultStatus: DefaultStatus
  effectiveDate: string
  expiryDate: string
  remarks: string
}

interface FormErrors {
  name?: string
  code?: string
  featureVersion?: string
  rolloutPercentage?: string
  effectiveDate?: string
}

function makeEmptyForm(): FormState {
  return {
    name: '',
    code: '',
    module: MODULE_OPTIONS[0],
    featureCategory: 'Core',
    status: 'Beta',
    platformEnabled: true,
    tenantEnabled: false,
    organizationEnabled: false,
    subscriptionPlan: 'Basic',
    featureVersion: '0.1.0',
    rolloutPercentage: '0',
    releaseType: 'Beta',
    defaultStatus: 'Disabled',
    effectiveDate: '',
    expiryDate: '',
    remarks: '',
  }
}

interface FeatureFormProps {
  feature: Feature | null
  onSuccess: () => void
  onCancel: () => void
}

export default function FeatureForm({ feature, onSuccess, onCancel }: FeatureFormProps) {
  const [form, setForm] = useState<FormState>(
    feature
      ? {
          name: feature.name,
          code: feature.code,
          module: feature.module,
          featureCategory: feature.featureCategory,
          status: feature.status,
          platformEnabled: feature.platformEnabled,
          tenantEnabled: feature.tenantEnabled,
          organizationEnabled: feature.organizationEnabled,
          subscriptionPlan: feature.subscriptionPlan,
          featureVersion: feature.featureVersion,
          rolloutPercentage: feature.rolloutPercentage,
          releaseType: feature.releaseType,
          defaultStatus: feature.defaultStatus,
          effectiveDate: feature.effectiveDate,
          expiryDate: feature.expiryDate,
          remarks: feature.remarks,
        }
      : makeEmptyForm(),
  )
  const [errors, setErrors] = useState<FormErrors>({})
  const [serverError, setServerError] = useState<string | null>(null)
  const createFeature = useCreateFeature()
  const updateFeature = useUpdateFeature()
  const isPending = createFeature.isPending || updateFeature.isPending

  function updateField<K extends keyof FormState>(key: K, value: FormState[K]) {
    setServerError(null)
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  function validate(): boolean {
    const nextErrors: FormErrors = {}
    if (!form.name.trim()) nextErrors.name = 'Feature name is required'
    if (!form.code.trim()) nextErrors.code = 'Feature code is required'
    if (!form.featureVersion.trim()) nextErrors.featureVersion = 'Feature version is required'
    const rollout = Number(form.rolloutPercentage)
    if (form.rolloutPercentage.trim() === '' || isNaN(rollout) || rollout < 0 || rollout > 100) {
      nextErrors.rolloutPercentage = 'Enter a value between 0 and 100'
    }
    if (!form.effectiveDate.trim()) nextErrors.effectiveDate = 'Effective date is required'
    setErrors(nextErrors)
    return Object.keys(nextErrors).length === 0
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setServerError(null)
    if (!validate()) return

    const onError = (err: unknown) => {
      setServerError(err instanceof Error ? err.message : 'Something went wrong. Please try again.')
    }

    if (feature) {
      const { status: _status, ...updatePayload } = form
      updateFeature.mutate({ id: feature.id, input: updatePayload }, { onSuccess: () => onSuccess(), onError })
    } else {
      createFeature.mutate(form, { onSuccess: () => { setForm(makeEmptyForm()); onSuccess() }, onError })
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <h4 className="mb-3 text-xs font-semibold uppercase tracking-wide text-sap-text-muted">Feature Information</h4>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Input id="name" label="Feature Name" value={form.name} onChange={(e) => updateField('name', e.target.value)} error={errors.name} />
            <Input id="code" label="Feature Code" value={form.code} onChange={(e) => updateField('code', e.target.value.toUpperCase())} error={errors.code} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Select id="module" label="Module" value={form.module} onChange={(e) => updateField('module', e.target.value as PlatformModule)} options={MODULE_OPTIONS.map((m) => ({ label: m, value: m }))} />
            <Select id="featureCategory" label="Feature Category" value={form.featureCategory} onChange={(e) => updateField('featureCategory', e.target.value as FeatureCategory)} options={FEATURE_CATEGORY_OPTIONS.map((c) => ({ label: c, value: c }))} />
          </div>
          {!feature && (
            <Select id="status" label="Status" value={form.status} onChange={(e) => updateField('status', e.target.value as FeatureStatus)} options={[{ label: 'Active', value: 'Active' }, { label: 'Disabled', value: 'Disabled' }, { label: 'Beta', value: 'Beta' }, { label: 'Deprecated', value: 'Deprecated' }]} />
          )}
        </div>
      </div>

      <div>
        <h4 className="mb-3 text-xs font-semibold uppercase tracking-wide text-sap-text-muted">Enablement</h4>
        <div className="space-y-4">
          <div className="flex flex-wrap gap-4">
            <label className="flex items-center gap-2 text-sm text-sap-text">
              <input type="checkbox" checked={form.platformEnabled} onChange={(e) => updateField('platformEnabled', e.target.checked)} className="h-4 w-4 rounded border-sap-border" />
              Platform Enabled
            </label>
            <label className="flex items-center gap-2 text-sm text-sap-text">
              <input type="checkbox" checked={form.tenantEnabled} onChange={(e) => updateField('tenantEnabled', e.target.checked)} className="h-4 w-4 rounded border-sap-border" />
              Tenant Enabled
            </label>
            <label className="flex items-center gap-2 text-sm text-sap-text">
              <input type="checkbox" checked={form.organizationEnabled} onChange={(e) => updateField('organizationEnabled', e.target.checked)} className="h-4 w-4 rounded border-sap-border" />
              Organization Enabled
            </label>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Select id="subscriptionPlan" label="Subscription Plan" value={form.subscriptionPlan} onChange={(e) => updateField('subscriptionPlan', e.target.value as SubscriptionPlan)} options={SUBSCRIPTION_PLAN_OPTIONS.map((p) => ({ label: p, value: p }))} />
            <Input id="featureVersion" label="Feature Version" value={form.featureVersion} onChange={(e) => updateField('featureVersion', e.target.value)} error={errors.featureVersion} placeholder="e.g. 1.0.0" />
          </div>
          <Input id="rolloutPercentage" label="Rollout Percentage" type="number" value={form.rolloutPercentage} onChange={(e) => updateField('rolloutPercentage', e.target.value)} error={errors.rolloutPercentage} />
        </div>
      </div>

      <div>
        <h4 className="mb-3 text-xs font-semibold uppercase tracking-wide text-sap-text-muted">Release</h4>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Select id="releaseType" label="Release Type" value={form.releaseType} onChange={(e) => updateField('releaseType', e.target.value as ReleaseType)} options={RELEASE_TYPE_OPTIONS.map((r) => ({ label: r, value: r }))} />
            <Select id="defaultStatus" label="Default Status" value={form.defaultStatus} onChange={(e) => updateField('defaultStatus', e.target.value as DefaultStatus)} options={[{ label: 'Enabled', value: 'Enabled' }, { label: 'Disabled', value: 'Disabled' }]} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Input id="effectiveDate" label="Effective Date" type="date" value={form.effectiveDate} onChange={(e) => updateField('effectiveDate', e.target.value)} error={errors.effectiveDate} />
            <Input id="expiryDate" label="Expiry Date (optional)" type="date" value={form.expiryDate} onChange={(e) => updateField('expiryDate', e.target.value)} />
          </div>
          <Input id="remarks" label="Remarks (optional)" value={form.remarks} onChange={(e) => updateField('remarks', e.target.value)} />
        </div>
      </div>

      {serverError && <p className="text-sm text-sap-danger">{serverError}</p>}

      <div className="flex justify-end gap-2 pt-2">
        <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>
        <Button type="submit" isLoading={isPending}>{feature ? 'Update' : 'Save'}</Button>
      </div>
    </form>
  )
}
