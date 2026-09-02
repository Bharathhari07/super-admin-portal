import { useState, useMemo, type FormEvent } from 'react'
import Input from '../common/Input'
import Select from '../common/Select'
import Button from '../common/Button'
import { useCreateLocation } from '../../hooks/mutations/useCreateLocation'
import { useUpdateLocation } from '../../hooks/mutations/useUpdateLocation'
import { dummyCompanies } from '../../data/dummyCompanies'
import { dummyBusinessUnits } from '../../data/dummyBusinessUnits'
import { dummyDepartments } from '../../data/dummyDepartments'
import { dummyBranches } from '../../data/dummyBranches'
import { LOCATION_TYPE_OPTIONS, WEEK_DAY_OPTIONS, TIME_ZONE_OPTIONS, WORKING_CALENDAR_OPTIONS } from '../../types/location'
import type { Location, LocationStatus, LocationType, WeekDay } from '../../types/location'

interface FormState {
  companyId: string
  businessUnitId: string
  departmentId: string
  branchId: string
  name: string
  code: string
  locationType: LocationType
  locationManager: string
  contactEmail: string
  contactNumber: string
  addressLine1: string
  addressLine2: string
  city: string
  state: string
  country: string
  postalCode: string
  latitude: string
  longitude: string
  timeZone: string
  workingCalendar: string
  weeklyHolidays: WeekDay[]
  maximumCapacity: string
  description: string
  status: LocationStatus
}

interface FormErrors {
  name?: string
  code?: string
  branchId?: string
  locationManager?: string
}

function makeEmptyForm(): FormState {
  const firstCompany = dummyCompanies[0]
  const firstBU = dummyBusinessUnits.find((u) => u.companyId === firstCompany?.id)
  const firstDept = dummyDepartments.find((d) => d.businessUnitId === firstBU?.id)
  const firstBranch = dummyBranches.find((b) => b.businessUnitId === firstBU?.id)
  return {
    companyId: firstCompany?.id ?? '',
    businessUnitId: firstBU?.id ?? '',
    departmentId: firstDept?.id ?? '',
    branchId: firstBranch?.id ?? '',
    name: '',
    code: '',
    locationType: 'Office',
    locationManager: '',
    contactEmail: '',
    contactNumber: '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: '',
    country: 'India',
    postalCode: '',
    latitude: '',
    longitude: '',
    timeZone: 'Asia/Kolkata',
    workingCalendar: 'Standard 5-Day',
    weeklyHolidays: ['Saturday', 'Sunday'],
    maximumCapacity: '',
    description: '',
    status: 'Active',
  }
}

interface LocationFormProps {
  location: Location | null
  onSuccess: () => void
  onCancel: () => void
}

export default function LocationForm({ location, onSuccess, onCancel }: LocationFormProps) {
  const [form, setForm] = useState<FormState>(
    location
      ? {
          companyId: location.companyId,
          businessUnitId: location.businessUnitId,
          departmentId: location.departmentId,
          branchId: location.branchId,
          name: location.name,
          code: location.code,
          locationType: location.locationType,
          locationManager: location.locationManager,
          contactEmail: location.contactEmail,
          contactNumber: location.contactNumber,
          addressLine1: location.addressLine1,
          addressLine2: location.addressLine2,
          city: location.city,
          state: location.state,
          country: location.country,
          postalCode: location.postalCode,
          latitude: location.latitude,
          longitude: location.longitude,
          timeZone: location.timeZone,
          workingCalendar: location.workingCalendar,
          weeklyHolidays: location.weeklyHolidays,
          maximumCapacity: location.maximumCapacity,
          description: location.description,
          status: location.status,
        }
      : makeEmptyForm(),
  )
  const [errors, setErrors] = useState<FormErrors>({})
  const [serverError, setServerError] = useState<string | null>(null)
  const createLoc = useCreateLocation()
  const updateLoc = useUpdateLocation()
  const isPending = createLoc.isPending || updateLoc.isPending

  function updateField<K extends keyof FormState>(key: K, value: FormState[K]) {
    setServerError(null)
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  const availableBUs = useMemo(() => dummyBusinessUnits.filter((u) => u.companyId === form.companyId), [form.companyId])
  const availableDepartments = useMemo(() => dummyDepartments.filter((d) => d.businessUnitId === form.businessUnitId), [form.businessUnitId])
  const availableBranches = useMemo(() => dummyBranches.filter((b) => b.businessUnitId === form.businessUnitId), [form.businessUnitId])

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

  function toggleHoliday(day: WeekDay) {
    setServerError(null)
    setForm((prev) => ({
      ...prev,
      weeklyHolidays: prev.weeklyHolidays.includes(day)
        ? prev.weeklyHolidays.filter((d) => d !== day)
        : [...prev.weeklyHolidays, day],
    }))
  }

  function validate(): boolean {
    const nextErrors: FormErrors = {}
    if (!form.name.trim()) nextErrors.name = 'Location name is required'
    if (!form.code.trim()) nextErrors.code = 'Location code is required'
    if (!form.branchId) nextErrors.branchId = 'Branch selection is required'
    if (!form.locationManager.trim()) nextErrors.locationManager = 'Location manager is required'
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

    if (location) {
      updateLoc.mutate({ id: location.id, input: form }, { onSuccess: () => onSuccess(), onError })
    } else {
      createLoc.mutate(form, { onSuccess: () => { setForm(makeEmptyForm()); onSuccess() }, onError })
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <h4 className="mb-3 text-xs font-semibold uppercase tracking-wide text-sap-text-muted">Location Information</h4>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Select id="companyId" label="Company" value={form.companyId} onChange={(e) => handleCompanyChange(e.target.value)} options={dummyCompanies.map((c) => ({ label: c.companyName, value: c.id }))} />
            <Select id="businessUnitId" label="Business Unit" value={form.businessUnitId} onChange={(e) => updateField('businessUnitId', e.target.value)} options={availableBUs.map((u) => ({ label: u.name, value: u.id }))} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Select id="branchId" label="Branch" value={form.branchId} onChange={(e) => updateField('branchId', e.target.value)} options={availableBranches.map((b) => ({ label: b.name, value: b.id }))} />
              {errors.branchId && <p className="mt-1 text-xs text-sap-danger">{errors.branchId}</p>}
            </div>
            <Select id="departmentId" label="Department (optional)" value={form.departmentId} onChange={(e) => updateField('departmentId', e.target.value)} options={[{ label: 'None', value: '' }, ...availableDepartments.map((d) => ({ label: d.name, value: d.id }))]} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Input id="name" label="Location Name" value={form.name} onChange={(e) => updateField('name', e.target.value)} error={errors.name} />
            <Input id="code" label="Location Code" value={form.code} onChange={(e) => updateField('code', e.target.value.toUpperCase())} error={errors.code} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Select id="locationType" label="Location Type" value={form.locationType} onChange={(e) => updateField('locationType', e.target.value as LocationType)} options={LOCATION_TYPE_OPTIONS.map((t) => ({ label: t, value: t }))} />
            <Select id="status" label="Status" value={form.status} onChange={(e) => updateField('status', e.target.value as LocationStatus)} options={[{ label: 'Active', value: 'Active' }, { label: 'Inactive', value: 'Inactive' }]} />
          </div>
        </div>
      </div>

      <div>
        <h4 className="mb-3 text-xs font-semibold uppercase tracking-wide text-sap-text-muted">Manager & Contact</h4>
        <div className="space-y-4">
          <Input id="locationManager" label="Location Manager" value={form.locationManager} onChange={(e) => updateField('locationManager', e.target.value)} error={errors.locationManager} />
          <div className="grid grid-cols-2 gap-4">
            <Input id="contactEmail" label="Contact Email" type="email" value={form.contactEmail} onChange={(e) => updateField('contactEmail', e.target.value)} />
            <Input id="contactNumber" label="Contact Number" type="tel" value={form.contactNumber} onChange={(e) => updateField('contactNumber', e.target.value)} />
          </div>
        </div>
      </div>

      <div>
        <h4 className="mb-3 text-xs font-semibold uppercase tracking-wide text-sap-text-muted">Address</h4>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Input id="addressLine1" label="Address Line 1" value={form.addressLine1} onChange={(e) => updateField('addressLine1', e.target.value)} />
            <Input id="addressLine2" label="Address Line 2" value={form.addressLine2} onChange={(e) => updateField('addressLine2', e.target.value)} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Input id="city" label="City" value={form.city} onChange={(e) => updateField('city', e.target.value)} />
            <Input id="state" label="State" value={form.state} onChange={(e) => updateField('state', e.target.value)} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Input id="country" label="Country" value={form.country} onChange={(e) => updateField('country', e.target.value)} />
            <Input id="postalCode" label="Postal Code" value={form.postalCode} onChange={(e) => updateField('postalCode', e.target.value)} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Input id="latitude" label="Latitude (optional)" value={form.latitude} onChange={(e) => updateField('latitude', e.target.value)} />
            <Input id="longitude" label="Longitude (optional)" value={form.longitude} onChange={(e) => updateField('longitude', e.target.value)} />
          </div>
        </div>
      </div>

      <div>
        <h4 className="mb-3 text-xs font-semibold uppercase tracking-wide text-sap-text-muted">Operations</h4>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Select id="timeZone" label="Time Zone" value={form.timeZone} onChange={(e) => updateField('timeZone', e.target.value)} options={TIME_ZONE_OPTIONS.map((t) => ({ label: t, value: t }))} />
            <Select id="workingCalendar" label="Working Calendar" value={form.workingCalendar} onChange={(e) => updateField('workingCalendar', e.target.value)} options={WORKING_CALENDAR_OPTIONS.map((w) => ({ label: w, value: w }))} />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-sap-text">Weekly Holidays</label>
            <div className="flex flex-wrap gap-2">
              {WEEK_DAY_OPTIONS.map((day) => (
                <button
                  key={day}
                  type="button"
                  onClick={() => toggleHoliday(day)}
                  className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                    form.weeklyHolidays.includes(day)
                      ? 'bg-sap-primary text-sap-primary-text'
                      : 'border border-sap-border bg-sap-surface text-sap-text-muted'
                  }`}
                >
                  {day.slice(0, 3)}
                </button>
              ))}
            </div>
          </div>
          <Input id="maximumCapacity" label="Maximum Capacity (optional)" type="number" value={form.maximumCapacity} onChange={(e) => updateField('maximumCapacity', e.target.value)} />
          <Input id="description" label="Description" value={form.description} onChange={(e) => updateField('description', e.target.value)} />
        </div>
      </div>

      {serverError && <p className="text-sm text-sap-danger">{serverError}</p>}

      <div className="flex justify-end gap-2 pt-2">
        <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>
        <Button type="submit" isLoading={isPending}>{location ? 'Update' : 'Save'}</Button>
      </div>
    </form>
  )
}
