import { useMutation, useQueryClient } from '@tanstack/react-query'
import { activateRoleAssignment } from '../../api/roleAssignmentApi'

export function useActivateRoleAssignment() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: activateRoleAssignment,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['roleAssignments'] }),
  })
}
