import { useState, type FormEvent } from 'react'
import Input from '../common/Input'
import Select from '../common/Select'
import Button from '../common/Button'
import { useCreateTenant } from '../../hooks/mutations/useCreateTenant'
import { COUNTRY_OPTIONS, TIME_ZONE_OPTIONS } from '../../types/tenant'
import type { TenantPlan, TenantStatus } from '../../types/tenant'

interface FormState {
  name: string
  code: string
  adminName: string
  adminEmail: string
  phone: string
  plan: TenantPlan
  country: string
  timeZone: string
  status: TenantStatus
}

interface FormErrors {
  name?: string
  code?: string
  adminName?: string
  adminEmail?: string
}

const emptyForm: FormState = {
  name: '',
  code: '',
  adminName: '',
  adminEmail: '',
  phone: '',
  plan: 'Basic',
  country: 'India',
  timeZone: 'Asia/Kolkata',
  status: 'Active',
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
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        id="tenantName"
        label="Tenant Name"
        value={form.name}
        onChange={(e) => setForm({ ...form, name: e.target.value })}
        error={errors.name}
        placeholder="e.g. Acme Corp"
      />
      <Input
        id="tenantCode"
        label="Tenant Code"
        value={form.code}
        onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase() })}
        error={errors.code}
        placeholder="e.g. ACM001"
      />
      <Input
        id="adminName"
        label="Admin Name"
        value={form.adminName}
        onChange={(e) => setForm({ ...form, adminName: e.target.value })}
        error={errors.adminName}
        placeholder="e.g. John Smith"
      />
      <Input
        id="adminEmail"
        label="Admin Email"
        type="email"
        value={form.adminEmail}
        onChange={(e) => setForm({ ...form, adminEmail: e.target.value })}
        error={errors.adminEmail}
        placeholder="e.g. john@acme.com"
      />
      <Input
        id="phone"
        label="Phone"
        type="tel"
        value={form.phone}
        onChange={(e) => setForm({ ...form, phone: e.target.value })}
        placeholder="e.g. +91 98765 43210"
      />
      <div className="grid grid-cols-2 gap-4">
        <Select
          id="plan"
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
          id="country"
          label="Country"
          value={form.country}
          onChange={(e) => setForm({ ...form, country: e.target.value })}
          options={COUNTRY_OPTIONS.map((c) => ({ label: c, value: c }))}
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <Select
          id="timeZone"
          label="Time Zone"
          value={form.timeZone}
          onChange={(e) => setForm({ ...form, timeZone: e.target.value })}
          options={TIME_ZONE_OPTIONS.map((tz) => ({ label: tz, value: tz }))}
        />
        <Select
          id="status"
          label="Status"
          value={form.status}
          onChange={(e) => setForm({ ...form, status: e.target.value as TenantStatus })}
          options={[
            { label: 'Active', value: 'Active' },
            { label: 'Inactive', value: 'Inactive' },
          ]}
        />
      </div>

      {serverError && <p className="text-sm text-sap-danger">{serverError}</p>}

      <div className="flex justify-end gap-2 pt-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" isLoading={createTenant.isPending}>
          Create Tenant
        </Button>
      </div>
    </form>
  )
}