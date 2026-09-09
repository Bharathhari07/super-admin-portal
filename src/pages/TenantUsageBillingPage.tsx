import { useState } from 'react'
import { Search, Download, CheckCircle2 } from 'lucide-react'
import Select from '../components/common/Select'
import Button from '../components/common/Button'
import Badge from '../components/common/Badge'
import Pagination from '../components/common/Pagination'
import Spinner from '../components/common/Spinner'
import EmptyState from '../components/common/EmptyState'
import { useTenantUsage } from '../hooks/queries/useTenantUsage'
import { useMarkInvoicePaid } from '../hooks/mutations/useMarkInvoicePaid'
import { exportInvoice } from '../api/tenantUsageApi'
import type { BillingStatus, TenantUsageQueryParams, TenantUsageRecord } from '../types/tenantUsage'

const PAGE_SIZE = 5

function billingTone(status: BillingStatus): 'success' | 'danger' | 'warning' {
  if (status === 'Paid') return 'success'
  if (status === 'Overdue') return 'danger'
  return 'warning'
}

function usageBar(used: number, limit: number) {
  const percent = Math.min(100, Math.round((used / limit) * 100))
  const color = percent >= 90 ? 'bg-sap-danger' : percent >= 70 ? 'bg-sap-warning' : 'bg-sap-primary'
  return (
    <div className="h-1.5 w-24 overflow-hidden rounded-full bg-sap-bg">
      <div className={`h-full ${color}`} style={{ width: `${percent}%` }} />
    </div>
  )
}

export default function TenantUsageBillingPage() {
  const [search, setSearch] = useState('')
  const [billingStatus, setBillingStatus] = useState<BillingStatus | 'All'>('All')
  const [page, setPage] = useState(1)
  const [exportingId, setExportingId] = useState<string | null>(null)

  const queryParams: TenantUsageQueryParams = { search, billingStatus, page, pageSize: PAGE_SIZE }
  const { data, isLoading } = useTenantUsage(queryParams)
  const markPaid = useMarkInvoicePaid()

  const records = data?.data ?? []
  const total = data?.total ?? 0

  async function handleExport(record: TenantUsageRecord) {
    setExportingId(record.id)
    const csv = await exportInvoice(record.id)
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `${record.tenantName.replace(/\s+/g, '-').toLowerCase()}-invoice.csv`
    link.click()
    setExportingId(null)
  }

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-xl font-semibold text-sap-text">Tenant Quotas & Billing</h2>
        <p className="text-sm text-sap-text-muted">Track resource quota consumption and generate itemized billing statements.</p>
      </div>

      <div className="rounded-xl border border-sap-border bg-sap-surface p-4 shadow-sm">
        <div className="mb-4 flex flex-col justify-between gap-3 xl:flex-row xl:items-center">
          <div className="relative w-full sm:max-w-xs">
            <Search size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sap-text-muted" />
            <input
              type="text"
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1) }}
              placeholder="Search by tenant..."
              className="w-full rounded-lg border border-sap-border bg-sap-surface py-2 pl-9 pr-3 text-sm text-sap-text placeholder:text-sap-text-muted outline-none transition-colors focus:border-sap-primary focus:ring-2 focus:ring-sap-primary/20"
            />
          </div>
          <Select
            aria-label="Filter by billing status"
            value={billingStatus}
            onChange={(e) => { setBillingStatus(e.target.value as BillingStatus | 'All'); setPage(1) }}
            options={[
              { label: 'All Statuses', value: 'All' },
              { label: 'Paid', value: 'Paid' },
              { label: 'Pending', value: 'Pending' },
              { label: 'Overdue', value: 'Overdue' },
            ]}
          />
        </div>

        <div className="overflow-x-auto sap-scroll">
          <table className="w-full min-w-[920px] border-collapse">
            <thead>
              <tr className="border-b border-sap-border bg-sap-bg/60 text-left">
                <th className="whitespace-nowrap px-4 py-3 text-xs font-semibold uppercase tracking-wide text-sap-text-muted">Tenant</th>
                <th className="whitespace-nowrap px-4 py-3 text-xs font-semibold uppercase tracking-wide text-sap-text-muted">Seats</th>
                <th className="whitespace-nowrap px-4 py-3 text-xs font-semibold uppercase tracking-wide text-sap-text-muted">Storage</th>
                <th className="whitespace-nowrap px-4 py-3 text-xs font-semibold uppercase tracking-wide text-sap-text-muted">API Calls</th>
                <th className="whitespace-nowrap px-4 py-3 text-xs font-semibold uppercase tracking-wide text-sap-text-muted">Invoice</th>
                <th className="whitespace-nowrap px-4 py-3 text-xs font-semibold uppercase tracking-wide text-sap-text-muted">Status</th>
                <th className="whitespace-nowrap px-4 py-3 text-xs font-semibold uppercase tracking-wide text-sap-text-muted">Actions</th>
              </tr>
            </thead>
            <tbody>
              {isLoading && (
                <tr><td colSpan={7} className="py-10"><div className="flex justify-center"><Spinner /></div></td></tr>
              )}
              {!isLoading && records.length === 0 && (
                <tr><td colSpan={7}><EmptyState title="No tenant usage records found" description="Try adjusting your search or filters." /></td></tr>
              )}
              {!isLoading && records.map((r) => (
                <tr key={r.id} className="border-b border-sap-border last:border-0 hover:bg-sap-bg/60">
                  <td className="whitespace-nowrap px-4 py-3 text-sm">
                    <div className="font-medium text-sap-text">{r.tenantName}</div>
                    <div className="text-xs text-sap-text-muted">{r.plan}</div>
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-sm">
                    <div className="text-sap-text-muted">{r.seatsUsed} / {r.seatsLimit}</div>
                    {usageBar(r.seatsUsed, r.seatsLimit)}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-sm">
                    <div className="text-sap-text-muted">{r.storageUsedGb} / {r.storageLimitGb} GB</div>
                    {usageBar(r.storageUsedGb, r.storageLimitGb)}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-sm">
                    <div className="text-sap-text-muted">{(r.apiCallsUsed / 1000).toFixed(0)}K / {(r.apiCallsLimit / 1000).toFixed(0)}K</div>
                    {usageBar(r.apiCallsUsed, r.apiCallsLimit)}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-sm text-sap-text-muted">{r.currency} {r.currentInvoiceAmount.toLocaleString()}</td>
                  <td className="whitespace-nowrap px-4 py-3 text-sm">
                    <Badge tone={billingTone(r.billingStatus)} dot>{r.billingStatus}</Badge>
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-sm">
                    <div className="flex items-center gap-1">
                      <Button variant="ghost" size="sm" onClick={() => handleExport(r)} isLoading={exportingId === r.id}>
                        <Download size={14} />
                      </Button>
                      {r.billingStatus !== 'Paid' && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => markPaid.mutate(r.id)}
                          isLoading={markPaid.isPending && markPaid.variables === r.id}
                          className="text-sap-success"
                        >
                          <CheckCircle2 size={14} /> Mark Paid
                        </Button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <Pagination page={page} pageSize={PAGE_SIZE} total={total} onPageChange={setPage} itemLabel="tenants" />
      </div>
    </div>
  )
}
