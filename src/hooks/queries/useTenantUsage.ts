import { useQuery } from '@tanstack/react-query'
import { fetchTenantUsage } from '../../api/tenantUsageApi'
import type { TenantUsageQueryParams } from '../../types/tenantUsage'

export function useTenantUsage(params: TenantUsageQueryParams) {
  return useQuery({
    queryKey: ['tenantUsage', params],
    queryFn: () => fetchTenantUsage(params),
    placeholderData: (previousData) => previousData,
  })
}
