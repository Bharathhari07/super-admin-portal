import { useMutation, useQueryClient } from '@tanstack/react-query'
import { markInvoicePaid } from '../../api/tenantUsageApi'

export function useMarkInvoicePaid() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: markInvoicePaid,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['tenantUsage'] }),
  })
}
