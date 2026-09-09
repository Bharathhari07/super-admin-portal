import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createProvisioningBatch } from '../../api/provisioningBatchApi'

export function useCreateProvisioningBatch() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: createProvisioningBatch,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['provisioningBatches'] }),
  })
}
