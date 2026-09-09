import { useState } from "react";
import { UploadCloud, Download, Users } from "lucide-react";

export default function BulkOnboardingPage() {
  const [selectedTenantId, setSelectedTenantId] = useState("tenant-001");

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-white sm:text-2xl flex items-center gap-2">
            <Users className="text-amber-400" size={24} />
            <span>Batch Tenant Provisioning</span>
          </h2>
          <p className="mt-1 text-xs sm:text-sm text-slate-400">Bulk-import organization rosters, departments, and user roles from Excel or CSV.</p>
        </div>
        <button className="flex items-center gap-2 rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-xs font-medium text-white hover:bg-slate-700">
          <Download size={14} />
          <span>Download Sample Template</span>
        </button>
      </div>
      <div className="rounded-xl border border-slate-800 bg-[#161922] p-5 space-y-4">
        <label className="block text-xs font-medium text-slate-300">Target Tenant Workspace</label>
        <select value={selectedTenantId} onChange={(e) => setSelectedTenantId(e.target.value)} className="w-full sm:w-80 rounded-lg border border-slate-700 bg-[#0d0f14] px-3 py-2 text-xs text-white">
          <option value="tenant-001">Acme Corporation (ACM-01)</option>
          <option value="tenant-002">Global Tech Industries (GTI-02)</option>
        </select>
        <div className="rounded-xl border-2 border-dashed border-slate-700 bg-[#0d0f14]/50 p-8 text-center">
          <UploadCloud className="mx-auto text-amber-400 mb-2" size={32} />
          <h4 className="text-sm font-semibold text-white">Upload Organization Roster</h4>
          <p className="text-xs text-slate-400 mt-1">Drag and drop spreadsheet (.xlsx, .csv)</p>
        </div>
      </div>
    </div>
  );
}
