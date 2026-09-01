import { useQuery } from '@tanstack/react-query'
import { fetchUsers } from '../../api/userApi'
import type { UserQueryParams } from '../../types/user'

export function useUsers(params: UserQueryParams) {
  return useQuery({
    queryKey: ['users', params],
    queryFn: () => fetchUsers(params),
    placeholderData: (previousData) => previousData,
  })
}
