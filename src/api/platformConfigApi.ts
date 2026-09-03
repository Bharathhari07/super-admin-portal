import { dummyPlatformConfiguration } from '../data/dummyPlatformConfig'
import { simulateDelay, simulateMutationDelay } from './mockClient'
import type { PlatformConfiguration, UpdatePlatformConfigurationInput } from '../types/platformConfig'

let configStore: PlatformConfiguration = { ...dummyPlatformConfiguration }

// GET /api/platform/configuration
export async function fetchPlatformConfiguration(): Promise<PlatformConfiguration> {
  return simulateDelay(configStore)
}

// PUT /api/platform/configuration
export async function updatePlatformConfiguration(input: UpdatePlatformConfigurationInput): Promise<PlatformConfiguration> {
  const maxAttempts = Number(input.maximumLoginAttempts)
  if (isNaN(maxAttempts) || maxAttempts <= 0) {
    throw new Error('Maximum login attempts must be a positive number.')
  }
  configStore = { ...input }
  return simulateMutationDelay(configStore)
}
