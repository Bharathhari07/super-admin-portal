import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createTenant } from '../../api/tenantApi'

// Creating a tenant affects the tenant list and the dashboard KPI
// counts, so both get invalidated on success rather than trying to
// patch them manually - simpler and safe against edge cases.
export function useCreateTenant() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: createTenant,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tenants'] })
      queryClient.invalidateQueries({ queryKey: ['dashboard'] })
    },
  })
}