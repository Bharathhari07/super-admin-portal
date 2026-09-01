import { useQuery } from '@tanstack/react-query'
import { fetchCostCenters } from '../../api/costCenterApi'
import type { CostCenterQueryParams } from '../../types/costCenter'

export function useCostCenters(params: CostCenterQueryParams) {
  return useQuery({
    queryKey: ['costCenters', params],
    queryFn: () => fetchCostCenters(params),
    placeholderData: (previousData) => previousData,
  })
}
