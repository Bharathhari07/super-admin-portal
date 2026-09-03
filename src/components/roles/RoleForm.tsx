import { useState, type FormEvent } from 'react'
import Input from '../common/Input'
import Select from '../common/Select'
import Button from '../common/Button'
import { useCreateRole } from '../../hooks/mutations/useCreateRole'
import { useUpdateRole } from '../../hooks/mutations/useUpdateRole'
import { ROLE_CATEGORY_OPTIONS, ROLE_TYPE_OPTIONS, ORGANIZATION_SCOPE_OPTIONS, APPLICABLE_USER_TYPE_OPTIONS } from '../../types/role'
import type { Role, RoleStatus, RoleCategory, RoleType, OrganizationScope, ApplicableUserType } from '../../types/role'

interface FormState {
  code: string
  name: string
  roleCategory: RoleCategory
  parentRole: string
  status: RoleStatus
  roleType: RoleType
  isDefaultRole: boolean
  isAssignable: boolean
  priorityLevel: string
  effectiveDate: string
  expiryDate: string
  applicableUserTypes: ApplicableUserType[]
  organizationScope: OrganizationScope
  maximumUsers: string
  description: string
}

interface FormErrors {
  code?: string
  name?: string
  effectiveDate?: string
  applicableUserTypes?: string
}

function makeEmptyForm(): FormState {
  return {
    code: '',
    name: '',
    roleCategory: 'Custom',
    parentRole: '',
    status: 'Active',
    roleType: 'Custom Role',
    isDefaultRole: false,
    isAssignable: true,
    priorityLevel: '',
    effectiveDate: '',
    expiryDate: '',
    applicableUserTypes: ['Employee'],
    organizationScope: 'Department',
    maximumUsers: '',
    description: '',
  }
}

interface RoleFormProps {
  role: Role | null
  onSuccess: () => void
  onCancel: () => void
}

export default function RoleForm({ role, onSuccess, onCancel }: RoleFormProps) {
  const [form, setForm] = useState<FormState>(
    role
      ? {
          code: role.code,
          name: role.name,
          roleCategory: role.roleCategory,
          parentRole: role.parentRole ?? '',
          status: role.status,
          roleType: role.roleType,
          isDefaultRole: role.isDefaultRole,
          isAssignable: role.isAssignable,
          priorityLevel: role.priorityLevel,
          effectiveDate: role.effectiveDate,
          expiryDate: role.expiryDate,
          applicableUserTypes: role.applicableUserTypes,
          organizationScope: role.organizationScope,
          maximumUsers: role.maximumUsers,
          description: role.description,
        }
      : makeEmptyForm(),
  )
  const [errors, setErrors] = useState<FormErrors>({})
  const [serverError, setServerError] = useState<string | null>(null)
  const createRole = useCreateRole()
  const updateRole = useUpdateRole()
  const isPending = createRole.isPending || updateRole.isPending

  function updateField<K extends keyof FormState>(key: K, value: FormState[K]) {
    setServerError(null)
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  function toggleUserType(type: ApplicableUserType) {
    setServerError(null)
    setForm((prev) => ({
      ...prev,
      applicableUserTypes: prev.applicableUserTypes.includes(type)
        ? prev.applicableUserTypes.filter((t) => t !== type)
        : [...prev.applicableUserTypes, type],
    }))
  }

  function validate(): boolean {
    const nextErrors: FormErrors = {}
    if (!form.code.trim()) nextErrors.code = 'Role code is required'
    if (!form.name.trim()) nextErrors.name = 'Role name is required'
    if (!form.effectiveDate.trim()) nextErrors.effectiveDate = 'Effective date is required'
    if (form.applicableUserTypes.length === 0) nextErrors.applicableUserTypes = 'Select at least one user type'
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
    const payload = { ...form, parentRole: form.parentRole || null }

    if (role) {
      updateRole.mutate({ id: role.id, input: payload }, { onSuccess: () => onSuccess(), onError })
    } else {
      createRole.mutate(payload, { onSuccess: () => { setForm(makeEmptyForm()); onSuccess() }, onError })
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <h4 className="mb-3 text-xs font-semibold uppercase tracking-wide text-sap-text-muted">Role Information</h4>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Input id="code" label="Role Code" value={form.code} onChange={(e) => updateField('code', e.target.value.toUpperCase())} error={errors.code} />
            <Input id="name" label="Role Name" value={form.name} onChange={(e) => updateField('name', e.target.value)} error={errors.name} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Select id="roleCategory" label="Role Category" value={form.roleCategory} onChange={(e) => updateField('roleCategory', e.target.value as RoleCategory)} options={ROLE_CATEGORY_OPTIONS.map((c) => ({ label: c, value: c }))} />
            <Select id="status" label="Status" value={form.status} onChange={(e) => updateField('status', e.target.value as RoleStatus)} options={[{ label: 'Active', value: 'Active' }, { label: 'Inactive', value: 'Inactive' }]} />
          </div>
          <Input id="parentRole" label="Parent Role (optional)" value={form.parentRole} onChange={(e) => updateField('parentRole', e.target.value)} />
        </div>
      </div>

      <div>
        <h4 className="mb-3 text-xs font-semibold uppercase tracking-wide text-sap-text-muted">Role Configuration</h4>
        <div className="space-y-4">
          <Select id="roleType" label="Role Type" value={form.roleType} onChange={(e) => updateField('roleType', e.target.value as RoleType)} options={ROLE_TYPE_OPTIONS.map((t) => ({ label: t, value: t }))} />
          <div className="flex flex-wrap gap-4">
            <label className="flex items-center gap-2 text-sm text-sap-text">
              <input type="checkbox" checked={form.isDefaultRole} onChange={(e) => updateField('isDefaultRole', e.target.checked)} className="h-4 w-4 rounded border-sap-border" />
              Default Role
            </label>
            <label className="flex items-center gap-2 text-sm text-sap-text">
              <input type="checkbox" checked={form.isAssignable} onChange={(e) => updateField('isAssignable', e.target.checked)} className="h-4 w-4 rounded border-sap-border" />
              Assignable
            </label>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Input id="priorityLevel" label="Priority Level (optional)" type="number" value={form.priorityLevel} onChange={(e) => updateField('priorityLevel', e.target.value)} />
            <Input id="maximumUsers" label="Maximum Users (optional)" type="number" value={form.maximumUsers} onChange={(e) => updateField('maximumUsers', e.target.value)} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Input id="effectiveDate" label="Effective Date" type="date" value={form.effectiveDate} onChange={(e) => updateField('effectiveDate', e.target.value)} error={errors.effectiveDate} />
            <Input id="expiryDate" label="Expiry Date (optional)" type="date" value={form.expiryDate} onChange={(e) => updateField('expiryDate', e.target.value)} />
          </div>
        </div>
      </div>

      <div>
        <h4 className="mb-3 text-xs font-semibold uppercase tracking-wide text-sap-text-muted">Scope & Description</h4>
        <div className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-sap-text">Applicable User Types</label>
            <div className="flex flex-wrap gap-2">
              {APPLICABLE_USER_TYPE_OPTIONS.map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => toggleUserType(type)}
                  className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                    form.applicableUserTypes.includes(type)
                      ? 'bg-sap-primary text-sap-primary-text'
                      : 'border border-sap-border bg-sap-surface text-sap-text-muted'
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
            {errors.applicableUserTypes && <p className="mt-1 text-xs text-sap-danger">{errors.applicableUserTypes}</p>}
          </div>
          <Select id="organizationScope" label="Organization Scope" value={form.organizationScope} onChange={(e) => updateField('organizationScope', e.target.value as OrganizationScope)} options={ORGANIZATION_SCOPE_OPTIONS.map((s) => ({ label: s, value: s }))} />
          <Input id="description" label="Description (optional)" value={form.description} onChange={(e) => updateField('description', e.target.value)} />
        </div>
      </div>

      {serverError && <p className="text-sm text-sap-danger">{serverError}</p>}

      <div className="flex justify-end gap-2 pt-2">
        <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>
        <Button type="submit" isLoading={isPending}>{role ? 'Update' : 'Save'}</Button>
      </div>
    </form>
  )
}
