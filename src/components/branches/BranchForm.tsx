import { useState, type FormEvent } from 'react'
import Input from '../common/Input'
import Select from '../common/Select'
import Button from '../common/Button'
import { useCreateBranch } from '../../hooks/mutations/useCreateBranch'
import { useUpdateBranch } from '../../hooks/mutations/useUpdateBranch'
import { dummyBusinessUnits } from '../../data/dummyBusinessUnits'
import type { Branch, BranchStatus } from '../../types/branch'

interface FormState {
  name: string
  code: string
  businessUnitId: string
  manager: string
  address: string
  city: string
  state: string
  country: string
  phone: string
  status: BranchStatus
}

interface FormErrors {
  name?: string
  code?: string
  businessUnitId?: string
  manager?: string
}

const emptyForm: FormState = {
  name: '',
  code: '',
  businessUnitId: dummyBusinessUnits[0]?.id ?? '',
  manager: '',
  address: '',
  city: '',
  state: '',
  country: 'India',
  phone: '',
  status: 'Active',
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
          name: branch.name,
          code: branch.code,
          businessUnitId: branch.businessUnitId,
          manager: branch.manager,
          address: branch.address,
          city: branch.city,
          state: branch.state,
          country: branch.country,
          phone: branch.phone,
          status: branch.status,
        }
      : emptyForm,
  )
  const [errors, setErrors] = useState<FormErrors>({})
  const [serverError, setServerError] = useState<string | null>(null)
  const createBranch = useCreateBranch()
  const updateBranch = useUpdateBranch()
  const isPending = createBranch.isPending || updateBranch.isPending

  function validate(): boolean {
    const nextErrors: FormErrors = {}
    if (!form.name.trim()) nextErrors.name = 'Branch name is required'
    if (!form.code.trim()) nextErrors.code = 'Branch code is required'
    if (!form.businessUnitId) nextErrors.businessUnitId = 'Business unit selection is required'
    if (!form.manager.trim()) nextErrors.manager = 'Branch manager is required'
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
      createBranch.mutate(form, { onSuccess: () => { setForm(emptyForm); onSuccess() }, onError })
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
        <Input id="name" label="Branch Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} error={errors.name} />
        <Input id="code" label="Branch Code" value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase() })} error={errors.code} />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <Input id="manager" label="Branch Manager" value={form.manager} onChange={(e) => setForm({ ...form, manager: e.target.value })} error={errors.manager} />
        <Input id="phone" label="Phone Number" type="tel" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
      </div>
      <Input id="address" label="Address" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} />
      <div className="grid grid-cols-2 gap-4">
        <Input id="city" label="City" value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} />
        <Input id="state" label="State" value={form.state} onChange={(e) => setForm({ ...form, state: e.target.value })} />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <Input id="country" label="Country" value={form.country} onChange={(e) => setForm({ ...form, country: e.target.value })} />
        <Select
          id="status"
          label="Status"
          value={form.status}
          onChange={(e) => setForm({ ...form, status: e.target.value as BranchStatus })}
          options={[{ label: 'Active', value: 'Active' }, { label: 'Inactive', value: 'Inactive' }]}
        />
      </div>

      {serverError && <p className="text-sm text-sap-danger">{serverError}</p>}

      <div className="flex justify-end gap-2 pt-2">
        <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>
        <Button type="submit" isLoading={isPending}>{branch ? 'Update' : 'Save'}</Button>
      </div>
    </form>
  )
}
