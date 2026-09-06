import { dummyNotifications } from '../../data/dummyNotifications'
import { useQuery } from '@tanstack/react-query'
import type { NotificationItem, NotificationQueryParams, NotificationListResponse } from '../../types/notification'

export const mockNotifications: NotificationItem[] = [...dummyNotifications]

export function useNotifications(params?: Partial<NotificationQueryParams>) {
  return useQuery<NotificationListResponse>({
    queryKey: ['notifications', params],
    queryFn: async () => {
      let filtered = [...mockNotifications]
      if (params?.status && params.status !== 'All') {
        filtered = filtered.filter((n) => n.status === params.status)
      }
      if (params?.type && params.type !== 'All') {
        filtered = filtered.filter((n) => n.type === params.type)
      }
      if (params?.priority && params.priority !== 'All') {
        filtered = filtered.filter((n) => n.priority === params.priority)
      }
      if (params?.search && params.search.trim()) {
        const q = params.search.toLowerCase().trim()
        filtered = filtered.filter((n) => n.title.toLowerCase().includes(q) || n.message.toLowerCase().includes(q))
      }

      const sortDir = params?.sortDir ?? 'desc'
      filtered.sort((a, b) => {
        if (params?.sortBy === 'priority') {
          const pOrder: Record<string, number> = { Low: 1, Medium: 2, High: 3, Urgent: 4 }
          const diff = (pOrder[a.priority] || 0) - (pOrder[b.priority] || 0)
          return sortDir === 'asc' ? diff : -diff
        }
        const diff = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        return sortDir === 'asc' ? diff : -diff
      })

      const page = params?.page ?? 1
      const pageSize = params?.pageSize ?? 6
      const start = (page - 1) * pageSize
      const unreadCount = mockNotifications.filter((n) => n.status === 'Unread').length

      return {
        data: filtered.slice(start, start + pageSize),
        total: filtered.length,
        unreadCount,
        page,
        pageSize,
      }
    },
  })
}
