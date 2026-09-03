export type MfaEnforcement = 'Required for All Users' | 'Required for Admins Only' | 'Optional'

export interface SecuritySettings {
  // Password Policy
  minimumPasswordLength: string
  requireUppercase: boolean
  requireLowercase: boolean
  requireNumber: boolean
  requireSpecialCharacter: boolean
  passwordHistoryCount: string

  // Account Lockout
  accountLockoutDurationMinutes: string
  autoUnlockAfterLockout: boolean

  // Multi-Factor Authentication
  mfaEnforcement: MfaEnforcement

  // Session Policy
  maximumConcurrentSessions: string
  ipAllowList: string
}

export interface UpdateSecuritySettingsInput extends SecuritySettings {}

export const MFA_ENFORCEMENT_OPTIONS: MfaEnforcement[] = ['Required for All Users', 'Required for Admins Only', 'Optional']
