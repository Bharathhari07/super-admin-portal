import { useState, type FormEvent } from 'react'
import Input from '../common/Input'
import Select from '../common/Select'
import Button from '../common/Button'
import { useCreateTenant } from '../../hooks/mutations/useCreateTenant'
import { COUNTRY_OPTIONS, TIME_ZONE_OPTIONS, ORGANIZATION_TYPE_OPTIONS } from '../../types/tenant'
import type { TenantPlan, TenantStatus, OrganizationType } from '../../types/tenant'

interface FormState {
  name: string
  legalBusinessName: string
  code: string
  businessRegistrationNumber: string
  organizationType: OrganizationType
  adminName: string
  adminEmail: string
  phone: string
  telephone: string
  website: string
  addressLine1: string
  addressLine2: string
  city: string
  state: string
  country: string
  postalCode: string
  timeZone: string
  plan: TenantPlan
  status: TenantStatus
}

interface FormErrors {
  name?: string
  code?: string
  businessRegistrationNumber?: string
  adminName?: string
  adminEmail?: string
}

const emptyForm: FormState = {
  name: '',
  legalBusinessName: '',
  code: '',
  businessRegistrationNumber: '',
  organizationType: 'Enterprise',
  adminName: '',
  adminEmail: '',
  phone: '',
  telephone: '',
  website: '',
  addressLine1: '',
  addressLine2: '',
  city: '',
  state: '',
  country: 'India',
  postalCode: '',
  timeZone: 'Asia/Kolkata',
  plan: 'Basic',
  status: 'Draft',
}

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

interface CreateTenantFormProps {
  onSuccess: () => void
  onCancel: () => void
}

export default function CreateTenantForm({ onSuccess, onCancel }: CreateTenantFormProps) {
  const [form, setForm] = useState<FormState>(emptyForm)
  const [errors, setErrors] = useState<FormErrors>({})
  const [serverError, setServerError] = useState<string | null>(null)
  const createTenant = useCreateTenant()

  function updateField<K extends keyof FormState>(key: K, value: FormState[K]) {
    setServerError(null)
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  function validate(): boolean {
    const nextErrors: FormErrors = {}
    if (!form.name.trim()) nextErrors.name = 'Tenant name is required'
    if (!form.code.trim()) nextErrors.code = 'Tenant code is required'
    if (!form.businessRegistrationNumber.trim()) nextErrors.businessRegistrationNumber = 'Business registration number is required'
    if (!form.adminName.trim()) nextErrors.adminName = 'Admin name is required'
    if (!form.adminEmail.trim()) nextErrors.adminEmail = 'Admin email is required'
    else if (!isValidEmail(form.adminEmail)) nextErrors.adminEmail = 'Enter a valid email address'

    setErrors(nextErrors)
    return Object.keys(nextErrors).length === 0
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setServerError(null)
    if (!validate()) return

    createTenant.mutate(form, {
      onSuccess: () => {
        setForm(emptyForm)
        onSuccess()
      },
      onError: (err) => {
        setServerError(err instanceof Error ? err.message : 'Something went wrong. Please try again.')
      },
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <h4 className="mb-3 text-xs font-semibold uppercase tracking-wide text-sap-text-muted">Tenant Information</h4>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Input id="tenantName" label="Tenant Name" value={form.name} onChange={(e) => updateField('name', e.target.value)} error={errors.name} placeholder="e.g. Acme Corp" />
            <Input id="legalBusinessName" label="Legal Business Name" value={form.legalBusinessName} onChange={(e) => updateField('legalBusinessName', e.target.value)} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Input id="tenantCode" label="Tenant Code" value={form.code} onChange={(e) => updateField('code', e.target.value.toUpperCase())} error={errors.code} placeholder="e.g. ACM001" />
            <Input id="businessRegistrationNumber" label="Business Registration Number" value={form.businessRegistrationNumber} onChange={(e) => updateField('businessRegistrationNumber', e.target.value)} error={errors.businessRegistrationNumber} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Select id="organizationType" label="Organization Type" value={form.organizationType} onChange={(e) => updateField('organizationType', e.target.value as OrganizationType)} options={ORGANIZATION_TYPE_OPTIONS.map((t) => ({ label: t, value: t }))} />
            <Select id="status" label="Tenant Status" value={form.status} onChange={(e) => updateField('status', e.target.value as TenantStatus)} options={[{ label: 'Draft', value: 'Draft' }, { label: 'Active', value: 'Active' }, { label: 'Suspended', value: 'Suspended' }, { label: 'Inactive', value: 'Inactive' }]} />
          </div>
        </div>
      </div>

      <div>
        <h4 className="mb-3 text-xs font-semibold uppercase tracking-wide text-sap-text-muted">Admin & Contact</h4>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Input id="adminName" label="Admin Name" value={form.adminName} onChange={(e) => updateField('adminName', e.target.value)} error={errors.adminName} placeholder="e.g. John Smith" />
            <Input id="adminEmail" label="Admin Email" type="email" value={form.adminEmail} onChange={(e) => updateField('adminEmail', e.target.value)} error={errors.adminEmail} placeholder="e.g. john@acme.com" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Input id="phone" label="Phone" type="tel" value={form.phone} onChange={(e) => updateField('phone', e.target.value)} />
            <Input id="telephone" label="Telephone" type="tel" value={form.telephone} onChange={(e) => updateField('telephone', e.target.value)} />
          </div>
          <Input id="website" label="Website" value={form.website} onChange={(e) => updateField('website', e.target.value)} />
        </div>
      </div>

      <div>
        <h4 className="mb-3 text-xs font-semibold uppercase tracking-wide text-sap-text-muted">Address</h4>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Input id="addressLine1" label="Address Line 1" value={form.addressLine1} onChange={(e) => updateField('addressLine1', e.target.value)} />
            <Input id="addressLine2" label="Address Line 2" value={form.addressLine2} onChange={(e) => updateField('addressLine2', e.target.value)} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Input id="city" label="City" value={form.city} onChange={(e) => updateField('city', e.target.value)} />
            <Input id="state" label="State" value={form.state} onChange={(e) => updateField('state', e.target.value)} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Select id="country" label="Country" value={form.country} onChange={(e) => updateField('country', e.target.value)} options={COUNTRY_OPTIONS.map((c) => ({ label: c, value: c }))} />
            <Input id="postalCode" label="Postal Code" value={form.postalCode} onChange={(e) => updateField('postalCode', e.target.value)} />
          </div>
        </div>
      </div>

      <div>
        <h4 className="mb-3 text-xs font-semibold uppercase tracking-wide text-sap-text-muted">Subscription</h4>
        <div className="grid grid-cols-2 gap-4">
          <Select id="plan" label="Subscription" value={form.plan} onChange={(e) => updateField('plan', e.target.value as TenantPlan)} options={[{ label: 'Basic', value: 'Basic' }, { label: 'Pro', value: 'Pro' }, { label: 'Enterprise', value: 'Enterprise' }]} />
          <Select id="timeZone" label="Time Zone" value={form.timeZone} onChange={(e) => updateField('timeZone', e.target.value)} options={TIME_ZONE_OPTIONS.map((tz) => ({ label: tz, value: tz }))} />
        </div>
      </div>

      {serverError && <p className="text-sm text-sap-danger">{serverError}</p>}

      <div className="flex justify-end gap-2 pt-2">
        <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>
        <Button type="submit" isLoading={createTenant.isPending}>Create Tenant</Button>
      </div>
    </form>
  )
}
