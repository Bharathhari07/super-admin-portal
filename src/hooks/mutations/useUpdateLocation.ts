import { useMutation, useQueryClient } from '@tanstack/react-query'
import { updateLocation } from '../../api/locationApi'
import type { UpdateLocationInput } from '../../types/location'

export function useUpdateLocation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: UpdateLocationInput }) => updateLocation(id, input),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['locations'] }),
  })
}
