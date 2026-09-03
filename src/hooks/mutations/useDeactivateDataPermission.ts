import { useMutation, useQueryClient } from '@tanstack/react-query'
import { deactivateDataPermission } from '../../api/dataPermissionApi'

export function useDeactivateDataPermission() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: deactivateDataPermission,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['dataPermissions'] }),
  })
}
