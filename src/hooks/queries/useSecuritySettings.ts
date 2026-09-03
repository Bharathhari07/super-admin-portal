import { useQuery } from '@tanstack/react-query'
import { fetchSecuritySettings } from '../../api/securitySettingsApi'

export function useSecuritySettings() {
  return useQuery({
    queryKey: ['securitySettings'],
    queryFn: fetchSecuritySettings,
  })
}
