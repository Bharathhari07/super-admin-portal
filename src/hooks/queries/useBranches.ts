import { useQuery } from '@tanstack/react-query'
import { fetchBranches } from '../../api/branchApi'
import type { BranchQueryParams } from '../../types/branch'

export function useBranches(params: BranchQueryParams) {
  return useQuery({
    queryKey: ['branches', params],
    queryFn: () => fetchBranches(params),
    placeholderData: (previousData) => previousData,
  })
}
