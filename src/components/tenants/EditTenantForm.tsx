import { useState, type FormEvent } from 'react'
import Input from '../common/Input'
import Select from '../common/Select'
import Button from '../common/Button'
import { useUpdateTenant } from '../../hooks/mutations/useUpdateTenant'
import { COUNTRY_OPTIONS, TIME_ZONE_OPTIONS, ORGANIZATION_TYPE_OPTIONS } from '../../types/tenant'
import type { Tenant, TenantPlan, OrganizationType } from '../../types/tenant'

interface FormErrors {
  name?: string
  code?: string
  businessRegistrationNumber?: string
  adminName?: string
  adminEmail?: string
}

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

interface EditTenantFormProps {
  tenant: Tenant
  onSuccess: () => void
  onCancel: () => void
}

export default function EditTenantForm({ tenant, onSuccess, onCancel }: EditTenantFormProps) {
  const [form, setForm] = useState({
    name: tenant.name,
    legalBusinessName: tenant.legalBusinessName,
    code: tenant.code,
    businessRegistrationNumber: tenant.businessRegistrationNumber,
    organizationType: tenant.organizationType,
    adminName: tenant.adminName,
    adminEmail: tenant.adminEmail,
    phone: tenant.phone,
    telephone: tenant.telephone,
    website: tenant.website,
    addressLine1: tenant.addressLine1,
    addressLine2: tenant.addressLine2,
    city: tenant.city,
    state: tenant.state,
    country: tenant.country,
    postalCode: tenant.postalCode,
    timeZone: tenant.timeZone,
    plan: tenant.plan,
  })
  const [errors, setErrors] = useState<FormErrors>({})
  const [serverError, setServerError] = useState<string | null>(null)
  const updateTenant = useUpdateTenant()

  function updateField<K extends keyof typeof form>(key: K, value: (typeof form)[K]) {
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

    updateTenant.mutate(
      { id: tenant.id, input: form },
      {
        onSuccess: () => onSuccess(),
        onError: (err) => {
          setServerError(err instanceof Error ? err.message : 'Something went wrong. Please try again.')
        },
      },
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <h4 className="mb-3 text-xs font-semibold uppercase tracking-wide text-sap-text-muted">Tenant Information</h4>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Input id="editTenantName" label="Tenant Name" value={form.name} onChange={(e) => updateField('name', e.target.value)} error={errors.name} />
            <Input id="editLegalBusinessName" label="Legal Business Name" value={form.legalBusinessName} onChange={(e) => updateField('legalBusinessName', e.target.value)} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Input id="editTenantCode" label="Tenant Code" value={form.code} onChange={(e) => updateField('code', e.target.value.toUpperCase())} error={errors.code} />
            <Input id="editBusinessRegistrationNumber" label="Business Registration Number" value={form.businessRegistrationNumber} onChange={(e) => updateField('businessRegistrationNumber', e.target.value)} error={errors.businessRegistrationNumber} />
          </div>
          <Select id="editOrganizationType" label="Organization Type" value={form.organizationType} onChange={(e) => updateField('organizationType', e.target.value as OrganizationType)} options={ORGANIZATION_TYPE_OPTIONS.map((t) => ({ label: t, value: t }))} />
        </div>
      </div>

      <div>
        <h4 className="mb-3 text-xs font-semibold uppercase tracking-wide text-sap-text-muted">Admin & Contact</h4>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Input id="editAdminName" label="Admin Name" value={form.adminName} onChange={(e) => updateField('adminName', e.target.value)} error={errors.adminName} />
            <Input id="editAdminEmail" label="Admin Email" type="email" value={form.adminEmail} onChange={(e) => updateField('adminEmail', e.target.value)} error={errors.adminEmail} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Input id="editPhone" label="Phone" type="tel" value={form.phone} onChange={(e) => updateField('phone', e.target.value)} />
            <Input id="editTelephone" label="Telephone" type="tel" value={form.telephone} onChange={(e) => updateField('telephone', e.target.value)} />
          </div>
          <Input id="editWebsite" label="Website" value={form.website} onChange={(e) => updateField('website', e.target.value)} />
        </div>
      </div>

      <div>
        <h4 className="mb-3 text-xs font-semibold uppercase tracking-wide text-sap-text-muted">Address</h4>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Input id="editAddressLine1" label="Address Line 1" value={form.addressLine1} onChange={(e) => updateField('addressLine1', e.target.value)} />
            <Input id="editAddressLine2" label="Address Line 2" value={form.addressLine2} onChange={(e) => updateField('addressLine2', e.target.value)} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Input id="editCity" label="City" value={form.city} onChange={(e) => updateField('city', e.target.value)} />
            <Input id="editState" label="State" value={form.state} onChange={(e) => updateField('state', e.target.value)} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Select id="editCountry" label="Country" value={form.country} onChange={(e) => updateField('country', e.target.value)} options={COUNTRY_OPTIONS.map((c) => ({ label: c, value: c }))} />
            <Input id="editPostalCode" label="Postal Code" value={form.postalCode} onChange={(e) => updateField('postalCode', e.target.value)} />
          </div>
        </div>
      </div>

      <div>
        <h4 className="mb-3 text-xs font-semibold uppercase tracking-wide text-sap-text-muted">Subscription</h4>
        <div className="grid grid-cols-2 gap-4">
          <Select id="editPlan" label="Subscription" value={form.plan} onChange={(e) => updateField('plan', e.target.value as TenantPlan)} options={[{ label: 'Basic', value: 'Basic' }, { label: 'Pro', value: 'Pro' }, { label: 'Enterprise', value: 'Enterprise' }]} />
          <Select id="editTimeZone" label="Time Zone" value={form.timeZone} onChange={(e) => updateField('timeZone', e.target.value)} options={TIME_ZONE_OPTIONS.map((tz) => ({ label: tz, value: tz }))} />
        </div>
      </div>

      {serverError && <p className="text-sm text-sap-danger">{serverError}</p>}

      <div className="flex justify-end gap-2 pt-2">
        <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>
        <Button type="submit" isLoading={updateTenant.isPending}>Save Changes</Button>
      </div>
    </form>
  )
}
