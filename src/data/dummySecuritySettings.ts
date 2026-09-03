import type { SecuritySettings } from '../types/securitySettings'

export const dummySecuritySettings: SecuritySettings = {
  minimumPasswordLength: '10',
  requireUppercase: true,
  requireLowercase: true,
  requireNumber: true,
  requireSpecialCharacter: true,
  passwordHistoryCount: '5',

  accountLockoutDurationMinutes: '30',
  autoUnlockAfterLockout: true,

  mfaEnforcement: 'Required for Admins Only',

  maximumConcurrentSessions: '3',
  ipAllowList: '',
}
