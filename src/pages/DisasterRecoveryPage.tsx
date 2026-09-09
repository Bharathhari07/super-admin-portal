import { useState } from "react";
import { History, RotateCcw, CheckCircle2 } from "lucide-react";

export default function DisasterRecoveryPage() {
  const [restoring, setRestoring] = useState(false);
  const [done, setDone] = useState(false);

  const handleRestore = () => {
    setRestoring(true);
    setTimeout(() => {
      setRestoring(false);
      setDone(true);
      setTimeout(() => setDone(false), 3000);
    }, 1200);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold tracking-tight text-white sm:text-2xl flex items-center gap-2">
          <History className="text-amber-400" size={24} />
          <span>Tenant Data Isolation & Recovery</span>
        </h2>
        <p className="mt-1 text-xs sm:text-sm text-slate-400">Point-in-time recovery and snapshot rollbacks for isolated tenant workspaces.</p>
      </div>
      {done && (
        <div className="rounded-xl border border-emerald-500/40 bg-emerald-950/30 p-4 flex items-center gap-3">
          <CheckCircle2 size={24} className="text-emerald-400" />
          <div className="text-sm font-semibold text-white">Snapshot Recovery Executed Successfully</div>
        </div>
      )}
      <div className="rounded-xl border border-slate-800 bg-[#161922] p-5 space-y-4">
        <button onClick={handleRestore} disabled={restoring} className="flex items-center gap-2 rounded-lg bg-amber-500 px-4 py-2 text-xs font-semibold text-slate-950 hover:bg-amber-400 disabled:opacity-50">
          <RotateCcw size={14} />
          <span>{restoring ? "Restoring Workspace..." : "Initiate Snapshot Restore"}</span>
        </button>
      </div>
    </div>
  );
}
