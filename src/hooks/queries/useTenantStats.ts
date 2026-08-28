import { useQuery } from '@tanstack/react-query'
import { fetchTenantStats } from '../../api/tenantApi'

// Fetches the stats block (users/orgs/active users/storage) shown
// alongside a tenant's details.
export function useTenantStats(id: string | null) {
  return useQuery({
    queryKey: ['tenantStats', id],
    queryFn: () => fetchTenantStats(id as string),
    enabled: id !== null,
  })
}