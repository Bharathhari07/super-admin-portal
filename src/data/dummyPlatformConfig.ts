import type { PlatformConfiguration } from '../types/platformConfig'

export const dummyPlatformConfiguration: PlatformConfiguration = {
  defaultLanguage: 'English',
  defaultTimeZone: 'Asia/Kolkata',
  defaultCurrency: 'INR',
  dateFormat: 'DD/MM/YYYY',
  timeFormat: '24-hour',
  numberFormat: '1,234.56',

  sessionTimeoutMinutes: '30',
  autoLogout: true,
  passwordExpiryDays: '90',
  maximumLoginAttempts: '5',
  maintenanceNotification: true,
  systemAnnouncement: false,

  brandingStatus: 'Active',
  brandName: 'One Enterprise',
  applicationName: 'One Enterprise Cloud Platform',
  companyName: 'One Enterprise Technologies',
  platformLogoUrl: '',
  faviconUrl: '',
  loginBackgroundUrl: '',
  emailLogoUrl: '',
  mobileAppLogoUrl: '',
  primaryColor: '#4F46E5',
  secondaryColor: '#0EA5E9',
  accentColor: '#FCE300',
  fontFamily: 'Inter',
  themeMode: 'Dark',
}
