import { mockNotifications } from '../hooks/queries/useNotifications'
import type { NotificationItem, NotificationQueryParams, NotificationListResponse } from '../types/notification'

export async function fetchNotifications(params: NotificationQueryParams): Promise<NotificationListResponse> {
  let filtered = [...mockNotifications]
  if (params.status && params.status !== 'All') filtered = filtered.filter((n) => n.status === params.status)
  if (params.type && params.type !== 'All') filtered = filtered.filter((n) => n.type === params.type)
  if (params.priority && params.priority !== 'All') filtered = filtered.filter((n) => n.priority === params.priority)
  if (params.search && params.search.trim()) {
    const q = params.search.toLowerCase().trim()
    filtered = filtered.filter((n) => n.title.toLowerCase().includes(q) || n.message.toLowerCase().includes(q))
  }
  const unreadCount = mockNotifications.filter((n) => n.status === 'Unread').length
  return {
    data: filtered,
    total: filtered.length,
    unreadCount,
    page: params.page || 1,
    pageSize: params.pageSize || 10,
  }
}

export async function markNotificationAsRead(id: string): Promise<void> {
  const item = mockNotifications.find((n) => n.id === id)
  if (item) item.status = 'Read'
}

export async function markAllNotificationsAsRead(): Promise<void> {
  mockNotifications.forEach((n) => (n.status = 'Read'))
}

export async function deleteNotification(id: string): Promise<void> {
  const index = mockNotifications.findIndex((n) => n.id === id)
  if (index !== -1) mockNotifications.splice(index, 1)
}

export async function createNotification(data: Omit<NotificationItem, 'id' | 'createdAt' | 'status'>): Promise<NotificationItem> {
  const newItem: NotificationItem = {
    ...data,
    id: `NOTIF-${String(mockNotifications.length + 1).padStart(3, '0')}`,
    createdAt: new Date().toISOString(),
    status: 'Unread',
  }
  mockNotifications.unshift(newItem)
  return newItem
}
