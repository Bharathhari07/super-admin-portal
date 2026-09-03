import { useState, type FormEvent } from 'react'
import Input from '../common/Input'
import Select from '../common/Select'
import Button from '../common/Button'
import { useCreateDataPermission } from '../../hooks/mutations/useCreateDataPermission'
import { useUpdateDataPermission } from '../../hooks/mutations/useUpdateDataPermission'
import { dummyRoles } from '../../data/dummyRoles'
import { ACCESS_SCOPE_OPTIONS, MODULE_OPTIONS } from '../../types/dataPermission'
import type { DataPermission, DataPermissionStatus, AccessScope } from '../../types/dataPermission'

interface FormState {
  name: string
  module: string
  roleId: string
  status: DataPermissionStatus
  accessScope: AccessScope
  recordOwnership: boolean
  reportingHierarchy: boolean
  dataFilter: string
  effectiveDate: string
  expiryDate: string
  canView: boolean
  canCreate: boolean
  canUpdate: boolean
  canDelete: boolean
  canApprove: boolean
  canExport: boolean
}

interface FormErrors {
  name?: string
  roleId?: string
  effectiveDate?: string
}

function makeEmptyForm(): FormState {
  return {
    name: '',
    module: MODULE_OPTIONS[0],
    roleId: dummyRoles[0]?.id ?? '',
    status: 'Active',
    accessScope: 'Self',
    recordOwnership: false,
    reportingHierarchy: false,
    dataFilter: '',
    effectiveDate: '',
    expiryDate: '',
    canView: true,
    canCreate: false,
    canUpdate: false,
    canDelete: false,
    canApprove: false,
    canExport: false,
  }
}

interface DataPermissionFormProps {
  permission: DataPermission | null
  onSuccess: () => void
  onCancel: () => void
}

export default function DataPermissionForm({ permission, onSuccess, onCancel }: DataPermissionFormProps) {
  const [form, setForm] = useState<FormState>(
    permission
      ? {
          name: permission.name,
          module: permission.module,
          roleId: permission.roleId,
          status: permission.status,
          accessScope: permission.accessScope,
          recordOwnership: permission.recordOwnership,
          reportingHierarchy: permission.reportingHierarchy,
          dataFilter: permission.dataFilter,
          effectiveDate: permission.effectiveDate,
          expiryDate: permission.expiryDate,
          canView: permission.canView,
          canCreate: permission.canCreate,
          canUpdate: permission.canUpdate,
          canDelete: permission.canDelete,
          canApprove: permission.canApprove,
          canExport: permission.canExport,
        }
      : makeEmptyForm(),
  )
  const [errors, setErrors] = useState<FormErrors>({})
  const [serverError, setServerError] = useState<string | null>(null)
  const createPermission = useCreateDataPermission()
  const updatePermission = useUpdateDataPermission()
  const isPending = createPermission.isPending || updatePermission.isPending

  function updateField<K extends keyof FormState>(key: K, value: FormState[K]) {
    setServerError(null)
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  function validate(): boolean {
    const nextErrors: FormErrors = {}
    if (!form.name.trim()) nextErrors.name = 'Permission name is required'
    if (!form.roleId) nextErrors.roleId = 'Role selection is required'
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

    if (permission) {
      const { status: _status, ...updatePayload } = form
      updatePermission.mutate({ id: permission.id, input: updatePayload }, { onSuccess: () => onSuccess(), onError })
    } else {
      createPermission.mutate(form, { onSuccess: () => { setForm(makeEmptyForm()); onSuccess() }, onError })
    }
  }

  const dataActions: { key: keyof FormState; label: string }[] = [
    { key: 'canView', label: 'View Data' },
    { key: 'canCreate', label: 'Create Data' },
    { key: 'canUpdate', label: 'Update Data' },
    { key: 'canDelete', label: 'Delete Data' },
    { key: 'canApprove', label: 'Approve Data' },
    { key: 'canExport', label: 'Export Data' },
  ]

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <h4 className="mb-3 text-xs font-semibold uppercase tracking-wide text-sap-text-muted">Permission Information</h4>
        <div className="space-y-4">
          <Input id="name" label="Permission Name" value={form.name} onChange={(e) => updateField('name', e.target.value)} error={errors.name} />
          <div className="grid grid-cols-2 gap-4">
            <Select id="module" label="Applicable Module" value={form.module} onChange={(e) => updateField('module', e.target.value)} options={MODULE_OPTIONS.map((m) => ({ label: m, value: m }))} />
            <div>
              <Select id="roleId" label="Applicable Role" value={form.roleId} onChange={(e) => updateField('roleId', e.target.value)} options={dummyRoles.map((r) => ({ label: r.name, value: r.id }))} />
              {errors.roleId && <p className="mt-1 text-xs text-sap-danger">{errors.roleId}</p>}
            </div>
          </div>
          {!permission && (
            <Select id="status" label="Status" value={form.status} onChange={(e) => updateField('status', e.target.value as DataPermissionStatus)} options={[{ label: 'Active', value: 'Active' }, { label: 'Inactive', value: 'Inactive' }]} />
          )}
        </div>
      </div>

      <div>
        <h4 className="mb-3 text-xs font-semibold uppercase tracking-wide text-sap-text-muted">Access Scope</h4>
        <div className="space-y-4">
          <Select id="accessScope" label="Access Scope" value={form.accessScope} onChange={(e) => updateField('accessScope', e.target.value as AccessScope)} options={ACCESS_SCOPE_OPTIONS.map((s) => ({ label: s, value: s }))} />
          <div className="flex flex-wrap gap-4">
            <label className="flex items-center gap-2 text-sm text-sap-text">
              <input type="checkbox" checked={form.recordOwnership} onChange={(e) => updateField('recordOwnership', e.target.checked)} className="h-4 w-4 rounded border-sap-border" />
              Record Ownership
            </label>
            <label className="flex items-center gap-2 text-sm text-sap-text">
              <input type="checkbox" checked={form.reportingHierarchy} onChange={(e) => updateField('reportingHierarchy', e.target.checked)} className="h-4 w-4 rounded border-sap-border" />
              Reporting Hierarchy
            </label>
          </div>
          <Input id="dataFilter" label="Data Filter (optional)" value={form.dataFilter} onChange={(e) => updateField('dataFilter', e.target.value)} placeholder="e.g. department_id = current_user.department_id" />
          <div className="grid grid-cols-2 gap-4">
            <Input id="effectiveDate" label="Effective Date" type="date" value={form.effectiveDate} onChange={(e) => updateField('effectiveDate', e.target.value)} error={errors.effectiveDate} />
            <Input id="expiryDate" label="Expiry Date (optional)" type="date" value={form.expiryDate} onChange={(e) => updateField('expiryDate', e.target.value)} />
          </div>
        </div>
      </div>

      <div>
        <h4 className="mb-3 text-xs font-semibold uppercase tracking-wide text-sap-text-muted">Data Actions</h4>
        <div className="flex flex-wrap gap-4">
          {dataActions.map(({ key, label }) => (
            <label key={key} className="flex items-center gap-2 text-sm text-sap-text">
              <input
                type="checkbox"
                checked={form[key] as boolean}
                onChange={(e) => updateField(key, e.target.checked as FormState[typeof key])}
                className="h-4 w-4 rounded border-sap-border"
              />
              {label}
            </label>
          ))}
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
