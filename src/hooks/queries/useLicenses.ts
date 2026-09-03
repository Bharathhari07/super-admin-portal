import { useQuery } from '@tanstack/react-query'
import { fetchLicenses } from '../../api/licenseApi'
import type { LicenseQueryParams } from '../../types/license'

export function useLicenses(params: LicenseQueryParams) {
  return useQuery({
    queryKey: ['licenses', params],
    queryFn: () => fetchLicenses(params),
    placeholderData: (previousData) => previousData,
  })
}
