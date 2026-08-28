import KpiCardGrid from '../components/dashboard/KpiCardGrid'
import PlatformHealth from '../components/dashboard/PlatformHealth'
import TenantGrowthChart from '../components/dashboard/TenantGrowthChart'
import UserGrowthChart from '../components/dashboard/UserGrowthChart'
import TenantStatusChart from '../components/dashboard/TenantStatusChart'
import RecentActivities from '../components/dashboard/RecentActivities'

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <KpiCardGrid />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <TenantGrowthChart />
        </div>
        <PlatformHealth />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <UserGrowthChart />
        <TenantStatusChart />
      </div>

      <RecentActivities />
    </div>
  )
}