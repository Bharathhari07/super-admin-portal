import { useMutation, useQueryClient } from '@tanstack/react-query'
import { updatePermission } from '../../api/permissionApi'
import type { UpdatePermissionInput } from '../../types/permission'

export function useUpdatePermission() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: UpdatePermissionInput }) => updatePermission(id, input),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['permissions'] }),
  })
}
