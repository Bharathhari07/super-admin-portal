import { useQuery } from '@tanstack/react-query'
import { fetchOrgOverview } from '../../api/orgOverviewApi'

export function useOrgOverview() {
  return useQuery({
    queryKey: ['organizations', 'overview'],
    queryFn: fetchOrgOverview,
  })
}
