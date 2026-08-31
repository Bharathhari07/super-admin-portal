import { useQuery } from '@tanstack/react-query'
import { fetchCompanyById } from '../../api/companyApi'

export function useCompany(id: string | null) {
  return useQuery({
    queryKey: ['company', id],
    queryFn: () => fetchCompanyById(id as string),
    enabled: id !== null,
  })
}
