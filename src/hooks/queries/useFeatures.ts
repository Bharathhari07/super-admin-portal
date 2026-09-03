import { useQuery } from '@tanstack/react-query'
import { fetchFeatures } from '../../api/featureApi'
import type { FeatureQueryParams } from '../../types/feature'

export function useFeatures(params: FeatureQueryParams) {
  return useQuery({
    queryKey: ['features', params],
    queryFn: () => fetchFeatures(params),
    placeholderData: (previousData) => previousData,
  })
}
