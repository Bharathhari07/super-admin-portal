import { useQuery } from '@tanstack/react-query'
import { fetchDashboardAnalytics } from '../../api/dashboardApi'

// Tenant growth / user growth / active-vs-inactive chart data.
export function useDashboardAnalytics() {
  return useQuery({
    queryKey: ['dashboard', 'analytics'],
    queryFn: fetchDashboardAnalytics,
  })
}