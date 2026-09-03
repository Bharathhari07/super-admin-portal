import { useMutation, useQueryClient } from '@tanstack/react-query'
import { activatePermission } from '../../api/permissionApi'

export function useActivatePermission() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: activatePermission,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['permissions'] }),
  })
}
