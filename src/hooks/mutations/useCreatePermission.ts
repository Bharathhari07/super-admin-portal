import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createPermission } from '../../api/permissionApi'

export function useCreatePermission() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: createPermission,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['permissions'] }),
  })
}
