import { useMutation, useQueryClient } from '@tanstack/react-query'
import { deactivateBusinessUnit } from '../../api/businessUnitApi'

export function useDeactivateBusinessUnit() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: deactivateBusinessUnit,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['businessUnits'] }),
  })
}
