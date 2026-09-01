import { useMutation, useQueryClient } from '@tanstack/react-query'
import { updateBranch } from '../../api/branchApi'
import type { UpdateBranchInput } from '../../types/branch'

export function useUpdateBranch() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: UpdateBranchInput }) => updateBranch(id, input),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['branches'] }),
  })
}
