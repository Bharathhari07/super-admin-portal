import { useQuery } from '@tanstack/react-query'
import { fetchRecoverySnapshots } from '../../api/recoverySnapshotApi'
import type { RecoverySnapshotQueryParams } from '../../types/recoverySnapshot'

export function useRecoverySnapshots(params: RecoverySnapshotQueryParams) {
  return useQuery({
    queryKey: ['recoverySnapshots', params],
    queryFn: () => fetchRecoverySnapshots(params),
    placeholderData: (previousData) => previousData,
  })
}
