import { dummySecuritySettings } from '../data/dummySecuritySettings'
import { simulateDelay, simulateMutationDelay } from './mockClient'
import type { SecuritySettings, UpdateSecuritySettingsInput } from '../types/securitySettings'

let securityStore: SecuritySettings = { ...dummySecuritySettings }

// GET /api/security/settings
export async function fetchSecuritySettings(): Promise<SecuritySettings> {
  return simulateDelay(securityStore)
}

// PUT /api/security/settings
export async function updateSecuritySettings(input: UpdateSecuritySettingsInput): Promise<SecuritySettings> {
  const minLength = Number(input.minimumPasswordLength)
  if (isNaN(minLength) || minLength < 6) {
    throw new Error('Minimum password length must be at least 6 characters.')
  }
  securityStore = { ...input }
  return simulateMutationDelay(securityStore)
}
