import { useState, type FormEvent } from 'react'
import Input from '../common/Input'
import Select from '../common/Select'
import Button from '../common/Button'
import { useCreatePermission } from '../../hooks/mutations/useCreatePermission'
import { useUpdatePermission } from '../../hooks/mutations/useUpdatePermission'
import { dummyRoles } from '../../data/dummyRoles'
import {
  PERMISSION_CATEGORY_OPTIONS,
  MODULE_OPTIONS,
  PERMISSION_TYPE_OPTIONS,
  ACCESS_LEVEL_OPTIONS,
  PERMISSION_ORGANIZATION_SCOPE_OPTIONS,
} from '../../types/permission'
import type {
  Permission,
  PermissionStatus,
  PermissionCategory,
  PlatformModule,
  PermissionType,
  AccessLevel,
  PermissionOrganizationScope,
} from '../../types/permission'

interface FormState {
  code: string
  name: string
  permissionCategory: PermissionCategory
  module: PlatformModule
  status: PermissionStatus
  permissionType: PermissionType
  accessLevel: AccessLevel
  parentPermission: string
  isDefaultPermission: boolean
  effectiveDate: string
  expiryDate: string
  applicableRoleIds: string[]
  organizationScope: PermissionOrganizationScope
  description: string
}

interface FormErrors {
  code?: string
  name?: string
  effectiveDate?: string
  applicableRoleIds?: string
}

function makeEmptyForm(): FormState {
  return {
    code: '',
    name: '',
    permissionCategory: 'Function',
    module: 'Global Dashboard',
    status: 'Active',
    permissionType: 'View',
    accessLevel: 'Read Only',
    parentPermission: '',
    isDefaultPermission: false,
    effectiveDate: '',
    expiryDate: '',
    applicableRoleIds: [],
    organizationScope: 'Company',
    description: '',
  }
}

interface PermissionFormProps {
  permission: Permission | null
  onSuccess: () => void
  onCancel: () => void
}

export default function PermissionForm({ permission, onSuccess, onCancel }: PermissionFormProps) {
  const [form, setForm] = useState<FormState>(
    permission
      ? {
          code: permission.code,
          name: permission.name,
          permissionCategory: permission.permissionCategory,
          module: permission.module,
          status: permission.status,
          permissionType: permission.permissionType,
          accessLevel: permission.accessLevel,
          parentPermission: permission.parentPermission ?? '',
          isDefaultPermission: permission.isDefaultPermission,
          effectiveDate: permission.effectiveDate,
          expiryDate: permission.expiryDate,
          applicableRoleIds: permission.applicableRoleIds,
          organizationScope: permission.organizationScope,
          description: permission.description,
        }
      : makeEmptyForm(),
  )
  const [errors, setErrors] = useState<FormErrors>({})
  const [serverError, setServerError] = useState<string | null>(null)
  const createPermission = useCreatePermission()
  const updatePermission = useUpdatePermission()
  const isPending = createPermission.isPending || updatePermission.isPending

  function updateField<K extends keyof FormState>(key: K, value: FormState[K]) {
    setServerError(null)
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  function toggleRole(roleId: string) {
    setServerError(null)
    setForm((prev) => ({
      ...prev,
      applicableRoleIds: prev.applicableRoleIds.includes(roleId)
        ? prev.applicableRoleIds.filter((id) => id !== roleId)
        : [...prev.applicableRoleIds, roleId],
    }))
  }

  function validate(): boolean {
    const nextErrors: FormErrors = {}
    if (!form.code.trim()) nextErrors.code = 'Permission code is required'
    if (!form.name.trim()) nextErrors.name = 'Permission name is required'
    if (!form.effectiveDate.trim()) nextErrors.effectiveDate = 'Effective date is required'
    if (form.applicableRoleIds.length === 0) nextErrors.applicableRoleIds = 'Select at least one role'
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
    const payload = { ...form, parentPermission: form.parentPermission || null }

    if (permission) {
      updatePermission.mutate({ id: permission.id, input: payload }, { onSuccess: () => onSuccess(), onError })
    } else {
      createPermission.mutate(payload, { onSuccess: () => { setForm(makeEmptyForm()); onSuccess() }, onError })
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <h4 className="mb-3 text-xs font-semibold uppercase tracking-wide text-sap-text-muted">Permission Information</h4>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Input id="code" label="Permission Code" value={form.code} onChange={(e) => updateField('code', e.target.value.toUpperCase())} error={errors.code} />
            <Input id="name" label="Permission Name" value={form.name} onChange={(e) => updateField('name', e.target.value)} error={errors.name} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Select id="permissionCategory" label="Permission Category" value={form.permissionCategory} onChange={(e) => updateField('permissionCategory', e.target.value as PermissionCategory)} options={PERMISSION_CATEGORY_OPTIONS.map((c) => ({ label: c, value: c }))} />
            <Select id="module" label="Module" value={form.module} onChange={(e) => updateField('module', e.target.value as PlatformModule)} options={MODULE_OPTIONS.map((m) => ({ label: m, value: m }))} />
          </div>
          <Select id="status" label="Status" value={form.status} onChange={(e) => updateField('status', e.target.value as PermissionStatus)} options={[{ label: 'Active', value: 'Active' }, { label: 'Inactive', value: 'Inactive' }]} />
        </div>
      </div>

      <div>
        <h4 className="mb-3 text-xs font-semibold uppercase tracking-wide text-sap-text-muted">Access Configuration</h4>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Select id="permissionType" label="Permission Type" value={form.permissionType} onChange={(e) => updateField('permissionType', e.target.value as PermissionType)} options={PERMISSION_TYPE_OPTIONS.map((t) => ({ label: t, value: t }))} />
            <Select id="accessLevel" label="Access Level" value={form.accessLevel} onChange={(e) => updateField('accessLevel', e.target.value as AccessLevel)} options={ACCESS_LEVEL_OPTIONS.map((a) => ({ label: a, value: a }))} />
          </div>
          <Input id="parentPermission" label="Parent Permission (optional)" value={form.parentPermission} onChange={(e) => updateField('parentPermission', e.target.value)} />
          <label className="flex items-center gap-2 text-sm text-sap-text">
            <input type="checkbox" checked={form.isDefaultPermission} onChange={(e) => updateField('isDefaultPermission', e.target.checked)} className="h-4 w-4 rounded border-sap-border" />
            Default Permission
          </label>
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
            <label className="mb-1 block text-sm font-medium text-sap-text">Applicable Roles</label>
            <div className="flex flex-wrap gap-2">
              {dummyRoles.map((role) => (
                <button
                  key={role.id}
                  type="button"
                  onClick={() => toggleRole(role.id)}
                  className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                    form.applicableRoleIds.includes(role.id)
                      ? 'bg-sap-primary text-sap-primary-text'
                      : 'border border-sap-border bg-sap-surface text-sap-text-muted'
                  }`}
                >
                  {role.name}
                </button>
              ))}
            </div>
            {errors.applicableRoleIds && <p className="mt-1 text-xs text-sap-danger">{errors.applicableRoleIds}</p>}
          </div>
          <Select id="organizationScope" label="Organization Scope" value={form.organizationScope} onChange={(e) => updateField('organizationScope', e.target.value as PermissionOrganizationScope)} options={PERMISSION_ORGANIZATION_SCOPE_OPTIONS.map((s) => ({ label: s, value: s }))} />
          <Input id="description" label="Description (optional)" value={form.description} onChange={(e) => updateField('description', e.target.value)} />
        </div>
      </div>

      {serverError && <p className="text-sm text-sap-danger">{serverError}</p>}

      <div className="flex justify-end gap-2 pt-2">
        <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>
        <Button type="submit" isLoading={isPending}>{permission ? 'Update' : 'Save'}</Button>
      </div>
    </form>
  )
}
