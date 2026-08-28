import { Building2, CheckCircle2, XCircle, Users, KeyRound } from 'lucide-react'
import KpiCard from './KpiCard'
import Spinner from '../common/Spinner'
import { useDashboardKpis } from '../../hooks/queries/useDashboardKpis'

export default function KpiCardGrid() {
  const { data, isLoading, isError } = useDashboardKpis()

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
        Couldn&apos;t load KPI stats.
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
      <KpiCard label="Total Tenants" value={data.totalTenants} icon={Building2} tone="primary" />
      <KpiCard label="Active Tenants" value={data.activeTenants} icon={CheckCircle2} tone="success" />
      <KpiCard label="Inactive Tenants" value={data.inactiveTenants} icon={XCircle} tone="danger" />
      <KpiCard label="Total Users" value={data.totalUsers.toLocaleString()} icon={Users} tone="info" />
      <KpiCard label="Active Licenses" value={data.activeLicenses} icon={KeyRound} tone="primary" />
    </div>
  )
}