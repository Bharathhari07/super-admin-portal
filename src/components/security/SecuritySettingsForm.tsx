import { useState, type FormEvent } from 'react'
import Input from '../common/Input'
import Select from '../common/Select'
import Button from '../common/Button'
import { useUpdateSecuritySettings } from '../../hooks/mutations/useUpdateSecuritySettings'
import { MFA_ENFORCEMENT_OPTIONS } from '../../types/securitySettings'
import type { SecuritySettings, MfaEnforcement } from '../../types/securitySettings'

interface SecuritySettingsFormProps {
  settings: SecuritySettings
  onSaved: () => void
}

export default function SecuritySettingsForm({ settings, onSaved }: SecuritySettingsFormProps) {
  const [form, setForm] = useState<SecuritySettings>(settings)
  const [error, setError] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const updateSettings = useUpdateSecuritySettings()

  function updateField<K extends keyof SecuritySettings>(key: K, value: SecuritySettings[K]) {
    setError(null)
    setSuccessMessage(null)
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError(null)
    setSuccessMessage(null)
    updateSettings.mutate(form, {
      onSuccess: () => {
        setSuccessMessage('Security settings updated successfully.')
        onSaved()
      },
      onError: (err) => {
        setError(err instanceof Error ? err.message : 'Something went wrong. Please try again.')
      },
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="rounded-xl border border-sap-border bg-sap-surface p-5 shadow-sm">
        <h4 className="mb-4 text-sm font-semibold text-sap-text">Password Policy</h4>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Input id="minimumPasswordLength" label="Minimum Password Length" type="number" value={form.minimumPasswordLength} onChange={(e) => updateField('minimumPasswordLength', e.target.value)} />
            <Input id="passwordHistoryCount" label="Password History Count" type="number" value={form.passwordHistoryCount} onChange={(e) => updateField('passwordHistoryCount', e.target.value)} />
          </div>
          <div className="flex flex-wrap gap-4">
            <label className="flex items-center gap-2 text-sm text-sap-text">
              <input type="checkbox" checked={form.requireUppercase} onChange={(e) => updateField('requireUppercase', e.target.checked)} className="h-4 w-4 rounded border-sap-border" />
              Require Uppercase
            </label>
            <label className="flex items-center gap-2 text-sm text-sap-text">
              <input type="checkbox" checked={form.requireLowercase} onChange={(e) => updateField('requireLowercase', e.target.checked)} className="h-4 w-4 rounded border-sap-border" />
              Require Lowercase
            </label>
            <label className="flex items-center gap-2 text-sm text-sap-text">
              <input type="checkbox" checked={form.requireNumber} onChange={(e) => updateField('requireNumber', e.target.checked)} className="h-4 w-4 rounded border-sap-border" />
              Require Number
            </label>
            <label className="flex items-center gap-2 text-sm text-sap-text">
              <input type="checkbox" checked={form.requireSpecialCharacter} onChange={(e) => updateField('requireSpecialCharacter', e.target.checked)} className="h-4 w-4 rounded border-sap-border" />
              Require Special Character
            </label>
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-sap-border bg-sap-surface p-5 shadow-sm">
        <h4 className="mb-4 text-sm font-semibold text-sap-text">Account Lockout</h4>
        <div className="space-y-4">
          <Input id="accountLockoutDurationMinutes" label="Lockout Duration (minutes)" type="number" value={form.accountLockoutDurationMinutes} onChange={(e) => updateField('accountLockoutDurationMinutes', e.target.value)} />
          <label className="flex items-center gap-2 text-sm text-sap-text">
            <input type="checkbox" checked={form.autoUnlockAfterLockout} onChange={(e) => updateField('autoUnlockAfterLockout', e.target.checked)} className="h-4 w-4 rounded border-sap-border" />
            Auto Unlock After Lockout Period
          </label>
        </div>
      </div>

      <div className="rounded-xl border border-sap-border bg-sap-surface p-5 shadow-sm">
        <h4 className="mb-4 text-sm font-semibold text-sap-text">Multi-Factor Authentication</h4>
        <Select id="mfaEnforcement" label="MFA Enforcement" value={form.mfaEnforcement} onChange={(e) => updateField('mfaEnforcement', e.target.value as MfaEnforcement)} options={MFA_ENFORCEMENT_OPTIONS.map((m) => ({ label: m, value: m }))} />
      </div>

      <div className="rounded-xl border border-sap-border bg-sap-surface p-5 shadow-sm">
        <h4 className="mb-4 text-sm font-semibold text-sap-text">Session Policy</h4>
        <div className="space-y-4">
          <Input id="maximumConcurrentSessions" label="Maximum Concurrent Sessions per User" type="number" value={form.maximumConcurrentSessions} onChange={(e) => updateField('maximumConcurrentSessions', e.target.value)} />
          <Input id="ipAllowList" label="IP Allow List (optional, comma-separated)" value={form.ipAllowList} onChange={(e) => updateField('ipAllowList', e.target.value)} placeholder="e.g. 203.0.113.0/24, 198.51.100.42" />
        </div>
      </div>

      {error && <p className="text-sm text-sap-danger">{error}</p>}
      {successMessage && <p className="text-sm text-sap-success">{successMessage}</p>}

      <div className="flex justify-end">
        <Button type="submit" isLoading={updateSettings.isPending}>Save Changes</Button>
      </div>
    </form>
  )
}
