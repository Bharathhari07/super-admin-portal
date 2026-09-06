export type NotificationType = 'System' | 'Security' | 'Tenant' | 'Compliance' | 'User' | 'Billing' | 'User Activity'
export type NotificationPriority = 'Low' | 'Medium' | 'High' | 'Urgent'
export type NotificationStatus = 'Unread' | 'Read' | 'Archived'

export const NOTIFICATION_TYPE_OPTIONS: NotificationType[] = [
  'System',
  'Security',
  'Tenant',
  'Compliance',
  'Billing',
  'User Activity',
]

export const NOTIFICATION_PRIORITY_OPTIONS: NotificationPriority[] = ['Low', 'Medium', 'High', 'Urgent']

export const NOTIFICATION_STATUS_OPTIONS: NotificationStatus[] = ['Unread', 'Read', 'Archived']

export interface NotificationItem {
  id: string
  title: string
  message: string
  type: NotificationType
  priority: NotificationPriority
  status: NotificationStatus
  targetAudience: string
  tenantName?: string
  actionUrl?: string
  actionLabel?: string
  createdAt: string
}

export interface NotificationQueryParams {
  search?: string
  status?: NotificationStatus | 'All'
  type?: NotificationType | 'All'
  priority?: NotificationPriority | 'All'
  sortBy?: 'createdAt' | 'priority'
  sortDir?: 'asc' | 'desc'
  page?: number
  pageSize?: number
}

export interface NotificationListResponse {
  data: NotificationItem[]
  total: number
  unreadCount: number
  page: number
  pageSize: number
}
