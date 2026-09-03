import { useState, type FormEvent } from 'react'
import Input from '../common/Input'
import Select from '../common/Select'
import Button from '../common/Button'
import { useCreateRoleAssignment } from '../../hooks/mutations/useCreateRoleAssignment'
import { useUpdateRoleAssignment } from '../../hooks/mutations/useUpdateRoleAssignment'
import { dummyRoles } from '../../data/dummyRoles'
import { dummyPermissions } from '../../data/dummyPermissions'
import { ASSIGNMENT_ORG_SCOPE_OPTIONS } from '../../types/roleAssignment'
import type { RoleAssignment, AssignmentStatus, AssignmentOrgScope } from '../../types/roleAssignment'

interface FormState {
  roleId: string
  permissionId: string
  organizationScope: AssignmentOrgScope
  effectiveDate: string
  expiryDate: string
  status: AssignmentStatus
}

interface FormErrors {
  roleId?: string
  permissionId?: string
  effectiveDate?: string
}

function makeEmptyForm(): FormState {
  return {
    roleId: dummyRoles[0]?.id ?? '',
    permissionId: dummyPermissions[0]?.id ?? '',
    organizationScope: 'Company',
    effectiveDate: '',
    expiryDate: '',
    status: 'Active',
  }
}

interface RoleAssignmentFormProps {
  assignment: RoleAssignment | null
  onSuccess: () => void
  onCancel: () => void
}

export default function RoleAssignmentForm({ assignment, onSuccess, onCancel }: RoleAssignmentFormProps) {
  const [form, setForm] = useState<FormState>(
    assignment
      ? {
          roleId: assignment.roleId,
          permissionId: assignment.permissionId,
          organizationScope: assignment.organizationScope,
          effectiveDate: assignment.effectiveDate,
          expiryDate: assignment.expiryDate,
          status: assignment.status,
        }
      : makeEmptyForm(),
  )
  const [errors, setErrors] = useState<FormErrors>({})
  const [serverError, setServerError] = useState<string | null>(null)
  const createAssignment = useCreateRoleAssignment()
  const updateAssignment = useUpdateRoleAssignment()
  const isPending = createAssignment.isPending || updateAssignment.isPending

  function updateField<K extends keyof FormState>(key: K, value: FormState[K]) {
    setServerError(null)
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  function validate(): boolean {
    const nextErrors: FormErrors = {}
    if (!form.roleId) nextErrors.roleId = 'Role selection is required'
    if (!form.permissionId) nextErrors.permissionId = 'Permission selection is required'
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

    if (assignment) {
      const { status: _status, ...updatePayload } = form
      updateAssignment.mutate({ id: assignment.id, input: updatePayload }, { onSuccess: () => onSuccess(), onError })
    } else {
      createAssignment.mutate(form, { onSuccess: () => { setForm(makeEmptyForm()); onSuccess() }, onError })
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Select
          id="roleId"
          label="Role"
          value={form.roleId}
          onChange={(e) => updateField('roleId', e.target.value)}
          options={dummyRoles.map((r) => ({ label: r.name, value: r.id }))}
        />
        {errors.roleId && <p className="mt-1 text-xs text-sap-danger">{errors.roleId}</p>}
      </div>
      <div>
        <Select
          id="permissionId"
          label="Permission"
          value={form.permissionId}
          onChange={(e) => updateField('permissionId', e.target.value)}
          options={dummyPermissions.map((p) => ({ label: p.name, value: p.id }))}
        />
        {errors.permissionId && <p className="mt-1 text-xs text-sap-danger">{errors.permissionId}</p>}
      </div>
      <Select
        id="organizationScope"
        label="Organization Scope"
        value={form.organizationScope}
        onChange={(e) => updateField('organizationScope', e.target.value as AssignmentOrgScope)}
        options={ASSIGNMENT_ORG_SCOPE_OPTIONS.map((s) => ({ label: s, value: s }))}
      />
      <div className="grid grid-cols-2 gap-4">
        <Input id="effectiveDate" label="Effective Date" type="date" value={form.effectiveDate} onChange={(e) => updateField('effectiveDate', e.target.value)} error={errors.effectiveDate} />
        <Input id="expiryDate" label="Expiry Date (optional)" type="date" value={form.expiryDate} onChange={(e) => updateField('expiryDate', e.target.value)} />
      </div>
      {!assignment && (
        <Select
          id="status"
          label="Status"
          value={form.status}
          onChange={(e) => updateField('status', e.target.value as AssignmentStatus)}
          options={[{ label: 'Active', value: 'Active' }, { label: 'Inactive', value: 'Inactive' }]}
        />
      )}

      {serverError && <p className="text-sm text-sap-danger">{serverError}</p>}

      <div className="flex justify-end gap-2 pt-2">
        <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>
        <Button type="submit" isLoading={isPending}>{assignment ? 'Update' : 'Save'}</Button>
      </div>
    </form>
  )
}
