import { useQuery } from '@tanstack/react-query'
import { fetchPlatformConfiguration } from '../../api/platformConfigApi'

export function usePlatformConfiguration() {
  return useQuery({
    queryKey: ['platformConfiguration'],
    queryFn: fetchPlatformConfiguration,
  })
}
