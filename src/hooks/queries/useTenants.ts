import { useQuery } from '@tanstack/react-query'
import { fetchTenants } from '../../api/tenantApi'
import type { TenantQueryParams } from '../../types/tenant'

// Fetches the paginated, filtered tenant list.
// The query key includes every param that affects the result, so
// changing search/filter/sort/page automatically triggers a refetch
// (or serves from cache if that exact combination was seen before).
export function useTenants(params: TenantQueryParams) {
  return useQuery({
    queryKey: ['tenants', params],
    queryFn: () => fetchTenants(params),
    placeholderData: (previousData) => previousData, // keep old page visible while the next one loads
  })
}