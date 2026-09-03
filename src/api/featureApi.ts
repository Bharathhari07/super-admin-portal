import { dummyFeatures } from '../data/dummyFeatures'
import { simulateDelay, simulateMutationDelay } from './mockClient'
import type {
  Feature,
  FeatureListResponse,
  FeatureQueryParams,
  CreateFeatureInput,
  UpdateFeatureInput,
} from '../types/feature'

let featureStore: Feature[] = [...dummyFeatures]

function applyFilters(features: Feature[], params: FeatureQueryParams): Feature[] {
  let result = [...features]
  if (params.search && params.search.trim() !== '') {
    const term = params.search.trim().toLowerCase()
    result = result.filter((f) => f.name.toLowerCase().includes(term) || f.code.toLowerCase().includes(term))
  }
  if (params.status && params.status !== 'All') {
    result = result.filter((f) => f.status === params.status)
  }
  if (params.module && params.module !== 'All') {
    result = result.filter((f) => f.module === params.module)
  }
  if (params.featureCategory && params.featureCategory !== 'All') {
    result = result.filter((f) => f.featureCategory === params.featureCategory)
  }
  const sortBy = params.sortBy ?? 'createdAt'
  const sortDir = params.sortDir ?? 'desc'
  result.sort((a, b) => {
    let cmp = 0
    if (sortBy === 'name') cmp = a.name.localeCompare(b.name)
    else cmp = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
    return sortDir === 'asc' ? cmp : -cmp
  })
  return result
}

export async function fetchFeatures(params: FeatureQueryParams): Promise<FeatureListResponse> {
  const filtered = applyFilters(featureStore, params)
  const page = params.page ?? 1
  const pageSize = params.pageSize ?? 5
  const start = (page - 1) * pageSize
  return simulateDelay({ data: filtered.slice(start, start + pageSize), total: filtered.length, page, pageSize })
}

export async function createFeature(input: CreateFeatureInput): Promise<Feature> {
  const codeExists = featureStore.some((f) => f.code.toLowerCase() === input.code.toLowerCase())
  if (codeExists) throw new Error('Feature code already exists. Please choose a unique code.')
  const rollout = Number(input.rolloutPercentage)
  if (isNaN(rollout) || rollout < 0 || rollout > 100) {
    throw new Error('Rollout percentage must be between 0 and 100.')
  }
  const newFeature: Feature = {
    id: `f${Date.now()}`,
    ...input,
    createdAt: new Date().toISOString().slice(0, 10),
  }
  featureStore = [newFeature, ...featureStore]
  return simulateMutationDelay(newFeature)
}

export async function updateFeature(id: string, input: UpdateFeatureInput): Promise<Feature> {
  const index = featureStore.findIndex((f) => f.id === id)
  if (index === -1) throw new Error('Feature not found')
  const codeTaken = featureStore.some((f) => f.id !== id && f.code.toLowerCase() === input.code.toLowerCase())
  if (codeTaken) throw new Error('Feature code already exists. Please choose a unique code.')
  const rollout = Number(input.rolloutPercentage)
  if (isNaN(rollout) || rollout < 0 || rollout > 100) {
    throw new Error('Rollout percentage must be between 0 and 100.')
  }
  const updated: Feature = { ...featureStore[index], ...input }
  featureStore = featureStore.map((f) => (f.id === id ? updated : f))
  return simulateMutationDelay(updated)
}

export async function activateFeature(id: string): Promise<Feature> {
  const index = featureStore.findIndex((f) => f.id === id)
  if (index === -1) throw new Error('Feature not found')
  const updated: Feature = { ...featureStore[index], status: 'Active' }
  featureStore = featureStore.map((f) => (f.id === id ? updated : f))
  return simulateMutationDelay(updated)
}

export async function disableFeature(id: string): Promise<Feature> {
  const index = featureStore.findIndex((f) => f.id === id)
  if (index === -1) throw new Error('Feature not found')
  const updated: Feature = { ...featureStore[index], status: 'Disabled' }
  featureStore = featureStore.map((f) => (f.id === id ? updated : f))
  return simulateMutationDelay(updated)
}
