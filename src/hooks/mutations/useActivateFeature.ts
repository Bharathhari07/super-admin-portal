import { useMutation, useQueryClient } from '@tanstack/react-query'
import { activateFeature } from '../../api/featureApi'

export function useActivateFeature() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: activateFeature,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['features'] }),
  })
}
