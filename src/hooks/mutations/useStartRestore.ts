import { useMutation, useQueryClient } from '@tanstack/react-query'
import { startRestore } from '../../api/recoverySnapshotApi'

export function useStartRestore() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: startRestore,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['recoverySnapshots'] }),
  })
}
