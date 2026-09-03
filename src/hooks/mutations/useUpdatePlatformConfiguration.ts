import { useMutation, useQueryClient } from '@tanstack/react-query'
import { updatePlatformConfiguration } from '../../api/platformConfigApi'

export function useUpdatePlatformConfiguration() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: updatePlatformConfiguration,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['platformConfiguration'] }),
  })
}
