import { useMutation, useQueryClient } from '@tanstack/react-query'
import { updateDataPermission } from '../../api/dataPermissionApi'
import type { UpdateDataPermissionInput } from '../../types/dataPermission'

export function useUpdateDataPermission() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: UpdateDataPermissionInput }) => updateDataPermission(id, input),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['dataPermissions'] }),
  })
}
