import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createLocation } from '../../api/locationApi'

export function useCreateLocation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: createLocation,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['locations'] }),
  })
}
