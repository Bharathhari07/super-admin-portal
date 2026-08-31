import { useQuery } from '@tanstack/react-query'
import { fetchBusinessUnits } from '../../api/businessUnitApi'
import type { BusinessUnitQueryParams } from '../../types/businessUnit'

export function useBusinessUnits(params: BusinessUnitQueryParams) {
  return useQuery({
    queryKey: ['businessUnits', params],
    queryFn: () => fetchBusinessUnits(params),
    placeholderData: (previousData) => previousData,
  })
}
