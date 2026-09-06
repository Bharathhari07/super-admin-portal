import { Link } from 'react-router-dom'
import { ExternalLink, Check, Trash2, Bell } from 'lucide-react'
import type { NotificationItem } from '../../types/notification'
import Modal from '../common/Modal'
import Badge from '../common/Badge'
import Button from '../common/Button'

interface NotificationDetailsModalProps {
  notification: NotificationItem | null
  open: boolean
  onClose: () => void
  onMarkAsRead: (id: string) => void
  onDelete: (id: string) => void
}

export default function NotificationDetailsModal({
  notification,
  open,
  onClose,
  onMarkAsRead,
  onDelete,
}: NotificationDetailsModalProps) {
  if (!notification) return null

  return (
    <Modal open={open} onClose={onClose} title="Notification Details" widthClass="max-w-md">
      <div className="space-y-4">
        <div className="flex items-start gap-3 rounded-lg border border-sap-border bg-sap-bg/50 p-3">
          <div className="rounded-lg bg-sap-primary/10 p-2 text-sap-primary">
            <Bell size={20} />
          </div>
          <div className="flex-1">
            <h3 className="text-base font-semibold text-sap-text">{notification.title}</h3>
            <p className="mt-1 text-xs text-sap-text-muted">
              {new Date(notification.createdAt).toLocaleString()}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 text-xs">
          <Badge tone={notification.status === 'Unread' ? 'warning' : 'neutral'}>
            Status: {notification.status}
          </Badge>
          <Badge tone="info">Category: {notification.type}</Badge>
          <Badge tone={notification.priority === 'Urgent' ? 'danger' : notification.priority === 'High' ? 'warning' : 'neutral'}>
            Priority: {notification.priority}
          </Badge>
          <Badge tone="neutral">Audience: {notification.targetAudience}</Badge>
          {notification.tenantName && <Badge tone="neutral">Tenant: {notification.tenantName}</Badge>}
        </div>

        <div className="rounded-lg border border-sap-border bg-sap-bg/30 p-3">
          <div className="text-xs font-medium uppercase tracking-wider text-sap-text-muted">Message</div>
          <p className="mt-1.5 text-sm leading-relaxed text-sap-text">{notification.message}</p>
        </div>

        {notification.actionUrl && (
          <div className="flex justify-end pt-1">
            <Link
              to={notification.actionUrl}
              onClick={onClose}
              className="inline-flex items-center gap-1.5 rounded-lg bg-sap-primary px-3 py-1.5 text-xs font-semibold text-sap-navy hover:bg-sap-primary-dark"
            >
              <span>{notification.actionLabel || 'Go to Target View'}</span>
              <ExternalLink size={14} />
            </Link>
          </div>
        )}

        <div className="flex flex-wrap items-center justify-between gap-2 border-t border-sap-border pt-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              onDelete(notification.id)
              onClose()
            }}
            className="text-sap-danger hover:text-red-400"
          >
            <Trash2 size={16} /> Delete
          </Button>

          <div className="flex items-center gap-2">
            {notification.status === 'Unread' && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  onMarkAsRead(notification.id)
                  onClose()
                }}
              >
                <Check size={16} /> Mark as Read
              </Button>
            )}
            <Button variant="ghost" size="sm" onClick={onClose}>
              Close
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  )
}
