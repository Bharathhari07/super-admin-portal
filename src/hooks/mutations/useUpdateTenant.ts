import { useMutation, useQueryClient } from '@tanstack/react-query'
import { updateTenant } from '../../api/tenantApi'
import type { UpdateTenantInput } from '../../types/tenant'

export function useUpdateTenant() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: UpdateTenantInput }) => updateTenant(id, input),
    onSuccess: (updatedTenant) => {
      queryClient.invalidateQueries({ queryKey: ['tenants'] })
      queryClient.invalidateQueries({ queryKey: ['tenant', updatedTenant.id] })
    },
  })
}