import { useState, type FormEvent } from 'react'
import Input from '../common/Input'
import Select from '../common/Select'
import Button from '../common/Button'
import { useUpdatePlatformConfiguration } from '../../hooks/mutations/useUpdatePlatformConfiguration'
import {
  LANGUAGE_OPTIONS,
  TIME_ZONE_OPTIONS,
  CURRENCY_OPTIONS,
  DATE_FORMAT_OPTIONS,
  TIME_FORMAT_OPTIONS,
  NUMBER_FORMAT_OPTIONS,
  FONT_FAMILY_OPTIONS,
  THEME_MODE_OPTIONS,
} from '../../types/platformConfig'
import type {
  PlatformConfiguration,
  DateFormat,
  TimeFormat,
  NumberFormat,
  ThemeMode,
  BrandingStatus,
} from '../../types/platformConfig'

interface PlatformConfigFormProps {
  config: PlatformConfiguration
  onSaved: () => void
}

export default function PlatformConfigForm({ config, onSaved }: PlatformConfigFormProps) {
  const [form, setForm] = useState<PlatformConfiguration>(config)
  const [error, setError] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const updateConfig = useUpdatePlatformConfiguration()

  function updateField<K extends keyof PlatformConfiguration>(key: K, value: PlatformConfiguration[K]) {
    setError(null)
    setSuccessMessage(null)
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError(null)
    setSuccessMessage(null)
    updateConfig.mutate(form, {
      onSuccess: () => {
        setSuccessMessage('Platform configuration updated successfully.')
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
        <h4 className="mb-4 text-sm font-semibold text-sap-text">General Settings</h4>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Select id="defaultLanguage" label="Default Language" value={form.defaultLanguage} onChange={(e) => updateField('defaultLanguage', e.target.value)} options={LANGUAGE_OPTIONS.map((l) => ({ label: l, value: l }))} />
            <Select id="defaultTimeZone" label="Default Time Zone" value={form.defaultTimeZone} onChange={(e) => updateField('defaultTimeZone', e.target.value)} options={TIME_ZONE_OPTIONS.map((t) => ({ label: t, value: t }))} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Select id="defaultCurrency" label="Default Currency" value={form.defaultCurrency} onChange={(e) => updateField('defaultCurrency', e.target.value)} options={CURRENCY_OPTIONS.map((c) => ({ label: c, value: c }))} />
            <Select id="dateFormat" label="Date Format" value={form.dateFormat} onChange={(e) => updateField('dateFormat', e.target.value as DateFormat)} options={DATE_FORMAT_OPTIONS.map((d) => ({ label: d, value: d }))} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Select id="timeFormat" label="Time Format" value={form.timeFormat} onChange={(e) => updateField('timeFormat', e.target.value as TimeFormat)} options={TIME_FORMAT_OPTIONS.map((t) => ({ label: t, value: t }))} />
            <Select id="numberFormat" label="Number Format" value={form.numberFormat} onChange={(e) => updateField('numberFormat', e.target.value as NumberFormat)} options={NUMBER_FORMAT_OPTIONS.map((n) => ({ label: n, value: n }))} />
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-sap-border bg-sap-surface p-5 shadow-sm">
        <h4 className="mb-4 text-sm font-semibold text-sap-text">Session & Security Settings</h4>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Input id="sessionTimeoutMinutes" label="Session Timeout (minutes)" type="number" value={form.sessionTimeoutMinutes} onChange={(e) => updateField('sessionTimeoutMinutes', e.target.value)} />
            <Input id="passwordExpiryDays" label="Password Expiry (days)" type="number" value={form.passwordExpiryDays} onChange={(e) => updateField('passwordExpiryDays', e.target.value)} />
          </div>
          <Input id="maximumLoginAttempts" label="Maximum Login Attempts" type="number" value={form.maximumLoginAttempts} onChange={(e) => updateField('maximumLoginAttempts', e.target.value)} />
          <div className="flex flex-wrap gap-4">
            <label className="flex items-center gap-2 text-sm text-sap-text">
              <input type="checkbox" checked={form.autoLogout} onChange={(e) => updateField('autoLogout', e.target.checked)} className="h-4 w-4 rounded border-sap-border" />
              Auto Logout
            </label>
            <label className="flex items-center gap-2 text-sm text-sap-text">
              <input type="checkbox" checked={form.maintenanceNotification} onChange={(e) => updateField('maintenanceNotification', e.target.checked)} className="h-4 w-4 rounded border-sap-border" />
              Maintenance Notification
            </label>
            <label className="flex items-center gap-2 text-sm text-sap-text">
              <input type="checkbox" checked={form.systemAnnouncement} onChange={(e) => updateField('systemAnnouncement', e.target.checked)} className="h-4 w-4 rounded border-sap-border" />
              System Announcement
            </label>
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-sap-border bg-sap-surface p-5 shadow-sm">
        <h4 className="mb-4 text-sm font-semibold text-sap-text">Platform Branding</h4>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Input id="brandName" label="Brand Name" value={form.brandName} onChange={(e) => updateField('brandName', e.target.value)} />
            <Input id="applicationName" label="Application Name" value={form.applicationName} onChange={(e) => updateField('applicationName', e.target.value)} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Input id="companyName" label="Company Name" value={form.companyName} onChange={(e) => updateField('companyName', e.target.value)} />
            <Select id="brandingStatus" label="Branding Status" value={form.brandingStatus} onChange={(e) => updateField('brandingStatus', e.target.value as BrandingStatus)} options={[{ label: 'Active', value: 'Active' }, { label: 'Inactive', value: 'Inactive' }]} />
          </div>

          <p className="pt-2 text-xs font-semibold uppercase tracking-wide text-sap-text-muted">
            Assets (image URLs - no file storage backend available)
          </p>
          <div className="grid grid-cols-2 gap-4">
            <Input id="platformLogoUrl" label="Platform Logo URL" value={form.platformLogoUrl} onChange={(e) => updateField('platformLogoUrl', e.target.value)} placeholder="https://example.com/logo.png" />
            <Input id="faviconUrl" label="Favicon URL" value={form.faviconUrl} onChange={(e) => updateField('faviconUrl', e.target.value)} placeholder="https://example.com/favicon.ico" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Input id="loginBackgroundUrl" label="Login Background URL (optional)" value={form.loginBackgroundUrl} onChange={(e) => updateField('loginBackgroundUrl', e.target.value)} />
            <Input id="emailLogoUrl" label="Email Logo URL (optional)" value={form.emailLogoUrl} onChange={(e) => updateField('emailLogoUrl', e.target.value)} />
          </div>
          <Input id="mobileAppLogoUrl" label="Mobile App Logo URL (optional)" value={form.mobileAppLogoUrl} onChange={(e) => updateField('mobileAppLogoUrl', e.target.value)} />

          <p className="pt-2 text-xs font-semibold uppercase tracking-wide text-sap-text-muted">Theme</p>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="mb-1 block text-sm font-medium text-sap-text">Primary Color</label>
              <div className="flex items-center gap-2">
                <input type="color" value={form.primaryColor} onChange={(e) => updateField('primaryColor', e.target.value)} className="h-9 w-9 shrink-0 rounded border border-sap-border bg-transparent" />
                <Input id="primaryColor" value={form.primaryColor} onChange={(e) => updateField('primaryColor', e.target.value)} />
              </div>
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-sap-text">Secondary Color</label>
              <div className="flex items-center gap-2">
                <input type="color" value={form.secondaryColor} onChange={(e) => updateField('secondaryColor', e.target.value)} className="h-9 w-9 shrink-0 rounded border border-sap-border bg-transparent" />
                <Input id="secondaryColor" value={form.secondaryColor} onChange={(e) => updateField('secondaryColor', e.target.value)} />
              </div>
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-sap-text">Accent Color</label>
              <div className="flex items-center gap-2">
                <input type="color" value={form.accentColor} onChange={(e) => updateField('accentColor', e.target.value)} className="h-9 w-9 shrink-0 rounded border border-sap-border bg-transparent" />
                <Input id="accentColor" value={form.accentColor} onChange={(e) => updateField('accentColor', e.target.value)} />
              </div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Select id="fontFamily" label="Font Family" value={form.fontFamily} onChange={(e) => updateField('fontFamily', e.target.value)} options={FONT_FAMILY_OPTIONS.map((f) => ({ label: f, value: f }))} />
            <Select id="themeMode" label="Theme Mode" value={form.themeMode} onChange={(e) => updateField('themeMode', e.target.value as ThemeMode)} options={THEME_MODE_OPTIONS.map((t) => ({ label: t, value: t }))} />
          </div>
        </div>
      </div>

      {error && <p className="text-sm text-sap-danger">{error}</p>}
      {successMessage && <p className="text-sm text-sap-success">{successMessage}</p>}

      <div className="flex justify-end">
        <Button type="submit" isLoading={updateConfig.isPending}>Save Changes</Button>
      </div>
    </form>
  )
}
