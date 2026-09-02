import { useState, useMemo, type FormEvent } from 'react'
import Input from '../common/Input'
import Select from '../common/Select'
import Button from '../common/Button'
import { useCreateDepartment } from '../../hooks/mutations/useCreateDepartment'
import { useUpdateDepartment } from '../../hooks/mutations/useUpdateDepartment'
import { dummyCompanies } from '../../data/dummyCompanies'
import { dummyBusinessUnits } from '../../data/dummyBusinessUnits'
import { dummyBranches } from '../../data/dummyBranches'
import { dummyCostCenters } from '../../data/dummyCostCenters'
import { DEPARTMENT_TYPE_OPTIONS, WORKING_CALENDAR_OPTIONS } from '../../types/department'
import type { Department, DepartmentStatus, DepartmentType } from '../../types/department'

interface FormState {
  companyId: string
  businessUnitId: string
  parentDepartment: string
  name: string
  code: string
  departmentType: DepartmentType
  head: string
  deputyHead: string
  contactEmail: string
  contactNumber: string
  effectiveDate: string
  endDate: string
  costCenterId: string
  branchId: string
  locationId: string
  workingCalendar: string
  description: string
  status: DepartmentStatus
}

interface FormErrors {
  name?: string
  code?: string
  businessUnitId?: string
  head?: string
  effectiveDate?: string
}

function makeEmptyForm(): FormState {
  const firstCompany = dummyCompanies[0]
  const firstBU = dummyBusinessUnits.find((u) => u.companyId === firstCompany?.id)
  return {
    companyId: firstCompany?.id ?? '',
    businessUnitId: firstBU?.id ?? '',
    parentDepartment: '',
    name: '',
    code: '',
    departmentType: 'Functional',
    head: '',
    deputyHead: '',
    contactEmail: '',
    contactNumber: '',
    effectiveDate: '',
    endDate: '',
    costCenterId: '',
    branchId: '',
    locationId: '',
    workingCalendar: 'Standard 5-Day',
    description: '',
    status: 'Active',
  }
}

interface DepartmentFormProps {
  department: Department | null
  onSuccess: () => void
  onCancel: () => void
}

export default function DepartmentForm({ department, onSuccess, onCancel }: DepartmentFormProps) {
  const [form, setForm] = useState<FormState>(
    department
      ? {
          companyId: department.companyId,
          businessUnitId: department.businessUnitId,
          parentDepartment: department.parentDepartment ?? '',
          name: department.name,
          code: department.code,
          departmentType: department.departmentType,
          head: department.head,
          deputyHead: department.deputyHead,
          contactEmail: department.contactEmail,
          contactNumber: department.contactNumber,
          effectiveDate: department.effectiveDate,
          endDate: department.endDate,
          costCenterId: department.costCenterId,
          branchId: department.branchId,
          locationId: department.locationId,
          workingCalendar: department.workingCalendar,
          description: department.description,
          status: department.status,
        }
      : makeEmptyForm(),
  )
  const [errors, setErrors] = useState<FormErrors>({})
  const [serverError, setServerError] = useState<string | null>(null)
  const createDept = useCreateDepartment()
  const updateDept = useUpdateDepartment()
  const isPending = createDept.isPending || updateDept.isPending

  function updateField<K extends keyof FormState>(key: K, value: FormState[K]) {
    setServerError(null)
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  const availableBUs = useMemo(() => dummyBusinessUnits.filter((u) => u.companyId === form.companyId), [form.companyId])
  const availableBranches = useMemo(() => dummyBranches.filter((b) => b.businessUnitId === form.businessUnitId), [form.businessUnitId])
  const availableCostCenters = useMemo(() => dummyCostCenters.filter((c) => c.businessUnitId === form.businessUnitId), [form.businessUnitId])

  function handleCompanyChange(nextCompanyId: string) {
    const fallbackBU = dummyBusinessUnits.find((u) => u.companyId === nextCompanyId)
    setServerError(null)
    setForm((prev) => ({ ...prev, companyId: nextCompanyId, businessUnitId: fallbackBU?.id ?? '', branchId: '', costCenterId: '' }))
  }

  function validate(): boolean {
    const nextErrors: FormErrors = {}
    if (!form.name.trim()) nextErrors.name = 'Department name is required'
    if (!form.code.trim()) nextErrors.code = 'Department code is required'
    if (!form.businessUnitId) nextErrors.businessUnitId = 'Business unit selection is required'
    if (!form.head.trim()) nextErrors.head = 'Department head is required'
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
    const payload = { ...form, parentDepartment: form.parentDepartment || null }

    if (department) {
      updateDept.mutate({ id: department.id, input: payload }, { onSuccess: () => onSuccess(), onError })
    } else {
      createDept.mutate(payload, { onSuccess: () => { setForm(makeEmptyForm()); onSuccess() }, onError })
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <h4 className="mb-3 text-xs font-semibold uppercase tracking-wide text-sap-text-muted">Department Information</h4>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Select id="companyId" label="Company" value={form.companyId} onChange={(e) => handleCompanyChange(e.target.value)} options={dummyCompanies.map((c) => ({ label: c.companyName, value: c.id }))} />
            <div>
              <Select id="businessUnitId" label="Business Unit" value={form.businessUnitId} onChange={(e) => updateField('businessUnitId', e.target.value)} options={availableBUs.map((u) => ({ label: u.name, value: u.id }))} />
              {errors.businessUnitId && <p className="mt-1 text-xs text-sap-danger">{errors.businessUnitId}</p>}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Input id="name" label="Department Name" value={form.name} onChange={(e) => updateField('name', e.target.value)} error={errors.name} />
            <Input id="code" label="Department Code" value={form.code} onChange={(e) => updateField('code', e.target.value.toUpperCase())} error={errors.code} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Select id="departmentType" label="Department Type" value={form.departmentType} onChange={(e) => updateField('departmentType', e.target.value as DepartmentType)} options={DEPARTMENT_TYPE_OPTIONS.map((t) => ({ label: t, value: t }))} />
            <Select id="status" label="Status" value={form.status} onChange={(e) => updateField('status', e.target.value as DepartmentStatus)} options={[{ label: 'Active', value: 'Active' }, { label: 'Inactive', value: 'Inactive' }]} />
          </div>
          <Input id="parentDepartment" label="Parent Department (optional)" value={form.parentDepartment} onChange={(e) => updateField('parentDepartment', e.target.value)} />
        </div>
      </div>

      <div>
        <h4 className="mb-3 text-xs font-semibold uppercase tracking-wide text-sap-text-muted">Head & Contact</h4>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Input id="head" label="Department Head" value={form.head} onChange={(e) => updateField('head', e.target.value)} error={errors.head} />
            <Input id="deputyHead" label="Deputy Head (optional)" value={form.deputyHead} onChange={(e) => updateField('deputyHead', e.target.value)} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Input id="contactEmail" label="Contact Email" type="email" value={form.contactEmail} onChange={(e) => updateField('contactEmail', e.target.value)} />
            <Input id="contactNumber" label="Contact Number" type="tel" value={form.contactNumber} onChange={(e) => updateField('contactNumber', e.target.value)} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Input id="effectiveDate" label="Effective Date" type="date" value={form.effectiveDate} onChange={(e) => updateField('effectiveDate', e.target.value)} error={errors.effectiveDate} />
            <Input id="endDate" label="End Date (optional)" type="date" value={form.endDate} onChange={(e) => updateField('endDate', e.target.value)} />
          </div>
        </div>
      </div>

      <div>
        <h4 className="mb-3 text-xs font-semibold uppercase tracking-wide text-sap-text-muted">Location & Operations</h4>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Select id="branchId" label="Branch" value={form.branchId} onChange={(e) => updateField('branchId', e.target.value)} options={[{ label: 'Select branch', value: '' }, ...availableBranches.map((b) => ({ label: b.name, value: b.id }))]} />
            <Select id="costCenterId" label="Cost Center (optional)" value={form.costCenterId} onChange={(e) => updateField('costCenterId', e.target.value)} options={[{ label: 'None', value: '' }, ...availableCostCenters.map((c) => ({ label: c.name, value: c.id }))]} />
          </div>
          <Select id="workingCalendar" label="Working Calendar" value={form.workingCalendar} onChange={(e) => updateField('workingCalendar', e.target.value)} options={WORKING_CALENDAR_OPTIONS.map((w) => ({ label: w, value: w }))} />
          <Input id="description" label="Description" value={form.description} onChange={(e) => updateField('description', e.target.value)} />
        </div>
      </div>

      {serverError && <p className="text-sm text-sap-danger">{serverError}</p>}

      <div className="flex justify-end gap-2 pt-2">
        <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>
        <Button type="submit" isLoading={isPending}>{department ? 'Update' : 'Save'}</Button>
      </div>
    </form>
  )
}
