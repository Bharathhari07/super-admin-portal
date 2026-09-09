import { useMutation, useQueryClient } from '@tanstack/react-query'
import { finalizeProvisioningBatch } from '../../api/provisioningBatchApi'

export function useFinalizeProvisioningBatch() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: finalizeProvisioningBatch,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['provisioningBatches'] }),
  })
}
