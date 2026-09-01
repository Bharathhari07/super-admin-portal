import { useMutation, useQueryClient } from '@tanstack/react-query'
import { activateCostCenter } from '../../api/costCenterApi'

export function useActivateCostCenter() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: activateCostCenter,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['costCenters'] }),
  })
}
