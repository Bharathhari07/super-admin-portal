import { useState, type FormEvent } from 'react'
import Input from '../common/Input'
import Select from '../common/Select'
import Button from '../common/Button'
import { useUpdateTenant } from '../../hooks/mutations/useUpdateTenant'
import { COUNTRY_OPTIONS, TIME_ZONE_OPTIONS } from '../../types/tenant'
import type { Tenant, TenantPlan } from '../../types/tenant'

interface FormErrors {
  name?: string
  code?: string
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
    code: tenant.code,
    adminName: tenant.adminName,
    adminEmail: tenant.adminEmail,
    phone: tenant.phone,
    plan: tenant.plan,
    country: tenant.country,
    timeZone: tenant.timeZone,
  })
  const [errors, setErrors] = useState<FormErrors>({})
  const [serverError, setServerError] = useState<string | null>(null)
  const updateTenant = useUpdateTenant()

  function validate(): boolean {
    const nextErrors: FormErrors = {}
    if (!form.name.trim()) nextErrors.name = 'Tenant name is required'
    if (!form.code.trim()) nextErrors.code = 'Tenant code is required'
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
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        id="editTenantName"
        label="Tenant Name"
        value={form.name}
        onChange={(e) => setForm({ ...form, name: e.target.value })}
        error={errors.name}
      />
      <Input
        id="editTenantCode"
        label="Tenant Code"
        value={form.code}
        onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase() })}
        error={errors.code}
      />
      <Input
        id="editAdminName"
        label="Admin Name"
        value={form.adminName}
        onChange={(e) => setForm({ ...form, adminName: e.target.value })}
        error={errors.adminName}
      />
      <Input
        id="editAdminEmail"
        label="Admin Email"
        type="email"
        value={form.adminEmail}
        onChange={(e) => setForm({ ...form, adminEmail: e.target.value })}
        error={errors.adminEmail}
      />
      <Input
        id="editPhone"
        label="Phone"
        type="tel"
        value={form.phone}
        onChange={(e) => setForm({ ...form, phone: e.target.value })}
      />
      <div className="grid grid-cols-2 gap-4">
        <Select
          id="editPlan"
          label="Subscription"
          value={form.plan}
          onChange={(e) => setForm({ ...form, plan: e.target.value as TenantPlan })}
          options={[
            { label: 'Basic', value: 'Basic' },
            { label: 'Pro', value: 'Pro' },
            { label: 'Enterprise', value: 'Enterprise' },
          ]}
        />
        <Select
          id="editCountry"
          label="Country"
          value={form.country}
          onChange={(e) => setForm({ ...form, country: e.target.value })}
          options={COUNTRY_OPTIONS.map((c) => ({ label: c, value: c }))}
        />
      </div>
      <Select
        id="editTimeZone"
        label="Time Zone"
        value={form.timeZone}
        onChange={(e) => setForm({ ...form, timeZone: e.target.value })}
        options={TIME_ZONE_OPTIONS.map((tz) => ({ label: tz, value: tz }))}
      />

      {serverError && <p className="text-sm text-sap-danger">{serverError}</p>}

      <div className="flex justify-end gap-2 pt-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" isLoading={updateTenant.isPending}>
          Save Changes
        </Button>
      </div>
    </form>
  )
}