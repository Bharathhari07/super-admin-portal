import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toggleUserLock } from '../../api/userApi'

export function useToggleUserLock() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: toggleUserLock,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['users'] }),
  })
}
