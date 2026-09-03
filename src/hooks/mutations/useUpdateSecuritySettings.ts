import { useMutation, useQueryClient } from '@tanstack/react-query'
import { updateSecuritySettings } from '../../api/securitySettingsApi'

export function useUpdateSecuritySettings() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: updateSecuritySettings,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['securitySettings'] }),
  })
}
