import { useMutation, useQueryClient } from '@tanstack/react-query'
import { deactivateRole } from '../../api/roleApi'

export function useDeactivateRole() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: deactivateRole,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['roles'] }),
  })
}
