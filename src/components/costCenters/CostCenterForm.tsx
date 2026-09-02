import { useState, useMemo, type FormEvent } from 'react'
import Input from '../common/Input'
import Select from '../common/Select'
import Button from '../common/Button'
import { useCreateCostCenter } from '../../hooks/mutations/useCreateCostCenter'
import { useUpdateCostCenter } from '../../hooks/mutations/useUpdateCostCenter'
import { dummyCompanies } from '../../data/dummyCompanies'
import { dummyBusinessUnits } from '../../data/dummyBusinessUnits'
import { dummyDepartments } from '../../data/dummyDepartments'
import { dummyBranches } from '../../data/dummyBranches'
import { COST_CENTER_TYPE_OPTIONS, BUDGET_PERIOD_OPTIONS, CURRENCY_OPTIONS, FINANCIAL_YEAR_OPTIONS } from '../../types/costCenter'
import type { CostCenter, CostCenterStatus, CostCenterType, BudgetPeriod } from '../../types/costCenter'

interface FormState {
  companyId: string
  businessUnitId: string
  departmentId: string
  branchId: string
  parentCostCenter: string
  name: string
  code: string
  costCenterType: CostCenterType
  budgetOwner: string
  currency: string
  budgetAllocation: string
  budgetPeriod: BudgetPeriod
  financialYear: string
  description: string
  status: CostCenterStatus
}

interface FormErrors {
  name?: string
  code?: string
  businessUnitId?: string
  budgetOwner?: string
  budgetAllocation?: string
}

function makeEmptyForm(): FormState {
  const firstCompany = dummyCompanies[0]
  const firstBU = dummyBusinessUnits.find((u) => u.companyId === firstCompany?.id)
  const firstDept = dummyDepartments.find((d) => d.businessUnitId === firstBU?.id)
  const firstBranch = dummyBranches.find((b) => b.businessUnitId === firstBU?.id)
  return {
    companyId: firstCompany?.id ?? '',
    businessUnitId: firstBU?.id ?? '',
    departmentId: firstDept?.id ?? '',
    branchId: firstBranch?.id ?? '',
    parentCostCenter: '',
    name: '',
    code: '',
    costCenterType: 'Operational',
    budgetOwner: '',
    currency: 'INR',
    budgetAllocation: '',
    budgetPeriod: 'Annual',
    financialYear: 'Apr - Mar',
    description: '',
    status: 'Active',
  }
}

interface CostCenterFormProps {
  center: CostCenter | null
  onSuccess: () => void
  onCancel: () => void
}

export default function CostCenterForm({ center, onSuccess, onCancel }: CostCenterFormProps) {
  const [form, setForm] = useState<FormState>(
    center
      ? {
          companyId: center.companyId,
          businessUnitId: center.businessUnitId,
          departmentId: center.departmentId,
          branchId: center.branchId,
          parentCostCenter: center.parentCostCenter ?? '',
          name: center.name,
          code: center.code,
          costCenterType: center.costCenterType,
          budgetOwner: center.budgetOwner,
          currency: center.currency,
          budgetAllocation: String(center.budgetAllocation),
          budgetPeriod: center.budgetPeriod,
          financialYear: center.financialYear,
          description: center.description,
          status: center.status,
        }
      : makeEmptyForm(),
  )
  const [errors, setErrors] = useState<FormErrors>({})
  const [serverError, setServerError] = useState<string | null>(null)
  const createCC = useCreateCostCenter()
  const updateCC = useUpdateCostCenter()
  const isPending = createCC.isPending || updateCC.isPending

  function updateField<K extends keyof FormState>(key: K, value: FormState[K]) {
    setServerError(null)
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  const availableBUs = useMemo(() => dummyBusinessUnits.filter((u) => u.companyId === form.companyId), [form.companyId])
  const availableDepartments = useMemo(() => dummyDepartments.filter((d) => d.businessUnitId === form.businessUnitId), [form.businessUnitId])
  const availableBranches = useMemo(() => dummyBranches.filter((b) => b.businessUnitId === form.businessUnitId), [form.businessUnitId])

  function handleCompanyChange(nextCompanyId: string) {
    const fallbackBU = dummyBusinessUnits.find((u) => u.companyId === nextCompanyId)
    const fallbackDept = dummyDepartments.find((d) => d.businessUnitId === fallbackBU?.id)
    const fallbackBranch = dummyBranches.find((b) => b.businessUnitId === fallbackBU?.id)
    setServerError(null)
    setForm((prev) => ({
      ...prev,
      companyId: nextCompanyId,
      businessUnitId: fallbackBU?.id ?? '',
      departmentId: fallbackDept?.id ?? '',
      branchId: fallbackBranch?.id ?? '',
    }))
  }

  function handleBusinessUnitChange(nextBUId: string) {
    const fallbackDept = dummyDepartments.find((d) => d.businessUnitId === nextBUId)
    const fallbackBranch = dummyBranches.find((b) => b.businessUnitId === nextBUId)
    setServerError(null)
    setForm((prev) => ({
      ...prev,
      businessUnitId: nextBUId,
      departmentId: fallbackDept?.id ?? '',
      branchId: fallbackBranch?.id ?? '',
    }))
  }

  function validate(): boolean {
    const nextErrors: FormErrors = {}
    if (!form.name.trim()) nextErrors.name = 'Cost center name is required'
    if (!form.code.trim()) nextErrors.code = 'Cost center code is required'
    if (!form.businessUnitId) nextErrors.businessUnitId = 'Business unit selection is required'
    if (!form.budgetOwner.trim()) nextErrors.budgetOwner = 'Budget owner is required'
    if (!form.budgetAllocation.trim() || isNaN(Number(form.budgetAllocation)) || Number(form.budgetAllocation) <= 0) {
      nextErrors.budgetAllocation = 'Enter a valid budget amount'
    }
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
    const payload = {
      companyId: form.companyId,
      businessUnitId: form.businessUnitId,
      departmentId: form.departmentId,
      branchId: form.branchId,
      parentCostCenter: form.parentCostCenter || null,
      name: form.name,
      code: form.code,
      costCenterType: form.costCenterType,
      budgetOwner: form.budgetOwner,
      currency: form.currency,
      budgetAllocation: Number(form.budgetAllocation),
      budgetPeriod: form.budgetPeriod,
      financialYear: form.financialYear,
      description: form.description,
    }

    if (center) {
      updateCC.mutate({ id: center.id, input: payload }, { onSuccess: () => onSuccess(), onError })
    } else {
      createCC.mutate(
        { ...payload, status: form.status },
        { onSuccess: () => { setForm(makeEmptyForm()); onSuccess() }, onError },
      )
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <h4 className="mb-3 text-xs font-semibold uppercase tracking-wide text-sap-text-muted">Cost Center Information</h4>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Select id="companyId" label="Company" value={form.companyId} onChange={(e) => handleCompanyChange(e.target.value)} options={dummyCompanies.map((c) => ({ label: c.companyName, value: c.id }))} />
            <div>
              <Select id="businessUnitId" label="Business Unit" value={form.businessUnitId} onChange={(e) => handleBusinessUnitChange(e.target.value)} options={availableBUs.map((u) => ({ label: u.name, value: u.id }))} />
              {errors.businessUnitId && <p className="mt-1 text-xs text-sap-danger">{errors.businessUnitId}</p>}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Select id="departmentId" label="Department (optional)" value={form.departmentId} onChange={(e) => updateField('departmentId', e.target.value)} options={[{ label: 'None', value: '' }, ...availableDepartments.map((d) => ({ label: d.name, value: d.id }))]} />
            <Select id="branchId" label="Branch (optional)" value={form.branchId} onChange={(e) => updateField('branchId', e.target.value)} options={[{ label: 'None', value: '' }, ...availableBranches.map((b) => ({ label: b.name, value: b.id }))]} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Input id="name" label="Cost Center Name" value={form.name} onChange={(e) => updateField('name', e.target.value)} error={errors.name} />
            <Input id="code" label="Cost Center Code" value={form.code} onChange={(e) => updateField('code', e.target.value.toUpperCase())} error={errors.code} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Select id="costCenterType" label="Cost Center Type" value={form.costCenterType} onChange={(e) => updateField('costCenterType', e.target.value as CostCenterType)} options={COST_CENTER_TYPE_OPTIONS.map((t) => ({ label: t, value: t }))} />
            <Select id="status" label="Status" value={form.status} onChange={(e) => updateField('status', e.target.value as CostCenterStatus)} options={[{ label: 'Active', value: 'Active' }, { label: 'Inactive', value: 'Inactive' }]} />
          </div>
          <Input id="parentCostCenter" label="Parent Cost Center (optional)" value={form.parentCostCenter} onChange={(e) => updateField('parentCostCenter', e.target.value)} />
        </div>
      </div>

      <div>
        <h4 className="mb-3 text-xs font-semibold uppercase tracking-wide text-sap-text-muted">Budget Information</h4>
        <div className="space-y-4">
          <Input id="budgetOwner" label="Budget Owner" value={form.budgetOwner} onChange={(e) => updateField('budgetOwner', e.target.value)} error={errors.budgetOwner} />
          <div className="grid grid-cols-2 gap-4">
            <Input id="budgetAllocation" label="Budget Amount" type="number" value={form.budgetAllocation} onChange={(e) => updateField('budgetAllocation', e.target.value)} error={errors.budgetAllocation} />
            <Select id="currency" label="Currency" value={form.currency} onChange={(e) => updateField('currency', e.target.value)} options={CURRENCY_OPTIONS.map((c) => ({ label: c, value: c }))} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Select id="budgetPeriod" label="Budget Period" value={form.budgetPeriod} onChange={(e) => updateField('budgetPeriod', e.target.value as BudgetPeriod)} options={BUDGET_PERIOD_OPTIONS.map((p) => ({ label: p, value: p }))} />
            <Select id="financialYear" label="Financial Year" value={form.financialYear} onChange={(e) => updateField('financialYear', e.target.value)} options={FINANCIAL_YEAR_OPTIONS.map((f) => ({ label: f, value: f }))} />
          </div>
          <Input id="description" label="Description" value={form.description} onChange={(e) => updateField('description', e.target.value)} />
        </div>
      </div>

      {serverError && <p className="text-sm text-sap-danger">{serverError}</p>}

      <div className="flex justify-end gap-2 pt-2">
        <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>
        <Button type="submit" isLoading={isPending}>{center ? 'Update' : 'Save'}</Button>
      </div>
    </form>
  )
}
