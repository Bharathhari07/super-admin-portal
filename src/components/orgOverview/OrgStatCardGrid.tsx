import { Building, Boxes, Network, MapPin, Wallet, Globe, CheckCircle2 } from 'lucide-react'
import Spinner from '../common/Spinner'
import { useOrgOverview } from '../../hooks/queries/useOrgOverview'

const toneClasses = {
  primary: 'bg-sap-primary/10 text-sap-primary',
  success: 'bg-sap-success-bg text-sap-success',
  info: 'bg-sap-info-bg text-sap-info',
}

interface StatCardProps {
  label: string
  value: number
  icon: typeof Building
  tone: keyof typeof toneClasses
}

function StatCard({ label, value, icon: Icon, tone }: StatCardProps) {
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

export default function OrgStatCardGrid() {
  const { data, isLoading, isError } = useOrgOverview()

  if (isLoading) {
    return (
      <div className="flex justify-center rounded-xl border border-sap-border bg-sap-surface py-10">
        <Spinner />
      </div>
    )
  }

  if (isError || !data) {
    return (
      <div className="rounded-xl border border-sap-border bg-sap-surface p-4 text-sm text-sap-danger">
        Couldn&apos;t load organization overview.
      </div>
    )
  }

  const { stats } = data

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
      <StatCard label="Companies" value={stats.totalCompanies} icon={Building} tone="primary" />
      <StatCard label="Active Companies" value={stats.activeCompanies} icon={CheckCircle2} tone="success" />
      <StatCard label="Business Units" value={stats.totalBusinessUnits} icon={Boxes} tone="info" />
      <StatCard label="Departments" value={stats.totalDepartments} icon={Network} tone="info" />
      <StatCard label="Branches" value={stats.totalBranches} icon={MapPin} tone="info" />
      <StatCard label="Cost Centers" value={stats.totalCostCenters} icon={Wallet} tone="info" />
    </div>
  )
}
