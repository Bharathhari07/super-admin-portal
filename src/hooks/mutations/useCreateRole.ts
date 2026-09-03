import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createRole } from '../../api/roleApi'

export function useCreateRole() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: createRole,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['roles'] }),
  })
}
