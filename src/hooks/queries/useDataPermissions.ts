import { useQuery } from '@tanstack/react-query'
import { fetchDataPermissions } from '../../api/dataPermissionApi'
import type { DataPermissionQueryParams } from '../../types/dataPermission'

export function useDataPermissions(params: DataPermissionQueryParams) {
  return useQuery({
    queryKey: ['dataPermissions', params],
    queryFn: () => fetchDataPermissions(params),
    placeholderData: (previousData) => previousData,
  })
}
