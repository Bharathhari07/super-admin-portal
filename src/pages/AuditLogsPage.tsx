import { useState } from 'react'
import { Download, ShieldAlert, FileText, AlertOctagon, CheckCircle2 } from 'lucide-react'
import Button from '../components/common/Button'
import Pagination from '../components/common/Pagination'
import Select from '../components/common/Select'
import Badge from '../components/common/Badge'
import AuditLogDetailsModal from '../components/auditLogs/AuditLogDetailsModal'
import { useAuditLogs } from '../hooks/queries/useAuditLogs'
import { exportAuditLogs } from '../api/auditLogApi'
import {
  AUDIT_ACTION_OPTIONS,
  AUDIT_MODULE_OPTIONS,
  AUDIT_STATUS_OPTIONS,
} from '../types/auditLog'
import type { AuditLog, AuditAction, AuditModule, AuditStatus, AuditLogQueryParams } from '../types/auditLog'

const PAGE_SIZE = 8

export default function AuditLogsPage() {
  const [search, setSearch] = useState('')
  const [action, setAction] = useState<AuditAction | 'All'>('All')
  const [module, setModule] = useState<AuditModule | 'All'>('All')
  const [status, setStatus] = useState<AuditStatus | 'All'>('All')
  const [sortBy, setSortBy] = useState<'timestamp' | 'actorName'>('timestamp')
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc')
  const [page, setPage] = useState(1)

  const [selectedLog, setSelectedLog] = useState<AuditLog | null>(null)
  const [isExporting, setIsExporting] = useState(false)

  const queryParams: AuditLogQueryParams = { search, action, module, status, sortBy, sortDir, page, pageSize: PAGE_SIZE }
  const { data, isLoading } = useAuditLogs(queryParams)
  const logs = data?.data ?? []
  const total = data?.total ?? 0

  async function handleExport() {
    setIsExporting(true)
    const csv = await exportAuditLogs(queryParams)
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `audit-logs-${new Date().toISOString().slice(0, 10)}.csv`
    link.click()
    setIsExporting(false)
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h2 className="text-xl font-semibold text-sap-text">System Audit Logs</h2>
          <p className="text-sm text-sap-text-muted">
            Immutable trace of administrative operations, policy changes, and security events.
          </p>
        </div>
        <Button variant="outline" onClick={handleExport} isLoading={isExporting}>
          <Download size={16} /> Export Audit Trail (CSV)
        </Button>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <div className="flex items-center gap-3 rounded-xl border border-sap-border bg-sap-surface p-4">
          <div className="rounded-lg bg-sap-navy-light p-2 text-sap-text"><FileText size={20} /></div>
          <div>
            <div className="text-xl font-bold text-sap-text">{total}</div>
            <div className="text-xs text-sap-text-muted">Total Events</div>
          </div>
        </div>
        <div className="flex items-center gap-3 rounded-xl border border-sap-border bg-sap-surface p-4">
          <div className="rounded-lg bg-sap-success-bg p-2 text-sap-success"><CheckCircle2 size={20} /></div>
          <div>
            <div className="text-xl font-bold text-sap-success">{logs.filter((l) => l.status === 'Success').length}</div>
            <div className="text-xs text-sap-text-muted">Successful in View</div>
          </div>
        </div>
        <div className="flex items-center gap-3 rounded-xl border border-sap-border bg-sap-surface p-4">
          <div className="rounded-lg bg-sap-danger-bg p-2 text-sap-danger"><AlertOctagon size={20} /></div>
          <div>
            <div className="text-xl font-bold text-sap-danger">{logs.filter((l) => l.status === 'Failed' || l.status === 'Warning').length}</div>
            <div className="text-xs text-sap-text-muted">Anomalies / Warnings</div>
          </div>
        </div>
        <div className="flex items-center gap-3 rounded-xl border border-sap-border bg-sap-surface p-4">
          <div className="rounded-lg bg-sap-warning-bg p-2 text-sap-warning"><ShieldAlert size={20} /></div>
          <div>
            <div className="text-xl font-bold text-sap-warning">{logs.filter((l) => l.module === 'Security').length}</div>
            <div className="text-xs text-sap-text-muted">Security Events</div>
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-sap-border bg-sap-surface p-4 shadow-sm">
        <div className="mb-4 flex flex-col justify-between gap-3 xl:flex-row xl:items-center">
          <input
            type="text"
            placeholder="Search description, actor, IP..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            className="w-full xl:w-72 rounded-lg border border-sap-border bg-sap-bg px-3 py-1.5 text-sm text-sap-text placeholder-sap-text-muted"
          />

          <div className="grid grid-cols-2 gap-2 sm:flex sm:flex-wrap">
            <Select
              aria-label="Filter by module"
              value={module}
              onChange={(e) => { setModule(e.target.value as AuditModule | 'All'); setPage(1); }}
              options={[{ label: 'All Modules', value: 'All' }, ...AUDIT_MODULE_OPTIONS.map((m) => ({ label: m, value: m }))]}
            />
            <Select
              aria-label="Filter by action"
              value={action}
              onChange={(e) => { setAction(e.target.value as AuditAction | 'All'); setPage(1); }}
              options={[{ label: 'All Actions', value: 'All' }, ...AUDIT_ACTION_OPTIONS.map((a) => ({ label: a, value: a }))]}
            />
            <Select
              aria-label="Filter by status"
              value={status}
              onChange={(e) => { setStatus(e.target.value as AuditStatus | 'All'); setPage(1); }}
              options={[{ label: 'All Statuses', value: 'All' }, ...AUDIT_STATUS_OPTIONS.map((s) => ({ label: s, value: s }))]}
            />
            <Select
              aria-label="Sort audit logs"
              value={`${sortBy}:${sortDir}`}
              onChange={(e) => {
                const [nextBy, nextDir] = e.target.value.split(':') as ['timestamp' | 'actorName', 'asc' | 'desc']
                setSortBy(nextBy)
                setSortDir(nextDir)
              }}
              options={[
                { label: 'Newest first', value: 'timestamp:desc' },
                { label: 'Oldest first', value: 'timestamp:asc' },
                { label: 'Actor Name A-Z', value: 'actorName:asc' },
                { label: 'Actor Name Z-A', value: 'actorName:desc' },
              ]}
            />
          </div>
        </div>

        <div className="overflow-x-auto rounded-lg border border-sap-border sap-scroll">
          <table className="w-full min-w-[820px] text-left text-sm">
            <thead className="border-b border-sap-border bg-sap-bg text-xs font-semibold text-sap-text-muted">
              <tr>
                <th className="px-4 py-3">Event / ID</th>
                <th className="px-4 py-3">Actor</th>
                <th className="px-4 py-3">Module</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Timestamp</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-sap-border">
              {isLoading ? (
                <tr><td colSpan={6} className="py-6 text-center text-xs text-sap-text-muted">Loading logs...</td></tr>
              ) : logs.length === 0 ? (
                <tr><td colSpan={6} className="py-6 text-center text-xs text-sap-text-muted">No logs matching filters found.</td></tr>
              ) : (
                logs.map((log) => (
                  <tr key={log.id} className="hover:bg-sap-bg/50">
                    <td className="px-4 py-3">
                      <div className="font-medium text-sap-text">{log.description}</div>
                      <div className="font-mono text-xs text-sap-text-muted">{log.id} • {log.ipAddress}</div>
                    </td>
                    <td className="px-4 py-3 text-xs">
                      <div className="font-medium text-sap-text">{log.actorName}</div>
                      <div className="text-sap-text-muted">{log.actorEmail}</div>
                    </td>
                    <td className="px-4 py-3 text-xs text-sap-text">{log.module}</td>
                    <td className="px-4 py-3">
                      <Badge tone={log.status === 'Success' ? 'success' : log.status === 'Warning' ? 'warning' : 'danger'} dot>
                        {log.status}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 text-xs text-sap-text-muted">{new Date(log.timestamp).toLocaleString()}</td>
                    <td className="px-4 py-3 text-right">
                      <Button variant="ghost" size="sm" onClick={() => setSelectedLog(log)}>View</Button>
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
          itemLabel="events"
        />
      </div>

      <AuditLogDetailsModal open={Boolean(selectedLog)} log={selectedLog} onClose={() => setSelectedLog(null)} />
    </div>
  )
}
