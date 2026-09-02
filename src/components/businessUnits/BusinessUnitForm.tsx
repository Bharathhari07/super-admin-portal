import { useState, type FormEvent } from 'react'
import Input from '../common/Input'
import Select from '../common/Select'
import Button from '../common/Button'
import { useCreateBusinessUnit } from '../../hooks/mutations/useCreateBusinessUnit'
import { useUpdateBusinessUnit } from '../../hooks/mutations/useUpdateBusinessUnit'
import { dummyCompanies } from '../../data/dummyCompanies'
import {
  BUSINESS_UNIT_TYPE_OPTIONS,
  CURRENCY_OPTIONS,
  TIME_ZONE_OPTIONS,
  WORKING_CALENDAR_OPTIONS,
  REGION_OPTIONS,
} from '../../types/businessUnit'
import type { BusinessUnit, BusinessUnitStatus, BusinessUnitType } from '../../types/businessUnit'

interface FormState {
  name: string
  code: string
  companyId: string
  parentBusinessUnit: string
  businessUnitType: BusinessUnitType
  head: string
  email: string
  contactNumber: string
  effectiveDate: string
  endDate: string
  region: string
  currency: string
  timeZone: string
  workingCalendar: string
  description: string
  status: BusinessUnitStatus
}

interface FormErrors {
  name?: string
  code?: string
  companyId?: string
  head?: string
  email?: string
  effectiveDate?: string
}

function makeEmptyForm(): FormState {
  return {
    name: '',
    code: '',
    companyId: dummyCompanies[0]?.id ?? '',
    parentBusinessUnit: '',
    businessUnitType: 'Operational',
    head: '',
    email: '',
    contactNumber: '',
    effectiveDate: '',
    endDate: '',
    region: 'South Asia',
    currency: 'INR',
    timeZone: 'Asia/Kolkata',
    workingCalendar: 'Standard 5-Day',
    description: '',
    status: 'Active',
  }
}

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

interface BusinessUnitFormProps {
  unit: BusinessUnit | null
  onSuccess: () => void
  onCancel: () => void
}

export default function BusinessUnitForm({ unit, onSuccess, onCancel }: BusinessUnitFormProps) {
  const [form, setForm] = useState<FormState>(
    unit
      ? {
          name: unit.name,
          code: unit.code,
          companyId: unit.companyId,
          parentBusinessUnit: unit.parentBusinessUnit ?? '',
          businessUnitType: unit.businessUnitType,
          head: unit.head,
          email: unit.email,
          contactNumber: unit.contactNumber,
          effectiveDate: unit.effectiveDate,
          endDate: unit.endDate,
          region: unit.region,
          currency: unit.currency,
          timeZone: unit.timeZone,
          workingCalendar: unit.workingCalendar,
          description: unit.description,
          status: unit.status,
        }
      : makeEmptyForm(),
  )
  const [errors, setErrors] = useState<FormErrors>({})
  const [serverError, setServerError] = useState<string | null>(null)
  const createBU = useCreateBusinessUnit()
  const updateBU = useUpdateBusinessUnit()
  const isPending = createBU.isPending || updateBU.isPending

  function updateField<K extends keyof FormState>(key: K, value: FormState[K]) {
    setServerError(null)
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  function validate(): boolean {
    const nextErrors: FormErrors = {}
    if (!form.name.trim()) nextErrors.name = 'Business unit name is required'
    if (!form.code.trim()) nextErrors.code = 'Business unit code is required'
    if (!form.companyId) nextErrors.companyId = 'Company selection is required'
    if (!form.head.trim()) nextErrors.head = 'Business unit head is required'
    if (!form.email.trim()) nextErrors.email = 'Email address is required'
    else if (!isValidEmail(form.email)) nextErrors.email = 'Enter a valid email address'
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
    const payload = { ...form, parentBusinessUnit: form.parentBusinessUnit || null }

    if (unit) {
      updateBU.mutate({ id: unit.id, input: payload }, { onSuccess: () => onSuccess(), onError })
    } else {
      createBU.mutate(payload, { onSuccess: () => { setForm(makeEmptyForm()); onSuccess() }, onError })
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <h4 className="mb-3 text-xs font-semibold uppercase tracking-wide text-sap-text-muted">Business Unit Information</h4>
        <div className="space-y-4">
          <div>
            <Select
              id="companyId"
              label="Company"
              value={form.companyId}
              onChange={(e) => updateField('companyId', e.target.value)}
              options={dummyCompanies.map((c) => ({ label: c.companyName, value: c.id }))}
            />
            {errors.companyId && <p className="mt-1 text-xs text-sap-danger">{errors.companyId}</p>}
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Input id="name" label="Business Unit Name" value={form.name} onChange={(e) => updateField('name', e.target.value)} error={errors.name} />
            <Input id="code" label="Business Unit Code" value={form.code} onChange={(e) => updateField('code', e.target.value.toUpperCase())} error={errors.code} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Select id="businessUnitType" label="Business Unit Type" value={form.businessUnitType} onChange={(e) => updateField('businessUnitType', e.target.value as BusinessUnitType)} options={BUSINESS_UNIT_TYPE_OPTIONS.map((t) => ({ label: t, value: t }))} />
            <Select id="status" label="Status" value={form.status} onChange={(e) => updateField('status', e.target.value as BusinessUnitStatus)} options={[{ label: 'Active', value: 'Active' }, { label: 'Inactive', value: 'Inactive' }]} />
          </div>
          <Input id="parentBusinessUnit" label="Parent Business Unit (optional)" value={form.parentBusinessUnit} onChange={(e) => updateField('parentBusinessUnit', e.target.value)} />
        </div>
      </div>

      <div>
        <h4 className="mb-3 text-xs font-semibold uppercase tracking-wide text-sap-text-muted">Head & Contact</h4>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Input id="head" label="Business Unit Head" value={form.head} onChange={(e) => updateField('head', e.target.value)} error={errors.head} />
            <Input id="email" label="Email Address" type="email" value={form.email} onChange={(e) => updateField('email', e.target.value)} error={errors.email} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Input id="contactNumber" label="Contact Number" type="tel" value={form.contactNumber} onChange={(e) => updateField('contactNumber', e.target.value)} />
            <Select id="region" label="Region" value={form.region} onChange={(e) => updateField('region', e.target.value)} options={REGION_OPTIONS.map((r) => ({ label: r, value: r }))} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Input id="effectiveDate" label="Effective Date" type="date" value={form.effectiveDate} onChange={(e) => updateField('effectiveDate', e.target.value)} error={errors.effectiveDate} />
            <Input id="endDate" label="End Date (optional)" type="date" value={form.endDate} onChange={(e) => updateField('endDate', e.target.value)} />
          </div>
        </div>
      </div>

      <div>
        <h4 className="mb-3 text-xs font-semibold uppercase tracking-wide text-sap-text-muted">Operational Settings</h4>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Select id="currency" label="Currency" value={form.currency} onChange={(e) => updateField('currency', e.target.value)} options={CURRENCY_OPTIONS.map((c) => ({ label: c, value: c }))} />
            <Select id="timeZone" label="Time Zone" value={form.timeZone} onChange={(e) => updateField('timeZone', e.target.value)} options={TIME_ZONE_OPTIONS.map((t) => ({ label: t, value: t }))} />
          </div>
          <Select id="workingCalendar" label="Working Calendar" value={form.workingCalendar} onChange={(e) => updateField('workingCalendar', e.target.value)} options={WORKING_CALENDAR_OPTIONS.map((w) => ({ label: w, value: w }))} />
          <Input id="description" label="Description" value={form.description} onChange={(e) => updateField('description', e.target.value)} />
        </div>
      </div>

      {serverError && <p className="text-sm text-sap-danger">{serverError}</p>}

      <div className="flex justify-end gap-2 pt-2">
        <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>
        <Button type="submit" isLoading={isPending}>{unit ? 'Update' : 'Save'}</Button>
      </div>
    </form>
  )
}
