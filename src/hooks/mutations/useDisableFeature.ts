import { useMutation, useQueryClient } from '@tanstack/react-query'
import { disableFeature } from '../../api/featureApi'

export function useDisableFeature() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: disableFeature,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['features'] }),
  })
}
