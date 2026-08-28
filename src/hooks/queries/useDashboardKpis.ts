import { useQuery } from '@tanstack/react-query'
import { fetchDashboardKpis } from '../../api/dashboardApi'

// KPI cards (Total Tenants / Active Tenants / Inactive Tenants / Total Users / Active Licenses)
export function useDashboardKpis() {
  return useQuery({
    queryKey: ['dashboard', 'kpis'],
    queryFn: fetchDashboardKpis,
  })
}