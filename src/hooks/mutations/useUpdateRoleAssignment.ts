import { useMutation, useQueryClient } from '@tanstack/react-query'
import { updateRoleAssignment } from '../../api/roleAssignmentApi'
import type { UpdateRoleAssignmentInput } from '../../types/roleAssignment'

export function useUpdateRoleAssignment() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: UpdateRoleAssignmentInput }) => updateRoleAssignment(id, input),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['roleAssignments'] }),
  })
}
