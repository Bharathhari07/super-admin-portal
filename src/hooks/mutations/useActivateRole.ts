import { useMutation, useQueryClient } from '@tanstack/react-query'
import { activateRole } from '../../api/roleApi'

export function useActivateRole() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: activateRole,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['roles'] }),
  })
}
