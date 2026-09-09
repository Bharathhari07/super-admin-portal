import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createSnapshot } from '../../api/recoverySnapshotApi'

export function useCreateSnapshot() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: createSnapshot,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['recoverySnapshots'] }),
  })
}
