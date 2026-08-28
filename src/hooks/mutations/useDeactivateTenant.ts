import { useMutation, useQueryClient } from '@tanstack/react-query'
import { deactivateTenant } from '../../api/tenantApi'

export function useDeactivateTenant() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: deactivateTenant,
    onSuccess: (updatedTenant) => {
      queryClient.invalidateQueries({ queryKey: ['tenants'] })
      queryClient.invalidateQueries({ queryKey: ['tenant', updatedTenant.id] })
      queryClient.invalidateQueries({ queryKey: ['dashboard'] })
    },
  })
}