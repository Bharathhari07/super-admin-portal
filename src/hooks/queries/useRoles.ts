import { useQuery } from '@tanstack/react-query'
import { fetchRoles } from '../../api/roleApi'
import type { RoleQueryParams } from '../../types/role'

export function useRoles(params: RoleQueryParams) {
  return useQuery({
    queryKey: ['roles', params],
    queryFn: () => fetchRoles(params),
    placeholderData: (previousData) => previousData,
  })
}
