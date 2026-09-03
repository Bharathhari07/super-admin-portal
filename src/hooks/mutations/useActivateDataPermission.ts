import { useMutation, useQueryClient } from '@tanstack/react-query'
import { activateDataPermission } from '../../api/dataPermissionApi'

export function useActivateDataPermission() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: activateDataPermission,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['dataPermissions'] }),
  })
}
