import { useMutation, useQueryClient } from '@tanstack/react-query'
import { deactivateCostCenter } from '../../api/costCenterApi'

export function useDeactivateCostCenter() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: deactivateCostCenter,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['costCenters'] }),
  })
}
