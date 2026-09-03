import { useQuery } from '@tanstack/react-query'
import { fetchPermissions } from '../../api/permissionApi'
import type { PermissionQueryParams } from '../../types/permission'

export function usePermissions(params: PermissionQueryParams) {
  return useQuery({
    queryKey: ['permissions', params],
    queryFn: () => fetchPermissions(params),
    placeholderData: (previousData) => previousData,
  })
}
