import { useState, useMemo, type FormEvent } from 'react'
import Input from '../common/Input'
import Select from '../common/Select'
import Button from '../common/Button'
import { useCreateCostCenter } from '../../hooks/mutations/useCreateCostCenter'
import { useUpdateCostCenter } from '../../hooks/mutations/useUpdateCostCenter'
import { dummyBusinessUnits } from '../../data/dummyBusinessUnits'
import { dummyDepartments } from '../../data/dummyDepartments'
import type { CostCenter, CostCenterStatus } from '../../types/costCenter'

const CURRENCY_OPTIONS = ['INR', 'USD', 'GBP', 'EUR', 'AUD', 'SGD']

interface FormState {
  name: string
  code: string
  businessUnitId: string
  departmentId: string
  manager: string
  budgetAllocation: string
  currency: string
  status: CostCenterStatus
}

interface FormErrors {
  name?: string
  code?: string
  businessUnitId?: string
  departmentId?: string
  manager?: string
  budgetAllocation?: string
}

function makeEmptyForm(): FormState {
  const firstBU = dummyBusinessUnits[0]
  const firstDept = dummyDepartments.find((d) => d.businessUnitId === firstBU?.id)
  return {
    name: '',
    code: '',
    businessUnitId: firstBU?.id ?? '',
    departmentId: firstDept?.id ?? '',
    manager: '',
    budgetAllocation: '',
    currency: 'INR',
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
          name: center.name,
          code: center.code,
          businessUnitId: center.businessUnitId,
          departmentId: center.departmentId,
          manager: center.manager,
          budgetAllocation: String(center.budgetAllocation),
          currency: center.currency,
          status: center.status,
        }
      : makeEmptyForm(),
  )
  const [errors, setErrors] = useState<FormErrors>({})
  const [serverError, setServerError] = useState<string | null>(null)
  const createCC = useCreateCostCenter()
  const updateCC = useUpdateCostCenter()
  const isPending = createCC.isPending || updateCC.isPending

  const availableDepartments = useMemo(
    () => dummyDepartments.filter((d) => d.businessUnitId === form.businessUnitId),
    [form.businessUnitId],
  )

  function handleBusinessUnitChange(nextBUId: string) {
    const stillValid = dummyDepartments.some((d) => d.businessUnitId === nextBUId && d.id === form.departmentId)
    const fallbackDept = dummyDepartments.find((d) => d.businessUnitId === nextBUId)
    setForm({
      ...form,
      businessUnitId: nextBUId,
      departmentId: stillValid ? form.departmentId : (fallbackDept?.id ?? ''),
    })
  }

  function validate(): boolean {
    const nextErrors: FormErrors = {}
    if (!form.name.trim()) nextErrors.name = 'Cost center name is required'
    if (!form.code.trim()) nextErrors.code = 'Cost center code is required'
    if (!form.businessUnitId) nextErrors.businessUnitId = 'Business unit selection is required'
    if (!form.departmentId) nextErrors.departmentId = 'Department selection is required'
    if (!form.manager.trim()) nextErrors.manager = 'Manager is required'
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
      name: form.name,
      code: form.code,
      businessUnitId: form.businessUnitId,
      departmentId: form.departmentId,
      manager: form.manager,
      budgetAllocation: Number(form.budgetAllocation),
      currency: form.currency,
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
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Select
            id="businessUnitId"
            label="Business Unit"
            value={form.businessUnitId}
            onChange={(e) => handleBusinessUnitChange(e.target.value)}
            options={dummyBusinessUnits.map((u) => ({ label: u.name, value: u.id }))}
          />
          {errors.businessUnitId && <p className="mt-1 text-xs text-sap-danger">{errors.businessUnitId}</p>}
        </div>
        <div>
          <Select
            id="departmentId"
            label="Department"
            value={form.departmentId}
            onChange={(e) => setForm({ ...form, departmentId: e.target.value })}
            options={availableDepartments.map((d) => ({ label: d.name, value: d.id }))}
          />
          {errors.departmentId && <p className="mt-1 text-xs text-sap-danger">{errors.departmentId}</p>}
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <Input id="name" label="Cost Center Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} error={errors.name} />
        <Input id="code" label="Cost Center Code" value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase() })} error={errors.code} />
      </div>
      <Input id="manager" label="Manager" value={form.manager} onChange={(e) => setForm({ ...form, manager: e.target.value })} error={errors.manager} />
      <div className="grid grid-cols-2 gap-4">
        <Input id="budgetAllocation" label="Budget Allocation" type="number" value={form.budgetAllocation} onChange={(e) => setForm({ ...form, budgetAllocation: e.target.value })} error={errors.budgetAllocation} />
        <Select
          id="currency"
          label="Currency"
          value={form.currency}
          onChange={(e) => setForm({ ...form, currency: e.target.value })}
          options={CURRENCY_OPTIONS.map((c) => ({ label: c, value: c }))}
        />
      </div>
      <Select
        id="status"
        label="Status"
        value={form.status}
        onChange={(e) => setForm({ ...form, status: e.target.value as CostCenterStatus })}
        options={[{ label: 'Active', value: 'Active' }, { label: 'Inactive', value: 'Inactive' }]}
      />

      {serverError && <p className="text-sm text-sap-danger">{serverError}</p>}

      <div className="flex justify-end gap-2 pt-2">
        <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>
        <Button type="submit" isLoading={isPending}>{center ? 'Update' : 'Save'}</Button>
      </div>
    </form>
  )
}
