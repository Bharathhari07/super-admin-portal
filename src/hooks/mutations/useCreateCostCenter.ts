import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createCostCenter } from '../../api/costCenterApi'

export function useCreateCostCenter() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: createCostCenter,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['costCenters'] }),
  })
}
