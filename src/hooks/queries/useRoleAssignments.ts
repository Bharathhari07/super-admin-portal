import { useQuery } from '@tanstack/react-query'
import { fetchRoleAssignments } from '../../api/roleAssignmentApi'
import type { RoleAssignmentQueryParams } from '../../types/roleAssignment'

export function useRoleAssignments(params: RoleAssignmentQueryParams) {
  return useQuery({
    queryKey: ['roleAssignments', params],
    queryFn: () => fetchRoleAssignments(params),
    placeholderData: (previousData) => previousData,
  })
}
