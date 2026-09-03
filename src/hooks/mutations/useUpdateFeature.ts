import { useMutation, useQueryClient } from '@tanstack/react-query'
import { updateFeature } from '../../api/featureApi'
import type { UpdateFeatureInput } from '../../types/feature'

export function useUpdateFeature() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: UpdateFeatureInput }) => updateFeature(id, input),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['features'] }),
  })
}
