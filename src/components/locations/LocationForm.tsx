import { useState, type FormEvent } from 'react'
import Input from '../common/Input'
import Select from '../common/Select'
import Button from '../common/Button'
import { useCreateLocation } from '../../hooks/mutations/useCreateLocation'
import { useUpdateLocation } from '../../hooks/mutations/useUpdateLocation'
import { dummyBranches } from '../../data/dummyBranches'
import { LOCATION_TYPE_OPTIONS } from '../../types/location'
import type { Location, LocationStatus, LocationType } from '../../types/location'

interface FormState {
  name: string
  code: string
  branchId: string
  locationType: LocationType
  address: string
  city: string
  state: string
  country: string
  postalCode: string
  latitude: string
  longitude: string
  status: LocationStatus
}

interface FormErrors {
  name?: string
  code?: string
  branchId?: string
}

function makeEmptyForm(): FormState {
  return {
    name: '',
    code: '',
    branchId: dummyBranches[0]?.id ?? '',
    locationType: 'Regional Office',
    address: '',
    city: '',
    state: '',
    country: 'India',
    postalCode: '',
    latitude: '',
    longitude: '',
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
          name: location.name,
          code: location.code,
          branchId: location.branchId,
          locationType: location.locationType,
          address: location.address,
          city: location.city,
          state: location.state,
          country: location.country,
          postalCode: location.postalCode,
          latitude: location.latitude,
          longitude: location.longitude,
          status: location.status,
        }
      : makeEmptyForm(),
  )
  const [errors, setErrors] = useState<FormErrors>({})
  const [serverError, setServerError] = useState<string | null>(null)
  const createLoc = useCreateLocation()
  const updateLoc = useUpdateLocation()
  const isPending = createLoc.isPending || updateLoc.isPending

  function validate(): boolean {
    const nextErrors: FormErrors = {}
    if (!form.name.trim()) nextErrors.name = 'Location name is required'
    if (!form.code.trim()) nextErrors.code = 'Location code is required'
    if (!form.branchId) nextErrors.branchId = 'Branch selection is required'
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
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Select
            id="branchId"
            label="Branch"
            value={form.branchId}
            onChange={(e) => setForm({ ...form, branchId: e.target.value })}
            options={dummyBranches.map((b) => ({ label: b.name, value: b.id }))}
          />
          {errors.branchId && <p className="mt-1 text-xs text-sap-danger">{errors.branchId}</p>}
        </div>
        <Select
          id="locationType"
          label="Location Type"
          value={form.locationType}
          onChange={(e) => setForm({ ...form, locationType: e.target.value as LocationType })}
          options={LOCATION_TYPE_OPTIONS.map((t) => ({ label: t, value: t }))}
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <Input id="name" label="Location Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} error={errors.name} />
        <Input id="code" label="Location Code" value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase() })} error={errors.code} />
      </div>
      <Input id="address" label="Address" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} />
      <div className="grid grid-cols-2 gap-4">
        <Input id="city" label="City" value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} />
        <Input id="state" label="State" value={form.state} onChange={(e) => setForm({ ...form, state: e.target.value })} />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <Input id="country" label="Country" value={form.country} onChange={(e) => setForm({ ...form, country: e.target.value })} />
        <Input id="postalCode" label="Postal Code" value={form.postalCode} onChange={(e) => setForm({ ...form, postalCode: e.target.value })} />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <Input id="latitude" label="Latitude (optional)" value={form.latitude} onChange={(e) => setForm({ ...form, latitude: e.target.value })} />
        <Input id="longitude" label="Longitude (optional)" value={form.longitude} onChange={(e) => setForm({ ...form, longitude: e.target.value })} />
      </div>
      <Select
        id="status"
        label="Status"
        value={form.status}
        onChange={(e) => setForm({ ...form, status: e.target.value as LocationStatus })}
        options={[{ label: 'Active', value: 'Active' }, { label: 'Inactive', value: 'Inactive' }]}
      />

      {serverError && <p className="text-sm text-sap-danger">{serverError}</p>}

      <div className="flex justify-end gap-2 pt-2">
        <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>
        <Button type="submit" isLoading={isPending}>{location ? 'Update' : 'Save'}</Button>
      </div>
    </form>
  )
}
