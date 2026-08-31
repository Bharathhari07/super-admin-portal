import { useMutation, useQueryClient } from '@tanstack/react-query'
import { activateBusinessUnit } from '../../api/businessUnitApi'

export function useActivateBusinessUnit() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: activateBusinessUnit,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['businessUnits'] }),
  })
}
