import type { LucideIcon } from 'lucide-react'

interface KpiCardProps {
  label: string
  value: string | number
  icon: LucideIcon
  tone?: 'primary' | 'success' | 'danger' | 'info'
}

const toneClasses = {
  primary: 'bg-sap-primary/10 text-sap-primary',
  success: 'bg-sap-success-bg text-sap-success',
  danger: 'bg-sap-danger-bg text-sap-danger',
  info: 'bg-sap-info-bg text-sap-info',
}

export default function KpiCard({ label, value, icon: Icon, tone = 'primary' }: KpiCardProps) {
  return (
    <div className="flex items-center gap-4 rounded-xl border border-sap-border bg-sap-surface p-4 shadow-sm">
      <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-lg ${toneClasses[tone]}`}>
        <Icon size={20} />
      </div>
      <div className="min-w-0">
        <p className="truncate text-sm text-sap-text-muted">{label}</p>
        <p className="text-xl font-semibold text-sap-text">{value}</p>
      </div>
    </div>
  )
}