import { useState } from "react";
import { Radio, Send, Check } from "lucide-react";

export default function StatusIncidentsPage() {
  const [sent, setSent] = useState(false);
  const [headline, setHeadline] = useState("Scheduled Maintenance: Database Upgrades");

  const handleSend = () => {
    setSent(true);
    setTimeout(() => setSent(false), 3000);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold tracking-tight text-white sm:text-2xl flex items-center gap-2">
          <Radio className="text-amber-400" size={24} />
          <span>Platform Health & Alerts</span>
        </h2>
        <p className="mt-1 text-xs sm:text-sm text-slate-400">Monitor component availability and broadcast maintenance advisories.</p>
      </div>
      {sent && (
        <div className="rounded-lg border border-emerald-500/40 bg-emerald-950/20 p-3 text-xs text-emerald-300 flex items-center gap-2">
          <Check size={16} /> Broadcast published to tenant portals.
        </div>
      )}
      <div className="rounded-xl border border-slate-800 bg-[#161922] p-5 space-y-4">
        <label className="block text-xs font-medium text-slate-300">Notice Headline</label>
        <input
          type="text"
          value={headline}
          onChange={(e) => setHeadline(e.target.value)}
          className="w-full rounded-lg border border-slate-700 bg-[#0d0f14] px-3 py-2 text-xs text-white"
        />
        <button onClick={handleSend} className="flex items-center gap-2 rounded-lg bg-amber-500 px-4 py-2 text-xs font-semibold text-slate-950 hover:bg-amber-400">
          <Send size={14} />
          <span>Publish Alert Banner</span>
        </button>
      </div>
    </div>
  );
}
