import { useQuery } from '@tanstack/react-query'
import { fetchCompanies } from '../../api/companyApi'
import type { CompanyQueryParams } from '../../types/company'

export function useCompanies(params: CompanyQueryParams) {
  return useQuery({
    queryKey: ['companies', params],
    queryFn: () => fetchCompanies(params),
    placeholderData: (previousData) => previousData,
  })
}
