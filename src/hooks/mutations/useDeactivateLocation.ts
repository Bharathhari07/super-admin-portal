import { useMutation, useQueryClient } from '@tanstack/react-query'
import { deactivateLocation } from '../../api/locationApi'

export function useDeactivateLocation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: deactivateLocation,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['locations'] }),
  })
}
