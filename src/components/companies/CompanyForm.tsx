import { useState, type FormEvent } from 'react'
import Input from '../common/Input'
import Select from '../common/Select'
import Button from '../common/Button'
import { useCreateCompany } from '../../hooks/mutations/useCreateCompany'
import { useUpdateCompany } from '../../hooks/mutations/useUpdateCompany'
import { BUSINESS_TYPE_OPTIONS, INDUSTRY_OPTIONS } from '../../types/company'
import type { Company, BusinessType, Industry, CompanyStatus } from '../../types/company'

interface FormState {
  companyName: string
  legalCompanyName: string
  companyCode: string
  registrationNumber: string
  taxId: string
  businessType: BusinessType
  industry: Industry
  website: string
  email: string
  mobile: string
  telephone: string
  country: string
  state: string
  city: string
  postalCode: string
  address: string
  status: CompanyStatus
}

interface FormErrors {
  companyName?: string
  companyCode?: string
  registrationNumber?: string
  email?: string
}

const emptyForm: FormState = {
  companyName: '',
  legalCompanyName: '',
  companyCode: '',
  registrationNumber: '',
  taxId: '',
  businessType: 'Private Limited',
  industry: 'IT & Software',
  website: '',
  email: '',
  mobile: '',
  telephone: '',
  country: 'India',
  state: '',
  city: '',
  postalCode: '',
  address: '',
  status: 'Active',
}

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

interface CompanyFormProps {
  company: Company | null
  onSuccess: () => void
  onCancel: () => void
}

export default function CompanyForm({ company, onSuccess, onCancel }: CompanyFormProps) {
  const [form, setForm] = useState<FormState>(
    company
      ? {
          companyName: company.companyName,
          legalCompanyName: company.legalCompanyName,
          companyCode: company.companyCode,
          registrationNumber: company.registrationNumber,
          taxId: company.taxId,
          businessType: company.businessType,
          industry: company.industry,
          website: company.website,
          email: company.email,
          mobile: company.mobile,
          telephone: company.telephone,
          country: company.country,
          state: company.state,
          city: company.city,
          postalCode: company.postalCode,
          address: company.address,
          status: company.status,
        }
      : emptyForm,
  )
  const [errors, setErrors] = useState<FormErrors>({})
  const [serverError, setServerError] = useState<string | null>(null)
  const createCompany = useCreateCompany()
  const updateCompany = useUpdateCompany()
  const isPending = createCompany.isPending || updateCompany.isPending

  function validate(): boolean {
    const nextErrors: FormErrors = {}
    if (!form.companyName.trim()) nextErrors.companyName = 'Company name is required'
    if (!form.companyCode.trim()) nextErrors.companyCode = 'Company code is required'
    if (!form.registrationNumber.trim()) nextErrors.registrationNumber = 'Registration number is required'
    if (!form.email.trim()) nextErrors.email = 'Email is required'
    else if (!isValidEmail(form.email)) nextErrors.email = 'Enter a valid email address'
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

    if (company) {
      updateCompany.mutate(
        { id: company.id, input: { ...form, logoUrl: company.logoUrl } },
        { onSuccess: () => onSuccess(), onError },
      )
    } else {
      createCompany.mutate({ ...form, logoUrl: null }, { onSuccess: () => { setForm(emptyForm); onSuccess() }, onError })
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <Input id="companyName" label="Company Name" value={form.companyName} onChange={(e) => setForm({ ...form, companyName: e.target.value })} error={errors.companyName} />
        <Input id="legalCompanyName" label="Legal Company Name" value={form.legalCompanyName} onChange={(e) => setForm({ ...form, legalCompanyName: e.target.value })} />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <Input id="companyCode" label="Company Code" value={form.companyCode} onChange={(e) => setForm({ ...form, companyCode: e.target.value.toUpperCase() })} error={errors.companyCode} />
        <Input id="registrationNumber" label="Registration Number" value={form.registrationNumber} onChange={(e) => setForm({ ...form, registrationNumber: e.target.value })} error={errors.registrationNumber} />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <Input id="taxId" label="Tax Identification Number" value={form.taxId} onChange={(e) => setForm({ ...form, taxId: e.target.value })} />
        <Input id="website" label="Website" value={form.website} onChange={(e) => setForm({ ...form, website: e.target.value })} />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <Select id="businessType" label="Business Type" value={form.businessType} onChange={(e) => setForm({ ...form, businessType: e.target.value as BusinessType })} options={BUSINESS_TYPE_OPTIONS.map((t) => ({ label: t, value: t }))} />
        <Select id="industry" label="Industry" value={form.industry} onChange={(e) => setForm({ ...form, industry: e.target.value as Industry })} options={INDUSTRY_OPTIONS.map((t) => ({ label: t, value: t }))} />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <Input id="email" label="Email Address" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} error={errors.email} />
        <Input id="mobile" label="Mobile Number" type="tel" value={form.mobile} onChange={(e) => setForm({ ...form, mobile: e.target.value })} />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <Input id="telephone" label="Telephone Number" type="tel" value={form.telephone} onChange={(e) => setForm({ ...form, telephone: e.target.value })} />
        <Input id="country" label="Country" value={form.country} onChange={(e) => setForm({ ...form, country: e.target.value })} />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <Input id="state" label="State" value={form.state} onChange={(e) => setForm({ ...form, state: e.target.value })} />
        <Input id="city" label="City" value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <Input id="postalCode" label="Postal Code" value={form.postalCode} onChange={(e) => setForm({ ...form, postalCode: e.target.value })} />
        <Select id="status" label="Organization Status" value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value as CompanyStatus })} options={[{ label: 'Active', value: 'Active' }, { label: 'Inactive', value: 'Inactive' }]} />
      </div>
      <Input id="address" label="Address" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} />

      {serverError && <p className="text-sm text-sap-danger">{serverError}</p>}

      <div className="flex justify-end gap-2 pt-2">
        <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>
        <Button type="submit" isLoading={isPending}>{company ? 'Save Changes' : 'Save Company'}</Button>
      </div>
    </form>
  )
}
