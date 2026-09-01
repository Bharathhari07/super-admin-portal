import { useMutation, useQueryClient } from '@tanstack/react-query'
import { deactivateBranch } from '../../api/branchApi'

export function useDeactivateBranch() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: deactivateBranch,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['branches'] }),
  })
}
