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
import { dummyLocations } from '../../data/dummyLocations'
import { ROLE_OPTIONS, GENDER_OPTIONS, AUTHENTICATION_METHOD_OPTIONS, EMPLOYMENT_TYPE_OPTIONS } from '../../types/user'
import type { PlatformUser, UserAccountStatus, Gender, AuthenticationMethod, EmploymentType, UserRole } from '../../types/user'

interface FormState {
  firstName: string
  middleName: string
  lastName: string
  gender: Gender
  dateOfBirth: string
  employeeId: string
  email: string
  mobile: string
  alternateMobile: string
  alternateEmail: string
  username: string
  temporaryPassword: string
  authenticationMethod: AuthenticationMethod
  companyId: string
  businessUnitId: string
  departmentId: string
  branchId: string
  locationId: string
  designation: string
  reportingManager: string
  employmentType: EmploymentType
  joiningDate: string
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
  const firstLocation = dummyLocations.find((l) => l.businessUnitId === firstBU?.id)
  return {
    firstName: '',
    middleName: '',
    lastName: '',
    gender: 'Prefer not to say',
    dateOfBirth: '',
    employeeId: '',
    email: '',
    mobile: '',
    alternateMobile: '',
    alternateEmail: '',
    username: '',
    temporaryPassword: '',
    authenticationMethod: 'Password',
    companyId: firstCompany?.id ?? '',
    businessUnitId: firstBU?.id ?? '',
    departmentId: firstDept?.id ?? '',
    branchId: firstBranch?.id ?? '',
    locationId: firstLocation?.id ?? '',
    designation: '',
    reportingManager: '',
    employmentType: 'Full-Time',
    joiningDate: '',
    role: 'Employee',
    status: 'Pending Activation',
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
          middleName: user.middleName,
          lastName: user.lastName,
          gender: user.gender,
          dateOfBirth: user.dateOfBirth,
          employeeId: user.employeeId,
          email: user.email,
          mobile: user.mobile,
          alternateMobile: user.alternateMobile,
          alternateEmail: user.alternateEmail,
          username: user.username,
          temporaryPassword: '',
          authenticationMethod: user.authenticationMethod,
          companyId: user.companyId,
          businessUnitId: user.businessUnitId,
          departmentId: user.departmentId,
          branchId: user.branchId,
          locationId: user.locationId,
          designation: user.designation,
          reportingManager: user.reportingManager,
          employmentType: user.employmentType,
          joiningDate: user.joiningDate,
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

  function updateField<K extends keyof FormState>(key: K, value: FormState[K]) {
    setServerError(null)
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  const availableBUs = useMemo(() => dummyBusinessUnits.filter((u) => u.companyId === form.companyId), [form.companyId])
  const availableDepartments = useMemo(() => dummyDepartments.filter((d) => d.businessUnitId === form.businessUnitId), [form.businessUnitId])
  const availableBranches = useMemo(() => dummyBranches.filter((b) => b.businessUnitId === form.businessUnitId), [form.businessUnitId])
  const availableLocations = useMemo(() => dummyLocations.filter((l) => l.businessUnitId === form.businessUnitId), [form.businessUnitId])

  function handleCompanyChange(nextCompanyId: string) {
    const fallbackBU = dummyBusinessUnits.find((u) => u.companyId === nextCompanyId)
    const fallbackDept = dummyDepartments.find((d) => d.businessUnitId === fallbackBU?.id)
    const fallbackBranch = dummyBranches.find((b) => b.businessUnitId === fallbackBU?.id)
    const fallbackLocation = dummyLocations.find((l) => l.businessUnitId === fallbackBU?.id)
    setServerError(null)
    setForm((prev) => ({
      ...prev,
      companyId: nextCompanyId,
      businessUnitId: fallbackBU?.id ?? '',
      departmentId: fallbackDept?.id ?? '',
      branchId: fallbackBranch?.id ?? '',
      locationId: fallbackLocation?.id ?? '',
    }))
  }

  function handleBusinessUnitChange(nextBUId: string) {
    const fallbackDept = dummyDepartments.find((d) => d.businessUnitId === nextBUId)
    const fallbackBranch = dummyBranches.find((b) => b.businessUnitId === nextBUId)
    const fallbackLocation = dummyLocations.find((l) => l.businessUnitId === nextBUId)
    setServerError(null)
    setForm((prev) => ({
      ...prev,
      businessUnitId: nextBUId,
      departmentId: fallbackDept?.id ?? '',
      branchId: fallbackBranch?.id ?? '',
      locationId: fallbackLocation?.id ?? '',
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
      firstName, middleName, lastName, gender, dateOfBirth,
      employeeId, email, mobile, alternateMobile, alternateEmail,
      username, authenticationMethod,
      companyId, businessUnitId, departmentId, branchId, locationId,
      designation, reportingManager, employmentType, joiningDate, role,
    } = form
    const basePayload = {
      firstName, middleName, lastName, gender, dateOfBirth,
      employeeId, email, mobile, alternateMobile, alternateEmail,
      username, authenticationMethod,
      companyId, businessUnitId, departmentId, branchId, locationId,
      designation, reportingManager, employmentType, joiningDate, role,
    }

    if (user) {
      updateUser.mutate({ id: user.id, input: basePayload }, { onSuccess: () => onSuccess(), onError })
    } else {
      createUser.mutate(
        { ...basePayload, temporaryPassword: form.temporaryPassword, status: form.status },
        { onSuccess: () => { setForm(makeEmptyForm()); onSuccess() }, onError },
      )
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <h4 className="mb-3 text-xs font-semibold uppercase tracking-wide text-sap-text-muted">Personal Information</h4>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Input id="firstName" label="First Name" value={form.firstName} onChange={(e) => updateField('firstName', e.target.value)} error={errors.firstName} />
            <Input id="middleName" label="Middle Name (optional)" value={form.middleName} onChange={(e) => updateField('middleName', e.target.value)} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Input id="lastName" label="Last Name" value={form.lastName} onChange={(e) => updateField('lastName', e.target.value)} error={errors.lastName} />
            <Select id="gender" label="Gender (optional)" value={form.gender} onChange={(e) => updateField('gender', e.target.value as Gender)} options={GENDER_OPTIONS.map((g) => ({ label: g, value: g }))} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Input id="employeeId" label="Employee ID" value={form.employeeId} onChange={(e) => updateField('employeeId', e.target.value.toUpperCase())} error={errors.employeeId} />
            <Input id="dateOfBirth" label="Date of Birth (optional)" type="date" value={form.dateOfBirth} onChange={(e) => updateField('dateOfBirth', e.target.value)} />
          </div>
        </div>
      </div>

      <div>
        <h4 className="mb-3 text-xs font-semibold uppercase tracking-wide text-sap-text-muted">Contact Information</h4>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Input id="email" label="Email Address" type="email" value={form.email} onChange={(e) => updateField('email', e.target.value)} error={errors.email} />
            <Input id="mobile" label="Mobile Number" type="tel" value={form.mobile} onChange={(e) => updateField('mobile', e.target.value)} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Input id="alternateEmail" label="Alternate Email (optional)" type="email" value={form.alternateEmail} onChange={(e) => updateField('alternateEmail', e.target.value)} />
            <Input id="alternateMobile" label="Alternate Mobile (optional)" type="tel" value={form.alternateMobile} onChange={(e) => updateField('alternateMobile', e.target.value)} />
          </div>
        </div>
      </div>

      <div>
        <h4 className="mb-3 text-xs font-semibold uppercase tracking-wide text-sap-text-muted">Account Setup</h4>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Input id="username" label="Username" value={form.username} onChange={(e) => updateField('username', e.target.value)} error={errors.username} />
            <Select id="authenticationMethod" label="Authentication Method" value={form.authenticationMethod} onChange={(e) => updateField('authenticationMethod', e.target.value as AuthenticationMethod)} options={AUTHENTICATION_METHOD_OPTIONS.map((m) => ({ label: m, value: m }))} />
          </div>
          {!user && (
            <div className="grid grid-cols-2 gap-4">
              <Input id="temporaryPassword" label="Temporary Password (optional - auto-generated if blank)" value={form.temporaryPassword} onChange={(e) => updateField('temporaryPassword', e.target.value)} />
              <Select id="status" label="Account Status" value={form.status} onChange={(e) => updateField('status', e.target.value as UserAccountStatus)} options={[{ label: 'Pending Activation', value: 'Pending Activation' }, { label: 'Active', value: 'Active' }, { label: 'Inactive', value: 'Inactive' }, { label: 'Locked', value: 'Locked' }]} />
            </div>
          )}
        </div>
      </div>

      <div>
        <h4 className="mb-3 text-xs font-semibold uppercase tracking-wide text-sap-text-muted">Organization Assignment</h4>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Select id="companyId" label="Company" value={form.companyId} onChange={(e) => handleCompanyChange(e.target.value)} options={dummyCompanies.map((c) => ({ label: c.companyName, value: c.id }))} />
            <Select id="businessUnitId" label="Business Unit" value={form.businessUnitId} onChange={(e) => handleBusinessUnitChange(e.target.value)} options={availableBUs.map((u) => ({ label: u.name, value: u.id }))} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Select id="departmentId" label="Department" value={form.departmentId} onChange={(e) => updateField('departmentId', e.target.value)} options={availableDepartments.map((d) => ({ label: d.name, value: d.id }))} />
            <Select id="branchId" label="Branch" value={form.branchId} onChange={(e) => updateField('branchId', e.target.value)} options={availableBranches.map((b) => ({ label: b.name, value: b.id }))} />
          </div>
          <Select id="locationId" label="Location" value={form.locationId} onChange={(e) => updateField('locationId', e.target.value)} options={availableLocations.map((l) => ({ label: l.name, value: l.id }))} />
        </div>
      </div>

      <div>
        <h4 className="mb-3 text-xs font-semibold uppercase tracking-wide text-sap-text-muted">Employment Details</h4>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Input id="designation" label="Designation" value={form.designation} onChange={(e) => updateField('designation', e.target.value)} />
            <Input id="reportingManager" label="Reporting Manager (optional)" value={form.reportingManager} onChange={(e) => updateField('reportingManager', e.target.value)} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Select id="employmentType" label="Employment Type" value={form.employmentType} onChange={(e) => updateField('employmentType', e.target.value as EmploymentType)} options={EMPLOYMENT_TYPE_OPTIONS.map((t) => ({ label: t, value: t }))} />
            <Input id="joiningDate" label="Joining Date" type="date" value={form.joiningDate} onChange={(e) => updateField('joiningDate', e.target.value)} />
          </div>
          <Select id="role" label="Role" value={form.role} onChange={(e) => updateField('role', e.target.value as UserRole)} options={ROLE_OPTIONS.map((r) => ({ label: r, value: r }))} />
        </div>
      </div>

      {serverError && <p className="text-sm text-sap-danger">{serverError}</p>}

      <div className="flex justify-end gap-2 pt-2">
        <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>
        <Button type="submit" isLoading={isPending}>{user ? 'Update' : 'Register User'}</Button>
      </div>
    </form>
  )
}
