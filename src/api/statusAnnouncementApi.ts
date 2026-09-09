import { dummyStatusAnnouncements } from '../data/dummyStatusAnnouncements'
import { dummyTenants } from '../data/dummyTenants'
import { simulateDelay, simulateMutationDelay } from './mockClient'
import type {
  StatusAnnouncement,
  StatusAnnouncementListResponse,
  StatusAnnouncementQueryParams,
  CreateAnnouncementInput,
} from '../types/statusAnnouncement'

let announcementStore: StatusAnnouncement[] = [...dummyStatusAnnouncements]

function applyFilters(items: StatusAnnouncement[], params: StatusAnnouncementQueryParams): StatusAnnouncement[] {
  let result = [...items]
  if (params.search && params.search.trim() !== '') {
    const term = params.search.trim().toLowerCase()
    result = result.filter((a) => a.title.toLowerCase().includes(term) || a.message.toLowerCase().includes(term))
  }
  if (params.status && params.status !== 'All') {
    result = result.filter((a) => a.status === params.status)
  }
  if (params.severity && params.severity !== 'All') {
    result = result.filter((a) => a.severity === params.severity)
  }
  result.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
  return result
}

export async function fetchStatusAnnouncements(params: StatusAnnouncementQueryParams): Promise<StatusAnnouncementListResponse> {
  const filtered = applyFilters(announcementStore, params)
  const page = params.page ?? 1
  const pageSize = params.pageSize ?? 5
  const start = (page - 1) * pageSize
  return simulateDelay({ data: filtered.slice(start, start + pageSize), total: filtered.length, page, pageSize })
}

export async function createAnnouncement(input: CreateAnnouncementInput): Promise<StatusAnnouncement> {
  const tenant = input.tenantId ? dummyTenants.find((t) => t.id === input.tenantId) : null
  const newAnnouncement: StatusAnnouncement = {
    id: `ann${Date.now()}`,
    title: input.title,
    message: input.message,
    severity: input.severity,
    audienceScope: input.audienceScope,
    tenantId: input.tenantId,
    tenantName: tenant ? tenant.name : null,
    status: 'Active',
    publishedAt: new Date().toISOString(),
  }
  announcementStore = [newAnnouncement, ...announcementStore]
  return simulateMutationDelay(newAnnouncement)
}

export async function expireAnnouncement(id: string): Promise<StatusAnnouncement> {
  const index = announcementStore.findIndex((a) => a.id === id)
  if (index === -1) throw new Error('Announcement not found')
  const updated: StatusAnnouncement = { ...announcementStore[index], status: 'Expired' }
  announcementStore = announcementStore.map((a) => (a.id === id ? updated : a))
  return simulateMutationDelay(updated)
}
