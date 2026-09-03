import { useMutation, useQueryClient } from '@tanstack/react-query'
import { deactivateRoleAssignment } from '../../api/roleAssignmentApi'

export function useDeactivateRoleAssignment() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: deactivateRoleAssignment,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['roleAssignments'] }),
  })
}
