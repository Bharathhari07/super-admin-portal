import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createRoleAssignment } from '../../api/roleAssignmentApi'

export function useCreateRoleAssignment() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: createRoleAssignment,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['roleAssignments'] }),
  })
}
