import { useState } from 'react'
import { Bell, Check, Trash2, AlertTriangle, Shield, CheckCircle } from 'lucide-react'
import Button from '../components/common/Button'
import Badge from '../components/common/Badge'
import Select from '../components/common/Select'
import Pagination from '../components/common/Pagination'
import NotificationDetailsModal from '../components/notifications/NotificationDetailsModal'
import { useNotifications } from '../hooks/queries/useNotifications'
import { markNotificationAsRead, deleteNotification } from '../api/notificationApi'
import {
  NOTIFICATION_TYPE_OPTIONS,
  NOTIFICATION_PRIORITY_OPTIONS,
  NOTIFICATION_STATUS_OPTIONS,
} from '../types/notification'
import type { NotificationItem, NotificationType, NotificationPriority, NotificationStatus } from '../types/notification'

const PAGE_SIZE = 6

export default function NotificationsPage() {
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState<NotificationStatus | 'All'>('All')
  const [type, setType] = useState<NotificationType | 'All'>('All')
  const [priority, setPriority] = useState<NotificationPriority | 'All'>('All')
  const [sortBy, setSortBy] = useState<'createdAt' | 'priority'>('createdAt')
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc')
  const [page, setPage] = useState(1)

  const [selectedNotif, setSelectedNotif] = useState<NotificationItem | null>(null)

  const { data, isLoading, refetch } = useNotifications({
    search,
    status,
    type,
    priority,
    sortBy,
    sortDir,
    page,
    pageSize: PAGE_SIZE,
  })

  const notifications = data?.data ?? []
  const total = data?.total ?? 0
  const unreadCount = data?.unreadCount ?? 0

  async function handleMarkAsRead(id: string) {
    await markNotificationAsRead(id)
    refetch()
  }

  async function handleDelete(id: string) {
    await deleteNotification(id)
    refetch()
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h2 className="text-xl font-semibold text-sap-text">Notifications & Alerts</h2>
          <p className="text-sm text-sap-text-muted">
            Track operational alerts, security anomalies, and dispatch platform announcements.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <div className="flex items-center gap-3 rounded-xl border border-sap-border bg-sap-surface p-4">
          <div className="rounded-lg bg-sap-navy-light p-2 text-sap-text"><Bell size={20} /></div>
          <div>
            <div className="text-xl font-bold text-sap-text">{total}</div>
            <div className="text-xs text-sap-text-muted">Total Alerts</div>
          </div>
        </div>
        <div className="flex items-center gap-3 rounded-xl border border-sap-border bg-sap-surface p-4">
          <div className="rounded-lg bg-sap-warning-bg p-2 text-sap-warning"><CheckCircle size={20} /></div>
          <div>
            <div className="text-xl font-bold text-sap-warning">{unreadCount}</div>
            <div className="text-xs text-sap-text-muted">Unread Active</div>
          </div>
        </div>
        <div className="flex items-center gap-3 rounded-xl border border-sap-border bg-sap-surface p-4">
          <div className="rounded-lg bg-sap-danger-bg p-2 text-sap-danger"><AlertTriangle size={20} /></div>
          <div>
            <div className="text-xl font-bold text-sap-danger">{notifications.filter((n) => n.priority === 'Urgent' || n.priority === 'High').length}</div>
            <div className="text-xs text-sap-text-muted">Urgent / High</div>
          </div>
        </div>
        <div className="flex items-center gap-3 rounded-xl border border-sap-border bg-sap-surface p-4">
          <div className="rounded-lg bg-sap-info-bg p-2 text-sap-info"><Shield size={20} /></div>
          <div>
            <div className="text-xl font-bold text-sap-info">{notifications.filter((n) => n.type === 'Security').length}</div>
            <div className="text-xs text-sap-text-muted">Security & Compliance</div>
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-sap-border bg-sap-surface p-4 shadow-sm">
        <div className="mb-4 flex flex-col justify-between gap-3 xl:flex-row xl:items-center">
          <input
            type="text"
            placeholder="Search alerts, messages..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            className="w-full xl:w-72 rounded-lg border border-sap-border bg-sap-bg px-3 py-1.5 text-sm text-sap-text placeholder-sap-text-muted"
          />

          <div className="grid grid-cols-2 gap-2 sm:flex sm:flex-wrap">
            <Select
              aria-label="Filter by status"
              value={status}
              onChange={(e) => { setStatus(e.target.value as NotificationStatus | 'All'); setPage(1); }}
              options={[{ label: 'All Statuses', value: 'All' }, ...NOTIFICATION_STATUS_OPTIONS.map((s) => ({ label: s, value: s }))]}
            />
            <Select
              aria-label="Filter by category"
              value={type}
              onChange={(e) => { setType(e.target.value as NotificationType | 'All'); setPage(1); }}
              options={[{ label: 'All Categories', value: 'All' }, ...NOTIFICATION_TYPE_OPTIONS.map((t) => ({ label: t, value: t }))]}
            />
            <Select
              aria-label="Filter by priority"
              value={priority}
              onChange={(e) => { setPriority(e.target.value as NotificationPriority | 'All'); setPage(1); }}
              options={[{ label: 'All Priorities', value: 'All' }, ...NOTIFICATION_PRIORITY_OPTIONS.map((p) => ({ label: p, value: p }))]}
            />
            <Select
              aria-label="Sort notifications"
              value={`${sortBy}:${sortDir}`}
              onChange={(e) => {
                const [nextBy, nextDir] = e.target.value.split(':') as ['createdAt' | 'priority', 'asc' | 'desc']
                setSortBy(nextBy)
                setSortDir(nextDir)
              }}
              options={[
                { label: 'Newest first', value: 'createdAt:desc' },
                { label: 'Oldest first', value: 'createdAt:asc' },
                { label: 'Highest Priority', value: 'priority:desc' },
                { label: 'Lowest Priority', value: 'priority:asc' },
              ]}
            />
          </div>
        </div>

        <div className="overflow-x-auto rounded-lg border border-sap-border sap-scroll">
          <table className="w-full min-w-[780px] text-left text-sm">
            <thead className="border-b border-sap-border bg-sap-bg text-xs font-semibold text-sap-text-muted">
              <tr>
                <th className="px-4 py-3">Alert</th>
                <th className="px-4 py-3">Category</th>
                <th className="px-4 py-3">Priority</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Date</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-sap-border">
              {isLoading ? (
                <tr><td colSpan={6} className="py-6 text-center text-xs text-sap-text-muted">Loading notifications...</td></tr>
              ) : notifications.length === 0 ? (
                <tr><td colSpan={6} className="py-6 text-center text-xs text-sap-text-muted">No notifications matching filters found.</td></tr>
              ) : (
                notifications.map((n) => (
                  <tr key={n.id} className="hover:bg-sap-bg/50">
                    <td className="px-4 py-3">
                      <div className="font-medium text-sap-text">{n.title}</div>
                      <div className="text-xs text-sap-text-muted line-clamp-1">{n.message}</div>
                    </td>
                    <td className="px-4 py-3 text-xs"><Badge tone="info">{n.type}</Badge></td>
                    <td className="px-4 py-3 text-xs">
                      <Badge tone={n.priority === 'Urgent' ? 'danger' : n.priority === 'High' ? 'warning' : 'neutral'}>
                        {n.priority}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 text-xs">
                      <Badge tone={n.status === 'Unread' ? 'warning' : 'neutral'}>{n.status}</Badge>
                    </td>
                    <td className="px-4 py-3 text-xs text-sap-text-muted">{new Date(n.createdAt).toLocaleString()}</td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-1">
                        {n.status === 'Unread' && (
                          <Button variant="ghost" size="sm" onClick={() => handleMarkAsRead(n.id)} title="Mark as Read">
                            <Check size={14} />
                          </Button>
                        )}
                        <Button variant="ghost" size="sm" onClick={() => setSelectedNotif(n)}>View</Button>
                        <Button variant="ghost" size="sm" onClick={() => handleDelete(n.id)} className="text-sap-danger">
                          <Trash2 size={14} />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <Pagination
          page={page}
          pageSize={PAGE_SIZE}
          total={total}
          onPageChange={setPage}
          itemLabel="notifications"
        />
      </div>

      <NotificationDetailsModal
        open={Boolean(selectedNotif)}
        notification={selectedNotif}
        onClose={() => setSelectedNotif(null)}
        onMarkAsRead={handleMarkAsRead}
        onDelete={handleDelete}
      />
    </div>
  )
}
