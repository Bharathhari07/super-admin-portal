import { useState } from 'react'
import { Search, Send, XCircle } from 'lucide-react'
import Select from '../components/common/Select'
import Input from '../components/common/Input'
import Button from '../components/common/Button'
import Badge from '../components/common/Badge'
import Pagination from '../components/common/Pagination'
import Spinner from '../components/common/Spinner'
import EmptyState from '../components/common/EmptyState'
import { dummyTenants } from '../data/dummyTenants'
import { SEVERITY_OPTIONS, AUDIENCE_OPTIONS } from '../types/statusAnnouncement'
import { useStatusAnnouncements } from '../hooks/queries/useStatusAnnouncements'
import { useCreateAnnouncement } from '../hooks/mutations/useCreateAnnouncement'
import { useExpireAnnouncement } from '../hooks/mutations/useExpireAnnouncement'
import type {
  AnnouncementSeverity,
  AnnouncementAudience,
  AnnouncementStatus,
  StatusAnnouncementQueryParams,
} from '../types/statusAnnouncement'

const PAGE_SIZE = 5

function severityTone(severity: AnnouncementSeverity): 'success' | 'danger' | 'warning' | 'info' {
  if (severity === 'Critical') return 'danger'
  if (severity === 'Warning') return 'warning'
  return 'info'
}

export default function StatusIncidentsPage() {
  const [title, setTitle] = useState('')
  const [message, setMessage] = useState('')
  const [severity, setSeverity] = useState<AnnouncementSeverity>('Info')
  const [audienceScope, setAudienceScope] = useState<AnnouncementAudience>('All Tenants')
  const [tenantId, setTenantId] = useState(dummyTenants[0]?.id ?? '')
  const [formError, setFormError] = useState<string | null>(null)

  const [search, setSearch] = useState('')
  const [status, setStatus] = useState<AnnouncementStatus | 'All'>('All')
  const [filterSeverity, setFilterSeverity] = useState<AnnouncementSeverity | 'All'>('All')
  const [page, setPage] = useState(1)

  const queryParams: StatusAnnouncementQueryParams = { search, status, severity: filterSeverity, page, pageSize: PAGE_SIZE }
  const { data, isLoading } = useStatusAnnouncements(queryParams)
  const createAnnouncement = useCreateAnnouncement()
  const expireAnnouncement = useExpireAnnouncement()

  const announcements = data?.data ?? []
  const total = data?.total ?? 0

  function handlePublish() {
    setFormError(null)
    if (!title.trim()) {
      setFormError('Enter a headline for this announcement.')
      return
    }
    if (!message.trim()) {
      setFormError('Enter the announcement message.')
      return
    }
    createAnnouncement.mutate(
      {
        title: title.trim(),
        message: message.trim(),
        severity,
        audienceScope,
        tenantId: audienceScope === 'Specific Tenant' ? tenantId : null,
      },
      {
        onSuccess: () => {
          setTitle('')
          setMessage('')
          setPage(1)
        },
      },
    )
  }

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-xl font-semibold text-sap-text">Platform Health & Alerts</h2>
        <p className="text-sm text-sap-text-muted">Monitor component availability and broadcast maintenance advisories to tenants.</p>
      </div>

      <div className="rounded-xl border border-sap-border bg-sap-surface p-5 shadow-sm">
        <h3 className="mb-4 text-sm font-semibold text-sap-text">Publish New Announcement</h3>
        <div className="space-y-4">
          <Input id="title" label="Headline" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Scheduled Maintenance" />
          <Input id="message" label="Message" value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Details tenants will see" />
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <Select id="severity" label="Severity" value={severity} onChange={(e) => setSeverity(e.target.value as AnnouncementSeverity)} options={SEVERITY_OPTIONS.map((s) => ({ label: s, value: s }))} />
            <Select id="audienceScope" label="Audience" value={audienceScope} onChange={(e) => setAudienceScope(e.target.value as AnnouncementAudience)} options={AUDIENCE_OPTIONS.map((a) => ({ label: a, value: a }))} />
            {audienceScope === 'Specific Tenant' && (
              <Select id="tenantId" label="Tenant" value={tenantId} onChange={(e) => setTenantId(e.target.value)} options={dummyTenants.map((t) => ({ label: t.name, value: t.id }))} />
            )}
          </div>
          {formError && <p className="text-sm text-sap-danger">{formError}</p>}
          <Button onClick={handlePublish} isLoading={createAnnouncement.isPending}>
            <Send size={16} /> Publish Alert Banner
          </Button>
        </div>
      </div>

      <div className="rounded-xl border border-sap-border bg-sap-surface p-4 shadow-sm">
        <h3 className="mb-4 text-sm font-semibold text-sap-text">Announcement History</h3>
        <div className="mb-4 flex flex-col justify-between gap-3 xl:flex-row xl:items-center">
          <div className="relative w-full sm:max-w-xs">
            <Search size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sap-text-muted" />
            <input
              type="text"
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1) }}
              placeholder="Search announcements..."
              className="w-full rounded-lg border border-sap-border bg-sap-surface py-2 pl-9 pr-3 text-sm text-sap-text placeholder:text-sap-text-muted outline-none transition-colors focus:border-sap-primary focus:ring-2 focus:ring-sap-primary/20"
            />
          </div>
          <div className="grid grid-cols-2 gap-3 sm:flex sm:flex-wrap">
            <Select
              aria-label="Filter by status"
              value={status}
              onChange={(e) => { setStatus(e.target.value as AnnouncementStatus | 'All'); setPage(1) }}
              options={[{ label: 'All Statuses', value: 'All' }, { label: 'Active', value: 'Active' }, { label: 'Expired', value: 'Expired' }]}
            />
            <Select
              aria-label="Filter by severity"
              value={filterSeverity}
              onChange={(e) => { setFilterSeverity(e.target.value as AnnouncementSeverity | 'All'); setPage(1) }}
              options={[{ label: 'All Severities', value: 'All' }, ...SEVERITY_OPTIONS.map((s) => ({ label: s, value: s }))]}
            />
          </div>
        </div>

        <div className="overflow-x-auto sap-scroll">
          <table className="w-full min-w-[760px] border-collapse">
            <thead>
              <tr className="border-b border-sap-border bg-sap-bg/60 text-left">
                <th className="whitespace-nowrap px-4 py-3 text-xs font-semibold uppercase tracking-wide text-sap-text-muted">Announcement</th>
                <th className="whitespace-nowrap px-4 py-3 text-xs font-semibold uppercase tracking-wide text-sap-text-muted">Severity</th>
                <th className="whitespace-nowrap px-4 py-3 text-xs font-semibold uppercase tracking-wide text-sap-text-muted">Audience</th>
                <th className="whitespace-nowrap px-4 py-3 text-xs font-semibold uppercase tracking-wide text-sap-text-muted">Status</th>
                <th className="whitespace-nowrap px-4 py-3 text-xs font-semibold uppercase tracking-wide text-sap-text-muted">Published</th>
                <th className="whitespace-nowrap px-4 py-3 text-xs font-semibold uppercase tracking-wide text-sap-text-muted">Actions</th>
              </tr>
            </thead>
            <tbody>
              {isLoading && (
                <tr><td colSpan={6} className="py-10"><div className="flex justify-center"><Spinner /></div></td></tr>
              )}
              {!isLoading && announcements.length === 0 && (
                <tr><td colSpan={6}><EmptyState title="No announcements found" description="Try adjusting your search or filters." /></td></tr>
              )}
              {!isLoading && announcements.map((a) => (
                <tr key={a.id} className="border-b border-sap-border last:border-0 hover:bg-sap-bg/60">
                  <td className="px-4 py-3 text-sm">
                    <div className="font-medium text-sap-text">{a.title}</div>
                    <div className="max-w-xs truncate text-xs text-sap-text-muted">{a.message}</div>
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-sm">
                    <Badge tone={severityTone(a.severity)}>{a.severity}</Badge>
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-sm text-sap-text-muted">{a.audienceScope === 'Specific Tenant' ? a.tenantName : 'All Tenants'}</td>
                  <td className="whitespace-nowrap px-4 py-3 text-sm">
                    <Badge tone={a.status === 'Active' ? 'success' : 'neutral'} dot>{a.status}</Badge>
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-sm text-sap-text-muted">{new Date(a.publishedAt).toLocaleString()}</td>
                  <td className="whitespace-nowrap px-4 py-3 text-sm">
                    {a.status === 'Active' && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => expireAnnouncement.mutate(a.id)}
                        isLoading={expireAnnouncement.isPending && expireAnnouncement.variables === a.id}
                        className="text-sap-danger"
                      >
                        <XCircle size={14} /> Expire
                      </Button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <Pagination page={page} pageSize={PAGE_SIZE} total={total} onPageChange={setPage} itemLabel="announcements" />
      </div>
    </div>
  )
}
