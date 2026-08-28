import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { useDashboardAnalytics } from '../../hooks/queries/useDashboardAnalytics'
import Spinner from '../common/Spinner'

export default function UserGrowthChart() {
  const { data, isLoading, isError } = useDashboardAnalytics()

  return (
    <div className="rounded-xl border border-sap-border bg-sap-surface p-5 shadow-sm">
      <h3 className="mb-4 text-sm font-semibold text-sap-text">User Growth</h3>
      {isLoading && (
        <div className="flex h-56 items-center justify-center">
          <Spinner />
        </div>
      )}
      {isError && <p className="text-sm text-sap-danger">Couldn&apos;t load user growth data.</p>}
      {data && (
        <div className="h-56 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data.userGrowth} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="userGrowthFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#0ea5e9" stopOpacity={0.35} />
                  <stop offset="100%" stopColor="#0ea5e9" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e8ef" />
              <XAxis dataKey="month" tick={{ fontSize: 12 }} stroke="#6b7280" />
              <YAxis tick={{ fontSize: 12 }} stroke="#6b7280" />
              <Tooltip />
              <Area type="monotone" dataKey="users" stroke="#0ea5e9" fill="url(#userGrowthFill)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  )
}