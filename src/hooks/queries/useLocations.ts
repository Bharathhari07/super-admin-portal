import { useQuery } from '@tanstack/react-query'
import { fetchLocations } from '../../api/locationApi'
import type { LocationQueryParams } from '../../types/location'

export function useLocations(params: LocationQueryParams) {
  return useQuery({
    queryKey: ['locations', params],
    queryFn: () => fetchLocations(params),
    placeholderData: (previousData) => previousData,
  })
}
