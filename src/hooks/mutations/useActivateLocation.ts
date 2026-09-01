import { useMutation, useQueryClient } from '@tanstack/react-query'
import { activateLocation } from '../../api/locationApi'

export function useActivateLocation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: activateLocation,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['locations'] }),
  })
}
