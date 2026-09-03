import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createFeature } from '../../api/featureApi'

export function useCreateFeature() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: createFeature,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['features'] }),
  })
}
