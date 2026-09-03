import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createDataPermission } from '../../api/dataPermissionApi'

export function useCreateDataPermission() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: createDataPermission,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['dataPermissions'] }),
  })
}
