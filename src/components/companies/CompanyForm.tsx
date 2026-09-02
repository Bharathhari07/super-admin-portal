import { useState, type FormEvent } from 'react'
import Input from '../common/Input'
import Select from '../common/Select'
import Button from '../common/Button'
import { useCreateCompany } from '../../hooks/mutations/useCreateCompany'
import { useUpdateCompany } from '../../hooks/mutations/useUpdateCompany'
import {
  COMPANY_TYPE_OPTIONS,
  LEGAL_ENTITY_TYPE_OPTIONS,
  INDUSTRY_OPTIONS,
  CURRENCY_OPTIONS,
  FINANCIAL_YEAR_OPTIONS,
  LANGUAGE_OPTIONS,
  WORKING_CALENDAR_OPTIONS,
  TIME_ZONE_OPTIONS,
} from '../../types/company'
import type { Company, CompanyType, LegalEntityType, Industry, CompanyStatus } from '../../types/company'

interface FormState {
  companyName: string
  legalCompanyName: string
  companyCode: string
  companyType: CompanyType
  industry: Industry
  status: CompanyStatus
  registrationNumber: string
  gstVatNumber: string
  taxId: string
  incorporationDate: string
  registrationCountry: string
  legalEntityType: LegalEntityType
  primaryContactPerson: string
  email: string
  mobile: string
  telephone: string
  website: string
  addressLine1: string
  addressLine2: string
  city: string
  state: string
  country: string
  postalCode: string
  defaultCurrency: string
  financialYear: string
  timeZone: string
  defaultLanguage: string
  workingCalendar: string
  logoUrl: string
}

interface FormErrors {
  companyName?: string
  companyCode?: string
  registrationNumber?: string
  email?: string
  incorporationDate?: string
}

const emptyForm: FormState = {
  companyName: '',
  legalCompanyName: '',
  companyCode: '',
  companyType: 'Standalone',
  industry: 'IT & Software',
  status: 'Draft',
  registrationNumber: '',
  gstVatNumber: '',
  taxId: '',
  incorporationDate: '',
  registrationCountry: 'India',
  legalEntityType: 'Private Limited',
  primaryContactPerson: '',
  email: '',
  mobile: '',
  telephone: '',
  website: '',
  addressLine1: '',
  addressLine2: '',
  city: '',
  state: '',
  country: 'India',
  postalCode: '',
  defaultCurrency: 'INR',
  financialYear: 'Apr - Mar',
  timeZone: 'Asia/Kolkata',
  defaultLanguage: 'English',
  workingCalendar: 'Standard 5-Day',
  logoUrl: '',
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
          companyType: company.companyType,
          industry: company.industry,
          status: company.status,
          registrationNumber: company.registrationNumber,
          gstVatNumber: company.gstVatNumber,
          taxId: company.taxId,
          incorporationDate: company.incorporationDate,
          registrationCountry: company.registrationCountry,
          legalEntityType: company.legalEntityType,
          primaryContactPerson: company.primaryContactPerson,
          email: company.email,
          mobile: company.mobile,
          telephone: company.telephone,
          website: company.website,
          addressLine1: company.addressLine1,
          addressLine2: company.addressLine2,
          city: company.city,
          state: company.state,
          country: company.country,
          postalCode: company.postalCode,
          defaultCurrency: company.defaultCurrency,
          financialYear: company.financialYear,
          timeZone: company.timeZone,
          defaultLanguage: company.defaultLanguage,
          workingCalendar: company.workingCalendar,
          logoUrl: company.logoUrl,
        }
      : emptyForm,
  )
  const [errors, setErrors] = useState<FormErrors>({})
  const [serverError, setServerError] = useState<string | null>(null)
  const createCompany = useCreateCompany()
  const updateCompany = useUpdateCompany()
  const isPending = createCompany.isPending || updateCompany.isPending

  function updateField<K extends keyof FormState>(key: K, value: FormState[K]) {
    setServerError(null)
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  function validate(): boolean {
    const nextErrors: FormErrors = {}
    if (!form.companyName.trim()) nextErrors.companyName = 'Company name is required'
    if (!form.companyCode.trim()) nextErrors.companyCode = 'Company code is required'
    if (!form.registrationNumber.trim()) nextErrors.registrationNumber = 'Business registration number is required'
    if (!form.email.trim()) nextErrors.email = 'Email is required'
    else if (!isValidEmail(form.email)) nextErrors.email = 'Enter a valid email address'
    if (!form.incorporationDate.trim()) nextErrors.incorporationDate = 'Incorporation date is required'
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
      const { status: _status, ...updatePayload } = form
      updateCompany.mutate({ id: company.id, input: updatePayload }, { onSuccess: () => onSuccess(), onError })
    } else {
      createCompany.mutate(form, { onSuccess: () => { setForm(emptyForm); onSuccess() }, onError })
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <h4 className="mb-3 text-xs font-semibold uppercase tracking-wide text-sap-text-muted">Company Information</h4>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Input id="companyName" label="Company Name" value={form.companyName} onChange={(e) => updateField('companyName', e.target.value)} error={errors.companyName} />
            <Input id="legalCompanyName" label="Legal Company Name" value={form.legalCompanyName} onChange={(e) => updateField('legalCompanyName', e.target.value)} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Input id="companyCode" label="Company Code" value={form.companyCode} onChange={(e) => updateField('companyCode', e.target.value.toUpperCase())} error={errors.companyCode} />
            <Select id="companyType" label="Company Type" value={form.companyType} onChange={(e) => updateField('companyType', e.target.value as CompanyType)} options={COMPANY_TYPE_OPTIONS.map((t) => ({ label: t, value: t }))} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Select id="industry" label="Industry Type" value={form.industry} onChange={(e) => updateField('industry', e.target.value as Industry)} options={INDUSTRY_OPTIONS.map((t) => ({ label: t, value: t }))} />
            <Select id="status" label="Company Status" value={form.status} onChange={(e) => updateField('status', e.target.value as CompanyStatus)} options={[{ label: 'Draft', value: 'Draft' }, { label: 'Active', value: 'Active' }, { label: 'Inactive', value: 'Inactive' }]} />
          </div>
        </div>
      </div>

      <div>
        <h4 className="mb-3 text-xs font-semibold uppercase tracking-wide text-sap-text-muted">Legal Registration Information</h4>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Input id="registrationNumber" label="Business Registration Number" value={form.registrationNumber} onChange={(e) => updateField('registrationNumber', e.target.value)} error={errors.registrationNumber} />
            <Input id="gstVatNumber" label="GST / VAT Number" value={form.gstVatNumber} onChange={(e) => updateField('gstVatNumber', e.target.value)} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Input id="taxId" label="PAN / Tax Identification Number" value={form.taxId} onChange={(e) => updateField('taxId', e.target.value)} />
            <Input id="incorporationDate" label="Incorporation Date" type="date" value={form.incorporationDate} onChange={(e) => updateField('incorporationDate', e.target.value)} error={errors.incorporationDate} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Input id="registrationCountry" label="Registration Country" value={form.registrationCountry} onChange={(e) => updateField('registrationCountry', e.target.value)} />
            <Select id="legalEntityType" label="Legal Entity Type" value={form.legalEntityType} onChange={(e) => updateField('legalEntityType', e.target.value as LegalEntityType)} options={LEGAL_ENTITY_TYPE_OPTIONS.map((t) => ({ label: t, value: t }))} />
          </div>
        </div>
      </div>

      <div>
        <h4 className="mb-3 text-xs font-semibold uppercase tracking-wide text-sap-text-muted">Contact Information</h4>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Input id="primaryContactPerson" label="Primary Contact Person" value={form.primaryContactPerson} onChange={(e) => updateField('primaryContactPerson', e.target.value)} />
            <Input id="email" label="Official Email" type="email" value={form.email} onChange={(e) => updateField('email', e.target.value)} error={errors.email} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Input id="mobile" label="Mobile Number" type="tel" value={form.mobile} onChange={(e) => updateField('mobile', e.target.value)} />
            <Input id="telephone" label="Telephone Number" type="tel" value={form.telephone} onChange={(e) => updateField('telephone', e.target.value)} />
          </div>
          <Input id="website" label="Company Website" value={form.website} onChange={(e) => updateField('website', e.target.value)} />
        </div>
      </div>

      <div>
        <h4 className="mb-3 text-xs font-semibold uppercase tracking-wide text-sap-text-muted">Registered Address</h4>
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
        </div>
      </div>

      <div>
        <h4 className="mb-3 text-xs font-semibold uppercase tracking-wide text-sap-text-muted">Operational Configuration</h4>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Select id="defaultCurrency" label="Default Currency" value={form.defaultCurrency} onChange={(e) => updateField('defaultCurrency', e.target.value)} options={CURRENCY_OPTIONS.map((c) => ({ label: c, value: c }))} />
            <Select id="financialYear" label="Financial Year" value={form.financialYear} onChange={(e) => updateField('financialYear', e.target.value)} options={FINANCIAL_YEAR_OPTIONS.map((f) => ({ label: f, value: f }))} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Select id="timeZone" label="Time Zone" value={form.timeZone} onChange={(e) => updateField('timeZone', e.target.value)} options={TIME_ZONE_OPTIONS.map((t) => ({ label: t, value: t }))} />
            <Select id="defaultLanguage" label="Default Language" value={form.defaultLanguage} onChange={(e) => updateField('defaultLanguage', e.target.value)} options={LANGUAGE_OPTIONS.map((l) => ({ label: l, value: l }))} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Select id="workingCalendar" label="Working Calendar" value={form.workingCalendar} onChange={(e) => updateField('workingCalendar', e.target.value)} options={WORKING_CALENDAR_OPTIONS.map((w) => ({ label: w, value: w }))} />
            <Input id="logoUrl" label="Company Logo (image URL)" value={form.logoUrl} onChange={(e) => updateField('logoUrl', e.target.value)} placeholder="https://example.com/logo.png" />
          </div>
        </div>
      </div>

      {serverError && <p className="text-sm text-sap-danger">{serverError}</p>}

      <div className="flex justify-end gap-2 pt-2">
        <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>
        <Button type="submit" isLoading={isPending}>{company ? 'Update Company' : 'Save Company'}</Button>
      </div>
    </form>
  )
}
