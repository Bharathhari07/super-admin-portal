import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createBranch } from '../../api/branchApi'

export function useCreateBranch() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: createBranch,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['branches'] }),
  })
}
