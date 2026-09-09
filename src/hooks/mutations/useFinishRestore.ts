import { useMutation, useQueryClient } from '@tanstack/react-query'
import { finishRestore } from '../../api/recoverySnapshotApi'

export function useFinishRestore() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: finishRestore,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['recoverySnapshots'] }),
  })
}
