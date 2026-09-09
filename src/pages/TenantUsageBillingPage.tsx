import { useState } from 'react'
import { Download } from 'lucide-react'
import Button from '../components/common/Button'

const usageStats = [
  { label: 'User Seats', value: '142 / 200' },
  { label: 'Storage Quota', value: '28.4 / 100 GB' },
  { label: 'Monthly API Calls', value: '624K / 1M' },
]

export default function TenantUsageBillingPage() {
  const [downloaded, setDownloaded] = useState(false)

  function handleExport() {
    setDownloaded(true)
    setTimeout(() => setDownloaded(false), 2000)
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h2 className="text-xl font-semibold text-sap-text">Tenant Quotas & Billing</h2>
          <p className="text-sm text-sap-text-muted">Track resource quota consumption and generate itemized billing statements.</p>
        </div>
        <Button variant="outline" onClick={handleExport}>
          <Download size={16} /> {downloaded ? 'Downloaded' : 'Export Invoice (PDF)'}
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {usageStats.map((stat) => (
          <div key={stat.label} className="rounded-xl border border-sap-border bg-sap-surface p-4 shadow-sm">
            <p className="text-sm text-sap-text-muted">{stat.label}</p>
            <p className="mt-1 text-xl font-semibold text-sap-text">{stat.value}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
