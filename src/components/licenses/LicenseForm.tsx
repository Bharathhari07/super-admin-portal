import { useState, type FormEvent } from 'react'
import Input from '../common/Input'
import Select from '../common/Select'
import Button from '../common/Button'
import { useCreateLicense } from '../../hooks/mutations/useCreateLicense'
import { useUpdateLicense } from '../../hooks/mutations/useUpdateLicense'
import { dummyTenants } from '../../data/dummyTenants'
import { LICENSE_TYPE_OPTIONS, SUBSCRIPTION_PLAN_OPTIONS, RENEWAL_TYPE_OPTIONS } from '../../types/license'
import type { License, LicenseType, LicenseStatus, SubscriptionPlan, RenewalType } from '../../types/license'

interface FormState {
  name: string
  licenseType: LicenseType
  licenseStatus: LicenseStatus
  subscriptionPlan: SubscriptionPlan
  tenantId: string
  startDate: string
  expiryDate: string
  gracePeriodDays: string
  renewalType: RenewalType
  renewalReminderDays: string
  maximumUsers: string
  maximumStorageGb: string
  maximumApiRequests: string
  maximumOrganizations: string
  maximumBranches: string
  maximumActiveSessions: string
  hrmsEnabled: boolean
  crmEnabled: boolean
  erpEnabled: boolean
  financeEnabled: boolean
  workflowEnabled: boolean
  aiServicesEnabled: boolean
  mobileAppEnabled: boolean
  apiAccessEnabled: boolean
}

interface FormErrors {
  name?: string
  tenantId?: string
  startDate?: string
  expiryDate?: string
}

function makeEmptyForm(): FormState {
  return {
    name: '',
    licenseType: 'Trial',
    licenseStatus: 'Active',
    subscriptionPlan: 'Basic',
    tenantId: dummyTenants[0]?.id ?? '',
    startDate: '',
    expiryDate: '',
    gracePeriodDays: '7',
    renewalType: 'Manual',
    renewalReminderDays: '15',
    maximumUsers: '25',
    maximumStorageGb: '20',
    maximumApiRequests: '10000',
    maximumOrganizations: '1',
    maximumBranches: '2',
    maximumActiveSessions: '25',
    hrmsEnabled: false,
    crmEnabled: false,
    erpEnabled: false,
    financeEnabled: false,
    workflowEnabled: false,
    aiServicesEnabled: false,
    mobileAppEnabled: false,
    apiAccessEnabled: false,
  }
}

interface LicenseFormProps {
  license: License | null
  onSuccess: () => void
  onCancel: () => void
}

export default function LicenseForm({ license, onSuccess, onCancel }: LicenseFormProps) {
  const [form, setForm] = useState<FormState>(
    license
      ? {
          name: license.name,
          licenseType: license.licenseType,
          licenseStatus: license.licenseStatus,
          subscriptionPlan: license.subscriptionPlan,
          tenantId: license.tenantId,
          startDate: license.startDate,
          expiryDate: license.expiryDate,
          gracePeriodDays: license.gracePeriodDays,
          renewalType: license.renewalType,
          renewalReminderDays: license.renewalReminderDays,
          maximumUsers: license.maximumUsers,
          maximumStorageGb: license.maximumStorageGb,
          maximumApiRequests: license.maximumApiRequests,
          maximumOrganizations: license.maximumOrganizations,
          maximumBranches: license.maximumBranches,
          maximumActiveSessions: license.maximumActiveSessions,
          hrmsEnabled: license.hrmsEnabled,
          crmEnabled: license.crmEnabled,
          erpEnabled: license.erpEnabled,
          financeEnabled: license.financeEnabled,
          workflowEnabled: license.workflowEnabled,
          aiServicesEnabled: license.aiServicesEnabled,
          mobileAppEnabled: license.mobileAppEnabled,
          apiAccessEnabled: license.apiAccessEnabled,
        }
      : makeEmptyForm(),
  )
  const [errors, setErrors] = useState<FormErrors>({})
  const [serverError, setServerError] = useState<string | null>(null)
  const createLicense = useCreateLicense()
  const updateLicense = useUpdateLicense()
  const isPending = createLicense.isPending || updateLicense.isPending

  function updateField<K extends keyof FormState>(key: K, value: FormState[K]) {
    setServerError(null)
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  function validate(): boolean {
    const nextErrors: FormErrors = {}
    if (!form.name.trim()) nextErrors.name = 'License name is required'
    if (!form.tenantId) nextErrors.tenantId = 'Tenant selection is required'
    if (!form.startDate.trim()) nextErrors.startDate = 'Start date is required'
    if (!form.expiryDate.trim()) nextErrors.expiryDate = 'Expiry date is required'
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

    if (license) {
      const { licenseStatus: _status, ...updatePayload } = form
      updateLicense.mutate({ id: license.id, input: updatePayload }, { onSuccess: () => onSuccess(), onError })
    } else {
      createLicense.mutate(form, { onSuccess: () => { setForm(makeEmptyForm()); onSuccess() }, onError })
    }
  }

  const moduleToggles: { key: keyof FormState; label: string }[] = [
    { key: 'hrmsEnabled', label: 'HRMS' },
    { key: 'crmEnabled', label: 'CRM' },
    { key: 'erpEnabled', label: 'ERP' },
    { key: 'financeEnabled', label: 'Finance' },
    { key: 'workflowEnabled', label: 'Workflow' },
    { key: 'aiServicesEnabled', label: 'AI Services' },
    { key: 'mobileAppEnabled', label: 'Mobile Application' },
    { key: 'apiAccessEnabled', label: 'API Access' },
  ]

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <h4 className="mb-3 text-xs font-semibold uppercase tracking-wide text-sap-text-muted">License Information</h4>
        <div className="space-y-4">
          <Input id="name" label="License Name" value={form.name} onChange={(e) => updateField('name', e.target.value)} error={errors.name} />
          <div className="grid grid-cols-2 gap-4">
            <Select id="licenseType" label="License Type" value={form.licenseType} onChange={(e) => updateField('licenseType', e.target.value as LicenseType)} options={LICENSE_TYPE_OPTIONS.map((t) => ({ label: t, value: t }))} />
            <Select id="subscriptionPlan" label="Subscription Plan" value={form.subscriptionPlan} onChange={(e) => updateField('subscriptionPlan', e.target.value as SubscriptionPlan)} options={SUBSCRIPTION_PLAN_OPTIONS.map((p) => ({ label: p, value: p }))} />
          </div>
          <div>
            <Select id="tenantId" label="Tenant" value={form.tenantId} onChange={(e) => updateField('tenantId', e.target.value)} options={dummyTenants.map((t) => ({ label: t.name, value: t.id }))} />
            {errors.tenantId && <p className="mt-1 text-xs text-sap-danger">{errors.tenantId}</p>}
          </div>
          {!license && (
            <Select id="licenseStatus" label="Status" value={form.licenseStatus} onChange={(e) => updateField('licenseStatus', e.target.value as LicenseStatus)} options={[{ label: 'Active', value: 'Active' }, { label: 'Expired', value: 'Expired' }, { label: 'Suspended', value: 'Suspended' }, { label: 'Pending Renewal', value: 'Pending Renewal' }]} />
          )}
        </div>
      </div>

      <div>
        <h4 className="mb-3 text-xs font-semibold uppercase tracking-wide text-sap-text-muted">Renewal Settings</h4>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Input id="startDate" label="Start Date" type="date" value={form.startDate} onChange={(e) => updateField('startDate', e.target.value)} error={errors.startDate} />
            <Input id="expiryDate" label="Expiry Date" type="date" value={form.expiryDate} onChange={(e) => updateField('expiryDate', e.target.value)} error={errors.expiryDate} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Input id="gracePeriodDays" label="Grace Period (days)" type="number" value={form.gracePeriodDays} onChange={(e) => updateField('gracePeriodDays', e.target.value)} />
            <Select id="renewalType" label="Renewal Type" value={form.renewalType} onChange={(e) => updateField('renewalType', e.target.value as RenewalType)} options={RENEWAL_TYPE_OPTIONS.map((r) => ({ label: r, value: r }))} />
          </div>
          <Input id="renewalReminderDays" label="Renewal Reminder (days before expiry)" type="number" value={form.renewalReminderDays} onChange={(e) => updateField('renewalReminderDays', e.target.value)} />
        </div>
      </div>

      <div>
        <h4 className="mb-3 text-xs font-semibold uppercase tracking-wide text-sap-text-muted">Usage Limits</h4>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Input id="maximumUsers" label="Maximum Users" type="number" value={form.maximumUsers} onChange={(e) => updateField('maximumUsers', e.target.value)} />
            <Input id="maximumStorageGb" label="Maximum Storage (GB)" type="number" value={form.maximumStorageGb} onChange={(e) => updateField('maximumStorageGb', e.target.value)} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Input id="maximumApiRequests" label="Maximum API Requests" type="number" value={form.maximumApiRequests} onChange={(e) => updateField('maximumApiRequests', e.target.value)} />
            <Input id="maximumOrganizations" label="Maximum Organizations" type="number" value={form.maximumOrganizations} onChange={(e) => updateField('maximumOrganizations', e.target.value)} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Input id="maximumBranches" label="Maximum Branches (optional)" type="number" value={form.maximumBranches} onChange={(e) => updateField('maximumBranches', e.target.value)} />
            <Input id="maximumActiveSessions" label="Maximum Active Sessions" type="number" value={form.maximumActiveSessions} onChange={(e) => updateField('maximumActiveSessions', e.target.value)} />
          </div>
        </div>
      </div>

      <div>
        <h4 className="mb-3 text-xs font-semibold uppercase tracking-wide text-sap-text-muted">Module Access</h4>
        <div className="flex flex-wrap gap-4">
          {moduleToggles.map(({ key, label }) => (
            <label key={key} className="flex items-center gap-2 text-sm text-sap-text">
              <input
                type="checkbox"
                checked={form[key] as boolean}
                onChange={(e) => updateField(key, e.target.checked as FormState[typeof key])}
                className="h-4 w-4 rounded border-sap-border"
              />
              {label}
            </label>
          ))}
        </div>
      </div>

      {serverError && <p className="text-sm text-sap-danger">{serverError}</p>}

      <div className="flex justify-end gap-2 pt-2">
        <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>
        <Button type="submit" isLoading={isPending}>{license ? 'Update' : 'Save'}</Button>
      </div>
    </form>
  )
}
