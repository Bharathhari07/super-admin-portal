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
        <div className="flex h-64 items-center justify-center">
          <Spinner />
        </div>
      )}
      {isError && <p className="text-sm text-sap-danger">Couldn&apos;t load tenant status data.</p>}
      {data && (
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart margin={{ top: 20, right: 20, bottom: 10, left: 20 }}>
              <Pie data={chartData} dataKey="value" nameKey="name" innerRadius={40} outerRadius={60} paddingAngle={3}>
                {chartData.map((_, index) => (
                  <Cell key={index} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                allowEscapeViewBox={{ x: true, y: true }}
                wrapperStyle={{ zIndex: 50 }}
                offset={25}
                contentStyle={{
                  backgroundColor: '#FCE300',
                  border: 'none',
                  borderRadius: 8,
                }}
                labelStyle={{ color: '#2A1655', fontWeight: 600 }}
                itemStyle={{ color: '#2A1655' }}
              />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  )
}