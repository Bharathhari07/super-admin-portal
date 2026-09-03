export type DateFormat = 'DD/MM/YYYY' | 'MM/DD/YYYY' | 'YYYY-MM-DD'
export type TimeFormat = '12-hour' | '24-hour'
export type NumberFormat = '1,234.56' | '1.234,56' | '1 234.56'
export type ThemeMode = 'Light' | 'Dark' | 'Auto'
export type BrandingStatus = 'Active' | 'Inactive'

export interface PlatformConfiguration {
  // General / Global Settings
  defaultLanguage: string
  defaultTimeZone: string
  defaultCurrency: string
  dateFormat: DateFormat
  timeFormat: TimeFormat
  numberFormat: NumberFormat

  // Session & Security Settings
  sessionTimeoutMinutes: string
  autoLogout: boolean
  passwordExpiryDays: string
  maximumLoginAttempts: string
  maintenanceNotification: boolean
  systemAnnouncement: boolean

  // Platform Branding
  brandingStatus: BrandingStatus
  brandName: string
  applicationName: string
  companyName: string
  platformLogoUrl: string
  faviconUrl: string
  loginBackgroundUrl: string
  emailLogoUrl: string
  mobileAppLogoUrl: string
  primaryColor: string
  secondaryColor: string
  accentColor: string
  fontFamily: string
  themeMode: ThemeMode
}

export interface UpdatePlatformConfigurationInput extends PlatformConfiguration {}

export const LANGUAGE_OPTIONS = ['English', 'Hindi', 'Spanish', 'French', 'German', 'Mandarin'] as const
export const TIME_ZONE_OPTIONS = [
  'Asia/Kolkata',
  'America/New_York',
  'Europe/London',
  'Australia/Sydney',
  'Asia/Singapore',
] as const
export const CURRENCY_OPTIONS = ['INR', 'USD', 'GBP', 'EUR', 'AUD', 'SGD'] as const
export const DATE_FORMAT_OPTIONS: DateFormat[] = ['DD/MM/YYYY', 'MM/DD/YYYY', 'YYYY-MM-DD']
export const TIME_FORMAT_OPTIONS: TimeFormat[] = ['12-hour', '24-hour']
export const NUMBER_FORMAT_OPTIONS: NumberFormat[] = ['1,234.56', '1.234,56', '1 234.56']
export const FONT_FAMILY_OPTIONS = ['Inter', 'Roboto', 'Open Sans', 'Lato', 'Poppins'] as const
export const THEME_MODE_OPTIONS: ThemeMode[] = ['Light', 'Dark', 'Auto']
