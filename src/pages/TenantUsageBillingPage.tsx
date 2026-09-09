import { useState } from "react";
import { CreditCard, Download } from "lucide-react";

export default function TenantUsageBillingPage() {
  const [downloaded, setDownloaded] = useState(false);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-white sm:text-2xl flex items-center gap-2">
            <CreditCard className="text-amber-400" size={24} />
            <span>Tenant Quotas & Billing</span>
          </h2>
          <p className="mt-1 text-xs sm:text-sm text-slate-400">Track resource quota consumption and generate itemized billing statements.</p>
        </div>
        <button onClick={() => { setDownloaded(true); setTimeout(() => setDownloaded(false), 2000); }} className="flex items-center gap-2 rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-xs font-medium text-white hover:bg-slate-700">
          <Download size={14} />
          <span>{downloaded ? "Downloaded" : "Export Invoice (PDF)"}</span>
        </button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="rounded-xl border border-slate-800 bg-[#161922] p-4">
          <span className="text-xs text-slate-400">User Seats</span>
          <div className="text-2xl font-bold text-white mt-1">142 / 200</div>
        </div>
        <div className="rounded-xl border border-slate-800 bg-[#161922] p-4">
          <span className="text-xs text-slate-400">Storage Quota</span>
          <div className="text-2xl font-bold text-white mt-1">28.4 / 100 GB</div>
        </div>
        <div className="rounded-xl border border-slate-800 bg-[#161922] p-4">
          <span className="text-xs text-slate-400">Monthly API Calls</span>
          <div className="text-2xl font-bold text-white mt-1">624K / 1M</div>
        </div>
      </div>
    </div>
  );
}
