import { useMutation, useQueryClient } from '@tanstack/react-query'
import { updateRole } from '../../api/roleApi'
import type { UpdateRoleInput } from '../../types/role'

export function useUpdateRole() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: UpdateRoleInput }) => updateRole(id, input),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['roles'] }),
  })
}
