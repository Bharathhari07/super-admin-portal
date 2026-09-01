import { useMutation, useQueryClient } from '@tanstack/react-query'
import { activateBranch } from '../../api/branchApi'

export function useActivateBranch() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: activateBranch,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['branches'] }),
  })
}
