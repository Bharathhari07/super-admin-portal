import { useQuery } from '@tanstack/react-query'
import { fetchProvisioningBatches } from '../../api/provisioningBatchApi'
import type { ProvisioningBatchQueryParams } from '../../types/provisioningBatch'

export function useProvisioningBatches(params: ProvisioningBatchQueryParams) {
  return useQuery({
    queryKey: ['provisioningBatches', params],
    queryFn: () => fetchProvisioningBatches(params),
    placeholderData: (previousData) => previousData,
  })
}
