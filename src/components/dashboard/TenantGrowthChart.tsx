import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { useDashboardAnalytics } from '../../hooks/queries/useDashboardAnalytics'
import Spinner from '../common/Spinner'

export default function TenantGrowthChart() {
  const { data, isLoading, isError } = useDashboardAnalytics()

  return (
    <div className="rounded-xl border border-sap-border bg-sap-surface p-5 shadow-sm">
      <h3 className="mb-4 text-sm font-semibold text-sap-text">Tenant Growth</h3>
      {isLoading && (
        <div className="flex h-56 items-center justify-center">
          <Spinner />
        </div>
      )}
      {isError && <p className="text-sm text-sap-danger">Couldn&apos;t load tenant growth data.</p>}
      {data && (
        <div className="h-56 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data.tenantGrowth} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e8ef" />
              <XAxis dataKey="month" tick={{ fontSize: 12 }} stroke="#6b7280" />
              <YAxis tick={{ fontSize: 12 }} stroke="#6b7280" />
              <Tooltip />
              <Line type="monotone" dataKey="tenants" stroke="#4f46e5" strokeWidth={2} dot={{ r: 3 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  )
}