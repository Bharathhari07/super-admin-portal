import { useState } from 'react'
import { Send, Check } from 'lucide-react'
import Input from '../components/common/Input'
import Button from '../components/common/Button'

export default function StatusIncidentsPage() {
  const [sent, setSent] = useState(false)
  const [headline, setHeadline] = useState('Scheduled Maintenance: Database Upgrades')

  function handleSend() {
    setSent(true)
    setTimeout(() => setSent(false), 3000)
  }

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-xl font-semibold text-sap-text">Platform Health & Alerts</h2>
        <p className="text-sm text-sap-text-muted">Monitor component availability and broadcast maintenance advisories to tenants.</p>
      </div>

      {sent && (
        <div className="flex items-center gap-2 rounded-lg border border-sap-border bg-sap-success-bg px-4 py-2 text-sm text-sap-success">
          <Check size={16} /> Broadcast published to tenant portals.
        </div>
      )}

      <div className="rounded-xl border border-sap-border bg-sap-surface p-5 shadow-sm">
        <div className="space-y-4">
          <Input id="headline" label="Notice Headline" value={headline} onChange={(e) => setHeadline(e.target.value)} />
          <Button onClick={handleSend}>
            <Send size={16} /> Publish Alert Banner
          </Button>
        </div>
      </div>
    </div>
  )
}
