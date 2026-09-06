import { ShieldAlert, ArrowRight } from 'lucide-react'
import type { AuditLog } from '../../types/auditLog'
import Modal from '../common/Modal'
import Badge from '../common/Badge'
import Button from '../common/Button'

interface AuditLogDetailsModalProps {
  log: AuditLog | null
  open: boolean
  onClose: () => void
}

export default function AuditLogDetailsModal({ log, open, onClose }: AuditLogDetailsModalProps) {
  if (!log) return null

  return (
    <Modal open={open} onClose={onClose} title="Audit Event Trace" widthClass="max-w-2xl">
      <div className="space-y-4">
        <div className="flex items-start gap-3 rounded-lg border border-sap-border bg-sap-bg/50 p-4">
          <div className="rounded-lg bg-sap-primary/10 p-2 text-sap-primary">
            <ShieldAlert size={20} />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs text-sap-text-muted">{log.id}</span>
              <Badge tone={log.status === 'Success' ? 'success' : log.status === 'Warning' ? 'warning' : 'danger'} dot>
                {log.status}
              </Badge>
              <Badge tone="info">{log.action}</Badge>
            </div>
            <h3 className="mt-1 text-sm font-semibold text-sap-text">{log.description}</h3>
            <p className="text-xs text-sap-text-muted">{new Date(log.timestamp).toUTCString()}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div className="rounded-lg border border-sap-border bg-sap-bg/30 p-3">
            <div className="text-xs font-semibold text-sap-text-muted">Actor Information</div>
            <div className="mt-2 space-y-1 text-xs">
              <div className="flex justify-between gap-2">
                <span className="text-sap-text-muted shrink-0">Name:</span>
                <span className="font-medium text-sap-text truncate">{log.actorName}</span>
              </div>
              <div className="flex justify-between gap-2">
                <span className="text-sap-text-muted shrink-0">Email:</span>
                <span className="font-medium text-sap-text break-all text-right">{log.actorEmail}</span>
              </div>
              <div className="flex justify-between gap-2">
                <span className="text-sap-text-muted shrink-0">Role:</span>
                <span className="font-medium text-sap-text">{log.actorRole}</span>
              </div>
            </div>
          </div>

          <div className="rounded-lg border border-sap-border bg-sap-bg/30 p-3">
            <div className="text-xs font-semibold text-sap-text-muted">Network & Client Context</div>
            <div className="mt-2 space-y-1 text-xs">
              <div className="flex justify-between gap-2">
                <span className="text-sap-text-muted shrink-0">IP Address:</span>
                <span className="font-mono font-medium text-sap-text">{log.ipAddress}</span>
              </div>
              <div className="flex justify-between gap-2">
                <span className="text-sap-text-muted shrink-0">Geo Location:</span>
                <span className="font-medium text-sap-text text-right">{log.location}</span>
              </div>
              <div className="flex justify-between gap-2">
                <span className="text-sap-text-muted shrink-0">Module:</span>
                <span className="font-medium text-sap-text">{log.module}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-lg border border-sap-border bg-sap-bg/20 p-3 text-xs break-all">
          <span className="text-sap-text-muted">User Agent: </span>
          <span className="font-mono text-sap-text-muted/80">{log.userAgent}</span>
        </div>

        {log.changes && log.changes.length > 0 && (
          <div className="space-y-2">
            <div className="text-xs font-semibold uppercase tracking-wider text-sap-text-muted">
              Modified State Diff
            </div>
            <div className="overflow-x-auto rounded-lg border border-sap-border bg-sap-bg/40">
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b border-sap-border bg-sap-surface text-left">
                    <th className="px-3 py-2 text-sap-text-muted font-medium">Field</th>
                    <th className="px-3 py-2 text-sap-text-muted font-medium">Prior Value</th>
                    <th className="w-6 px-1 py-2"></th>
                    <th className="px-3 py-2 text-sap-text-muted font-medium">New Value</th>
                  </tr>
                </thead>
                <tbody>
                  {log.changes.map((change: { field: string; oldValue: string; newValue: string }, idx: number) => (
                    <tr key={idx} className="border-b border-sap-border last:border-0">
                      <td className="px-3 py-2 font-mono font-medium text-sap-text">{change.field}</td>
                      <td className="px-3 py-2 text-sap-danger bg-sap-danger-bg/20 font-mono">{change.oldValue}</td>
                      <td className="px-1 py-2 text-center text-sap-text-muted">
                        <ArrowRight size={12} />
                      </td>
                      <td className="px-3 py-2 text-sap-success bg-sap-success-bg/20 font-mono">{change.newValue}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        <div className="flex justify-end border-t border-sap-border pt-3">
          <Button variant="ghost" onClick={onClose}>
            Close
          </Button>
        </div>
      </div>
    </Modal>
  )
}
