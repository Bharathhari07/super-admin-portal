import { useMutation, useQueryClient } from '@tanstack/react-query'
import { deactivatePermission } from '../../api/permissionApi'

export function useDeactivatePermission() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: deactivatePermission,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['permissions'] }),
  })
}
