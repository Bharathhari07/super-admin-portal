import { useState, type FormEvent } from 'react'
import Input from '../common/Input'
import Select from '../common/Select'
import Button from '../common/Button'
import { useCreateBusinessUnit } from '../../hooks/mutations/useCreateBusinessUnit'
import { useUpdateBusinessUnit } from '../../hooks/mutations/useUpdateBusinessUnit'
import { dummyCompanies } from '../../data/dummyCompanies'
import type { BusinessUnit, BusinessUnitStatus } from '../../types/businessUnit'

interface FormState {
  name: string
  code: string
  companyId: string
  head: string
  parentBusinessUnit: string
  description: string
  status: BusinessUnitStatus
}

interface FormErrors {
  name?: string
  code?: string
  companyId?: string
  head?: string
}

const emptyForm: FormState = {
  name: '',
  code: '',
  companyId: dummyCompanies[0]?.id ?? '',
  head: '',
  parentBusinessUnit: '',
  description: '',
  status: 'Active',
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
          head: unit.head,
          parentBusinessUnit: unit.parentBusinessUnit ?? '',
          description: unit.description,
          status: unit.status,
        }
      : emptyForm,
  )
  const [errors, setErrors] = useState<FormErrors>({})
  const [serverError, setServerError] = useState<string | null>(null)
  const createBU = useCreateBusinessUnit()
  const updateBU = useUpdateBusinessUnit()
  const isPending = createBU.isPending || updateBU.isPending

  function validate(): boolean {
    const nextErrors: FormErrors = {}
    if (!form.name.trim()) nextErrors.name = 'Business unit name is required'
    if (!form.code.trim()) nextErrors.code = 'Business unit code is required'
    if (!form.companyId) nextErrors.companyId = 'Organization selection is required'
    if (!form.head.trim()) nextErrors.head = 'Business unit head is required'
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
      createBU.mutate(payload, { onSuccess: () => { setForm(emptyForm); onSuccess() }, onError })
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Select
        id="companyId"
        label="Organization Selection"
        value={form.companyId}
        onChange={(e) => setForm({ ...form, companyId: e.target.value })}
        options={dummyCompanies.map((c) => ({ label: c.companyName, value: c.id }))}
      />
      {errors.companyId && <p className="text-xs text-sap-danger">{errors.companyId}</p>}
      <div className="grid grid-cols-2 gap-4">
        <Input id="name" label="Business Unit Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} error={errors.name} />
        <Input id="code" label="Business Unit Code" value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase() })} error={errors.code} />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <Input id="head" label="Business Unit Head" value={form.head} onChange={(e) => setForm({ ...form, head: e.target.value })} error={errors.head} />
        <Input id="parentBusinessUnit" label="Parent Business Unit (optional)" value={form.parentBusinessUnit} onChange={(e) => setForm({ ...form, parentBusinessUnit: e.target.value })} />
      </div>
      <Input id="description" label="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
      <Select
        id="status"
        label="Status"
        value={form.status}
        onChange={(e) => setForm({ ...form, status: e.target.value as BusinessUnitStatus })}
        options={[{ label: 'Active', value: 'Active' }, { label: 'Inactive', value: 'Inactive' }]}
      />

      {serverError && <p className="text-sm text-sap-danger">{serverError}</p>}

      <div className="flex justify-end gap-2 pt-2">
        <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>
        <Button type="submit" isLoading={isPending}>{unit ? 'Update' : 'Save'}</Button>
      </div>
    </form>
  )
}
