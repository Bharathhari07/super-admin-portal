import { useQuery } from '@tanstack/react-query'
import { fetchPlatformHealth } from '../../api/dashboardApi'

// Platform health block - refetches periodically since this is the
// kind of data that's meant to look "live" on a dashboard.
export function usePlatformHealth() {
  return useQuery({
    queryKey: ['dashboard', 'health'],
    queryFn: fetchPlatformHealth,
    refetchInterval: 30_000,
  })
}