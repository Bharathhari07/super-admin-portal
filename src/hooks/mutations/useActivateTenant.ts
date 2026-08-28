import { useMutation, useQueryClient } from '@tanstack/react-query'
import { activateTenant } from '../../api/tenantApi'

export function useActivateTenant() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: activateTenant,
    onSuccess: (updatedTenant) => {
      queryClient.invalidateQueries({ queryKey: ['tenants'] })
      queryClient.invalidateQueries({ queryKey: ['tenant', updatedTenant.id] })
      queryClient.invalidateQueries({ queryKey: ['dashboard'] })
    },
  })
}