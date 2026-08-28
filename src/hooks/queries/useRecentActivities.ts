import { useQuery } from '@tanstack/react-query'
import { fetchRecentActivities } from '../../api/dashboardApi'

// Recent Activities feed on the dashboard.
export function useRecentActivities() {
  return useQuery({
    queryKey: ['dashboard', 'activities'],
    queryFn: fetchRecentActivities,
  })
}