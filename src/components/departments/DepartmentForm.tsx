import { useState, type FormEvent } from 'react'
import Input from '../common/Input'
import Select from '../common/Select'
import Button from '../common/Button'
import { useCreateDepartment } from '../../hooks/mutations/useCreateDepartment'
import { useUpdateDepartment } from '../../hooks/mutations/useUpdateDepartment'
import { dummyBusinessUnits } from '../../data/dummyBusinessUnits'
import type { Department, DepartmentStatus } from '../../types/department'

interface FormState {
  name: string
  code: string
  businessUnitId: string
  head: string
  parentDepartment: string
  description: string
  status: DepartmentStatus
}

interface FormErrors {
  name?: string
  code?: string
  businessUnitId?: string
  head?: string
}

const emptyForm: FormState = {
  name: '',
  code: '',
  businessUnitId: dummyBusinessUnits[0]?.id ?? '',
  head: '',
  parentDepartment: '',
  description: '',
  status: 'Active',
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
          name: department.name,
          code: department.code,
          businessUnitId: department.businessUnitId,
          head: department.head,
          parentDepartment: department.parentDepartment ?? '',
          description: department.description,
          status: department.status,
        }
      : emptyForm,
  )
  const [errors, setErrors] = useState<FormErrors>({})
  const [serverError, setServerError] = useState<string | null>(null)
  const createDept = useCreateDepartment()
  const updateDept = useUpdateDepartment()
  const isPending = createDept.isPending || updateDept.isPending

  function validate(): boolean {
    const nextErrors: FormErrors = {}
    if (!form.name.trim()) nextErrors.name = 'Department name is required'
    if (!form.code.trim()) nextErrors.code = 'Department code is required'
    if (!form.businessUnitId) nextErrors.businessUnitId = 'Business unit selection is required'
    if (!form.head.trim()) nextErrors.head = 'Department head is required'
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
      createDept.mutate(payload, { onSuccess: () => { setForm(emptyForm); onSuccess() }, onError })
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Select
        id="businessUnitId"
        label="Business Unit"
        value={form.businessUnitId}
        onChange={(e) => setForm({ ...form, businessUnitId: e.target.value })}
        options={dummyBusinessUnits.map((u) => ({ label: u.name, value: u.id }))}
      />
      {errors.businessUnitId && <p className="text-xs text-sap-danger">{errors.businessUnitId}</p>}
      <div className="grid grid-cols-2 gap-4">
        <Input id="name" label="Department Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} error={errors.name} />
        <Input id="code" label="Department Code" value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase() })} error={errors.code} />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <Input id="head" label="Department Head" value={form.head} onChange={(e) => setForm({ ...form, head: e.target.value })} error={errors.head} />
        <Input id="parentDepartment" label="Parent Department (optional)" value={form.parentDepartment} onChange={(e) => setForm({ ...form, parentDepartment: e.target.value })} />
      </div>
      <Input id="description" label="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
      <Select
        id="status"
        label="Status"
        value={form.status}
        onChange={(e) => setForm({ ...form, status: e.target.value as DepartmentStatus })}
        options={[{ label: 'Active', value: 'Active' }, { label: 'Inactive', value: 'Inactive' }]}
      />

      {serverError && <p className="text-sm text-sap-danger">{serverError}</p>}

      <div className="flex justify-end gap-2 pt-2">
        <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>
        <Button type="submit" isLoading={isPending}>{department ? 'Update' : 'Save'}</Button>
      </div>
    </form>
  )
}
