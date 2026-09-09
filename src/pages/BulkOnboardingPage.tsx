import { useState } from 'react'
import { UploadCloud, Download } from 'lucide-react'
import Select from '../components/common/Select'
import Button from '../components/common/Button'
import { dummyTenants } from '../data/dummyTenants'

export default function BulkOnboardingPage() {
  const [tenantId, setTenantId] = useState(dummyTenants[0]?.id ?? '')

  return (
    <div className="space-y-5">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h2 className="text-xl font-semibold text-sap-text">Batch Tenant Provisioning</h2>
          <p className="text-sm text-sap-text-muted">Bulk-import organization rosters, departments, and user roles from a spreadsheet.</p>
        </div>
        <Button variant="outline">
          <Download size={16} /> Download Sample Template
        </Button>
      </div>

      <div className="rounded-xl border border-sap-border bg-sap-surface p-5 shadow-sm">
        <div className="space-y-4">
          <Select
            id="tenantId"
            label="Target Tenant Workspace"
            value={tenantId}
            onChange={(e) => setTenantId(e.target.value)}
            options={dummyTenants.map((t) => ({ label: `${t.name} (${t.code})`, value: t.id }))}
          />
          <div className="rounded-xl border-2 border-dashed border-sap-border bg-sap-bg/40 p-8 text-center">
            <UploadCloud className="mx-auto mb-2 text-sap-primary" size={32} />
            <h4 className="text-sm font-semibold text-sap-text">Upload Organization Roster</h4>
            <p className="mt-1 text-xs text-sap-text-muted">Drag and drop a spreadsheet (.xlsx, .csv)</p>
          </div>
        </div>
      </div>
    </div>
  )
}
