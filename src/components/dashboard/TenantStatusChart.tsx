import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { useDashboardAnalytics } from '../../hooks/queries/useDashboardAnalytics'
import Spinner from '../common/Spinner'

const COLORS = ['#10b981', '#ef4444']

export default function TenantStatusChart() {
  const { data, isLoading, isError } = useDashboardAnalytics()

  const chartData = data
    ? [
        { name: 'Active', value: data.statusBreakdown.active },
        { name: 'Inactive', value: data.statusBreakdown.inactive },
      ]
    : []

  return (
    <div className="rounded-xl border border-sap-border bg-sap-surface p-5 shadow-sm">
      <h3 className="mb-4 text-sm font-semibold text-sap-text">Active vs Inactive Tenants</h3>
      {isLoading && (
        <div className="flex h-56 items-center justify-center">
          <Spinner />
        </div>
      )}
      {isError && <p className="text-sm text-sap-danger">Couldn&apos;t load tenant status data.</p>}
      {data && (
        <div className="h-56 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={chartData} dataKey="value" nameKey="name" innerRadius={45} outerRadius={70} paddingAngle={3}>
                {chartData.map((_, index) => (
                  <Cell key={index} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  )
}