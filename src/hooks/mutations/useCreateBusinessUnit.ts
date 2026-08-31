import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createBusinessUnit } from '../../api/businessUnitApi'

export function useCreateBusinessUnit() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: createBusinessUnit,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['businessUnits'] }),
  })
}
