import { useState } from 'react'
import { RotateCcw, CheckCircle2 } from 'lucide-react'
import Button from '../components/common/Button'

export default function DisasterRecoveryPage() {
  const [restoring, setRestoring] = useState(false)
  const [done, setDone] = useState(false)

  function handleRestore() {
    setRestoring(true)
    setTimeout(() => {
      setRestoring(false)
      setDone(true)
      setTimeout(() => setDone(false), 3000)
    }, 1200)
  }

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-xl font-semibold text-sap-text">Tenant Data Isolation & Recovery</h2>
        <p className="text-sm text-sap-text-muted">Point-in-time recovery and snapshot rollbacks for isolated tenant workspaces.</p>
      </div>

      {done && (
        <div className="flex items-center gap-3 rounded-lg border border-sap-border bg-sap-success-bg px-4 py-3 text-sm text-sap-success">
          <CheckCircle2 size={20} />
          Snapshot recovery executed successfully.
        </div>
      )}

      <div className="rounded-xl border border-sap-border bg-sap-surface p-5 shadow-sm">
        <Button onClick={handleRestore} isLoading={restoring}>
          <RotateCcw size={16} /> {restoring ? 'Restoring Workspace...' : 'Initiate Snapshot Restore'}
        </Button>
      </div>
    </div>
  )
}
