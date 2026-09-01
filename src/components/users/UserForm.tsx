import { useState, useMemo, type FormEvent } from 'react'
import Input from '../common/Input'
import Select from '../common/Select'
import Button from '../common/Button'
import { useCreateUser } from '../../hooks/mutations/useCreateUser'
import { useUpdateUser } from '../../hooks/mutations/useUpdateUser'
import { dummyCompanies } from '../../data/dummyCompanies'
import { dummyBusinessUnits } from '../../data/dummyBusinessUnits'
import { dummyDepartments } from '../../data/dummyDepartments'
import { dummyBranches } from '../../data/dummyBranches'
import { ROLE_OPTIONS } from '../../types/user'
import type { PlatformUser, UserAccountStatus, EmploymentType, UserRole } from '../../types/user'

const EMPLOYMENT_TYPE_OPTIONS: EmploymentType[] = ['Full-Time', 'Part-Time', 'Contract', 'Intern']

interface FormState {
  firstName: string
  lastName: string
  employeeId: string
  email: string
  mobile: string
  companyId: string
  businessUnitId: string
  departmentId: string
  branchId: string
  designation: string
  reportingManager: string
  employmentType: EmploymentType
  joiningDate: string
  username: string
  role: UserRole
  status: UserAccountStatus
}

interface FormErrors {
  firstName?: string
  lastName?: string
  employeeId?: string
  email?: string
  username?: string
}

function makeEmptyForm(): FormState {
  const firstCompany = dummyCompanies[0]
  const firstBU = dummyBusinessUnits.find((u) => u.companyId === firstCompany?.id)
  const firstDept = dummyDepartments.find((d) => d.businessUnitId === firstBU?.id)
  const firstBranch = dummyBranches.find((b) => b.businessUnitId === firstBU?.id)
  return {
    firstName: '',
    lastName: '',
    employeeId: '',
    email: '',
    mobile: '',
    companyId: firstCompany?.id ?? '',
    businessUnitId: firstBU?.id ?? '',
    departmentId: firstDept?.id ?? '',
    branchId: firstBranch?.id ?? '',
    designation: '',
    reportingManager: '',
    employmentType: 'Full-Time',
    joiningDate: '',
    username: '',
    role: 'Employee',
    status: 'Active',
  }
}

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

interface UserFormProps {
  user: PlatformUser | null
  onSuccess: () => void
  onCancel: () => void
}

export default function UserForm({ user, onSuccess, onCancel }: UserFormProps) {
  const [form, setForm] = useState<FormState>(
    user
      ? {
          firstName: user.firstName,
          lastName: user.lastName,
          employeeId: user.employeeId,
          email: user.email,
          mobile: user.mobile,
          companyId: user.companyId,
          businessUnitId: user.businessUnitId,
          departmentId: user.departmentId,
          branchId: user.branchId,
          designation: user.designation,
          reportingManager: user.reportingManager,
          employmentType: user.employmentType,
          joiningDate: user.joiningDate,
          username: user.username,
          role: user.role,
          status: user.status,
        }
      : makeEmptyForm(),
  )
  const [errors, setErrors] = useState<FormErrors>({})
  const [serverError, setServerError] = useState<string | null>(null)
  const createUser = useCreateUser()
  const updateUser = useUpdateUser()
  const isPending = createUser.isPending || updateUser.isPending

  // Clears any lingering server error the moment the person edits a
  // field again, so a stale message from a previous submit attempt
  // doesn't sit on screen looking like the new edit didn't take.
  function updateField<K extends keyof FormState>(key: K, value: FormState[K]) {
    setServerError(null)
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  const availableBUs = useMemo(
    () => dummyBusinessUnits.filter((u) => u.companyId === form.companyId),
    [form.companyId],
  )
  const availableDepartments = useMemo(
    () => dummyDepartments.filter((d) => d.businessUnitId === form.businessUnitId),
    [form.businessUnitId],
  )
  const availableBranches = useMemo(
    () => dummyBranches.filter((b) => b.businessUnitId === form.businessUnitId),
    [form.businessUnitId],
  )

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
    if (!form.firstName.trim()) nextErrors.firstName = 'First name is required'
    if (!form.lastName.trim()) nextErrors.lastName = 'Last name is required'
    if (!form.employeeId.trim()) nextErrors.employeeId = 'Employee ID is required'
    if (!form.email.trim()) nextErrors.email = 'Email is required'
    else if (!isValidEmail(form.email)) nextErrors.email = 'Enter a valid email address'
    if (!form.username.trim()) nextErrors.username = 'Username is required'
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
    const {
      firstName,
      lastName,
      employeeId,
      email,
      mobile,
      companyId,
      businessUnitId,
      departmentId,
      branchId,
      designation,
      reportingManager,
      employmentType,
      joiningDate,
      username,
      role,
    } = form
    const payload = {
      firstName,
      lastName,
      employeeId,
      email,
      mobile,
      companyId,
      businessUnitId,
      departmentId,
      branchId,
      designation,
      reportingManager,
      employmentType,
      joiningDate,
      username,
      role,
    }

    if (user) {
      updateUser.mutate({ id: user.id, input: payload }, { onSuccess: () => onSuccess(), onError })
    } else {
      createUser.mutate(
        { ...payload, status: form.status },
        { onSuccess: () => { setForm(makeEmptyForm()); onSuccess() }, onError },
      )
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <Input id="firstName" label="First Name" value={form.firstName} onChange={(e) => updateField('firstName', e.target.value)} error={errors.firstName} />
        <Input id="lastName" label="Last Name" value={form.lastName} onChange={(e) => updateField('lastName', e.target.value)} error={errors.lastName} />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <Input id="employeeId" label="Employee ID" value={form.employeeId} onChange={(e) => updateField('employeeId', e.target.value.toUpperCase())} error={errors.employeeId} />
        <Input id="email" label="Official Email" type="email" value={form.email} onChange={(e) => updateField('email', e.target.value)} error={errors.email} />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <Input id="mobile" label="Mobile Number" type="tel" value={form.mobile} onChange={(e) => updateField('mobile', e.target.value)} />
        <Input id="username" label="Username" value={form.username} onChange={(e) => updateField('username', e.target.value)} error={errors.username} />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Select
          id="companyId"
          label="Organization"
          value={form.companyId}
          onChange={(e) => handleCompanyChange(e.target.value)}
          options={dummyCompanies.map((c) => ({ label: c.companyName, value: c.id }))}
        />
        <Select
          id="businessUnitId"
          label="Business Unit"
          value={form.businessUnitId}
          onChange={(e) => handleBusinessUnitChange(e.target.value)}
          options={availableBUs.map((u) => ({ label: u.name, value: u.id }))}
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <Select
          id="departmentId"
          label="Department"
          value={form.departmentId}
          onChange={(e) => updateField('departmentId', e.target.value)}
          options={availableDepartments.map((d) => ({ label: d.name, value: d.id }))}
        />
        <Select
          id="branchId"
          label="Branch"
          value={form.branchId}
          onChange={(e) => updateField('branchId', e.target.value)}
          options={availableBranches.map((b) => ({ label: b.name, value: b.id }))}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Input id="designation" label="Designation" value={form.designation} onChange={(e) => updateField('designation', e.target.value)} />
        <Input id="reportingManager" label="Reporting Manager" value={form.reportingManager} onChange={(e) => updateField('reportingManager', e.target.value)} />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <Select
          id="employmentType"
          label="Employment Type"
          value={form.employmentType}
          onChange={(e) => updateField('employmentType', e.target.value as EmploymentType)}
          options={EMPLOYMENT_TYPE_OPTIONS.map((t) => ({ label: t, value: t }))}
        />
        <Input id="joiningDate" label="Joining Date" type="date" value={form.joiningDate} onChange={(e) => updateField('joiningDate', e.target.value)} />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <Select
          id="role"
          label="Role"
          value={form.role}
          onChange={(e) => updateField('role', e.target.value as UserRole)}
          options={ROLE_OPTIONS.map((r) => ({ label: r, value: r }))}
        />
        <Select
          id="status"
          label="Account Status"
          value={form.status}
          onChange={(e) => updateField('status', e.target.value as UserAccountStatus)}
          options={[{ label: 'Active', value: 'Active' }, { label: 'Inactive', value: 'Inactive' }, { label: 'Locked', value: 'Locked' }]}
        />
      </div>

      {serverError && <p className="text-sm text-sap-danger">{serverError}</p>}

      <div className="flex justify-end gap-2 pt-2">
        <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>
        <Button type="submit" isLoading={isPending}>{user ? 'Update' : 'Register User'}</Button>
      </div>
    </form>
  )
}