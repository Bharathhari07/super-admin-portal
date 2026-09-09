export type AnnouncementSeverity = 'Info' | 'Warning' | 'Critical'
export type AnnouncementAudience = 'All Tenants' | 'Specific Tenant'
export type AnnouncementStatus = 'Active' | 'Expired'

export interface StatusAnnouncement {
  id: string
  title: string
  message: string
  severity: AnnouncementSeverity
  audienceScope: AnnouncementAudience
  tenantId: string | null
  tenantName: string | null
  status: AnnouncementStatus
  publishedAt: string
}

export interface StatusAnnouncementListResponse {
  data: StatusAnnouncement[]
  total: number
  page: number
  pageSize: number
}

export interface StatusAnnouncementQueryParams {
  search?: string
  status?: AnnouncementStatus | 'All'
  severity?: AnnouncementSeverity | 'All'
  page?: number
  pageSize?: number
}

export interface CreateAnnouncementInput {
  title: string
  message: string
  severity: AnnouncementSeverity
  audienceScope: AnnouncementAudience
  tenantId: string | null
}

export const SEVERITY_OPTIONS: AnnouncementSeverity[] = ['Info', 'Warning', 'Critical']
export const AUDIENCE_OPTIONS: AnnouncementAudience[] = ['All Tenants', 'Specific Tenant']
