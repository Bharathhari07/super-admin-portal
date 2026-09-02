import { useState, useMemo, type FormEvent } from 'react'
import Input from '../common/Input'
import Select from '../common/Select'
import Button from '../common/Button'
import { useCreateBranch } from '../../hooks/mutations/useCreateBranch'
import { useUpdateBranch } from '../../hooks/mutations/useUpdateBranch'
import { dummyCompanies } from '../../data/dummyCompanies'
import { dummyBusinessUnits } from '../../data/dummyBusinessUnits'
import { dummyCostCenters } from '../../data/dummyCostCenters'
import { BRANCH_TYPE_OPTIONS, TIME_ZONE_OPTIONS, WORKING_CALENDAR_OPTIONS } from '../../types/branch'
import type { Branch, BranchStatus, BranchType } from '../../types/branch'

interface FormState {
  companyId: string
  businessUnitId: string
  name: string
  code: string
  branchType: BranchType
  manager: string
  contactEmail: string
  contactNumber: string
  effectiveDate: string
  addressLine1: string
  addressLine2: string
  city: string
  state: string
  country: string
  postalCode: string
  timeZone: string
  workingCalendar: string
  costCenterId: string
  branchCapacity: string
  description: string
  status: BranchStatus
}

interface FormErrors {
  name?: string
  code?: string
  businessUnitId?: string
  manager?: string
  contactEmail?: string
  effectiveDate?: string
}

function makeEmptyForm(): FormState {
  const firstCompany = dummyCompanies[0]
  const firstBU = dummyBusinessUnits.find((u) => u.companyId === firstCompany?.id)
  return {
    companyId: firstCompany?.id ?? '',
    businessUnitId: firstBU?.id ?? '',
    name: '',
    code: '',
    branchType: 'Branch Office',
    manager: '',
    contactEmail: '',
    contactNumber: '',
    effectiveDate: '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: '',
    country: 'India',
    postalCode: '',
    timeZone: 'Asia/Kolkata',
    workingCalendar: 'Standard 5-Day',
    costCenterId: '',
    branchCapacity: '',
    description: '',
    status: 'Active',
  }
}

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

interface BranchFormProps {
  branch: Branch | null
  onSuccess: () => void
  onCancel: () => void
}

export default function BranchForm({ branch, onSuccess, onCancel }: BranchFormProps) {
  const [form, setForm] = useState<FormState>(
    branch
      ? {
          companyId: branch.companyId,
          businessUnitId: branch.businessUnitId,
          name: branch.name,
          code: branch.code,
          branchType: branch.branchType,
          manager: branch.manager,
          contactEmail: branch.contactEmail,
          contactNumber: branch.contactNumber,
          effectiveDate: branch.effectiveDate,
          addressLine1: branch.addressLine1,
          addressLine2: branch.addressLine2,
          city: branch.city,
          state: branch.state,
          country: branch.country,
          postalCode: branch.postalCode,
          timeZone: branch.timeZone,
          workingCalendar: branch.workingCalendar,
          costCenterId: branch.costCenterId,
          branchCapacity: branch.branchCapacity,
          description: branch.description,
          status: branch.status,
        }
      : makeEmptyForm(),
  )
  const [errors, setErrors] = useState<FormErrors>({})
  const [serverError, setServerError] = useState<string | null>(null)
  const createBranch = useCreateBranch()
  const updateBranch = useUpdateBranch()
  const isPending = createBranch.isPending || updateBranch.isPending

  function updateField<K extends keyof FormState>(key: K, value: FormState[K]) {
    setServerError(null)
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  const availableBUs = useMemo(() => dummyBusinessUnits.filter((u) => u.companyId === form.companyId), [form.companyId])
  const availableCostCenters = useMemo(() => dummyCostCenters.filter((c) => c.businessUnitId === form.businessUnitId), [form.businessUnitId])

  function handleCompanyChange(nextCompanyId: string) {
    const fallbackBU = dummyBusinessUnits.find((u) => u.companyId === nextCompanyId)
    setServerError(null)
    setForm((prev) => ({ ...prev, companyId: nextCompanyId, businessUnitId: fallbackBU?.id ?? '', costCenterId: '' }))
  }

  function validate(): boolean {
    const nextErrors: FormErrors = {}
    if (!form.name.trim()) nextErrors.name = 'Branch name is required'
    if (!form.code.trim()) nextErrors.code = 'Branch code is required'
    if (!form.businessUnitId) nextErrors.businessUnitId = 'Business unit selection is required'
    if (!form.manager.trim()) nextErrors.manager = 'Branch manager is required'
    if (!form.contactEmail.trim()) nextErrors.contactEmail = 'Contact email is required'
    else if (!isValidEmail(form.contactEmail)) nextErrors.contactEmail = 'Enter a valid email address'
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

    if (branch) {
      updateBranch.mutate({ id: branch.id, input: form }, { onSuccess: () => onSuccess(), onError })
    } else {
      createBranch.mutate(form, { onSuccess: () => { setForm(makeEmptyForm()); onSuccess() }, onError })
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <h4 className="mb-3 text-xs font-semibold uppercase tracking-wide text-sap-text-muted">Branch Information</h4>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Select id="companyId" label="Company" value={form.companyId} onChange={(e) => handleCompanyChange(e.target.value)} options={dummyCompanies.map((c) => ({ label: c.companyName, value: c.id }))} />
            <div>
              <Select id="businessUnitId" label="Business Unit" value={form.businessUnitId} onChange={(e) => updateField('businessUnitId', e.target.value)} options={availableBUs.map((u) => ({ label: u.name, value: u.id }))} />
              {errors.businessUnitId && <p className="mt-1 text-xs text-sap-danger">{errors.businessUnitId}</p>}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Input id="name" label="Branch Name" value={form.name} onChange={(e) => updateField('name', e.target.value)} error={errors.name} />
            <Input id="code" label="Branch Code" value={form.code} onChange={(e) => updateField('code', e.target.value.toUpperCase())} error={errors.code} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Select id="branchType" label="Branch Type" value={form.branchType} onChange={(e) => updateField('branchType', e.target.value as BranchType)} options={BRANCH_TYPE_OPTIONS.map((t) => ({ label: t, value: t }))} />
            <Select id="status" label="Status" value={form.status} onChange={(e) => updateField('status', e.target.value as BranchStatus)} options={[{ label: 'Active', value: 'Active' }, { label: 'Inactive', value: 'Inactive' }]} />
          </div>
        </div>
      </div>

      <div>
        <h4 className="mb-3 text-xs font-semibold uppercase tracking-wide text-sap-text-muted">Manager & Contact</h4>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Input id="manager" label="Branch Manager" value={form.manager} onChange={(e) => updateField('manager', e.target.value)} error={errors.manager} />
            <Input id="contactEmail" label="Contact Email" type="email" value={form.contactEmail} onChange={(e) => updateField('contactEmail', e.target.value)} error={errors.contactEmail} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Input id="contactNumber" label="Contact Number" type="tel" value={form.contactNumber} onChange={(e) => updateField('contactNumber', e.target.value)} />
            <Input id="effectiveDate" label="Effective Date" type="date" value={form.effectiveDate} onChange={(e) => updateField('effectiveDate', e.target.value)} error={errors.effectiveDate} />
          </div>
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
            <Input id="country" label="Country" value={form.country} onChange={(e) => updateField('country', e.target.value)} />
            <Input id="postalCode" label="Postal Code" value={form.postalCode} onChange={(e) => updateField('postalCode', e.target.value)} />
          </div>
        </div>
      </div>

      <div>
        <h4 className="mb-3 text-xs font-semibold uppercase tracking-wide text-sap-text-muted">Operations</h4>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Select id="timeZone" label="Time Zone" value={form.timeZone} onChange={(e) => updateField('timeZone', e.target.value)} options={TIME_ZONE_OPTIONS.map((t) => ({ label: t, value: t }))} />
            <Select id="workingCalendar" label="Working Calendar" value={form.workingCalendar} onChange={(e) => updateField('workingCalendar', e.target.value)} options={WORKING_CALENDAR_OPTIONS.map((w) => ({ label: w, value: w }))} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Select id="costCenterId" label="Cost Center (optional)" value={form.costCenterId} onChange={(e) => updateField('costCenterId', e.target.value)} options={[{ label: 'None', value: '' }, ...availableCostCenters.map((c) => ({ label: c.name, value: c.id }))]} />
            <Input id="branchCapacity" label="Branch Capacity" type="number" value={form.branchCapacity} onChange={(e) => updateField('branchCapacity', e.target.value)} />
          </div>
          <Input id="description" label="Description" value={form.description} onChange={(e) => updateField('description', e.target.value)} />
        </div>
      </div>

      {serverError && <p className="text-sm text-sap-danger">{serverError}</p>}

      <div className="flex justify-end gap-2 pt-2">
        <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>
        <Button type="submit" isLoading={isPending}>{branch ? 'Update' : 'Save'}</Button>
      </div>
    </form>
  )
}
