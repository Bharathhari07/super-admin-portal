import { useMutation, useQueryClient } from '@tanstack/react-query'
import { activateLicense } from '../../api/licenseApi'

export function useActivateLicense() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: activateLicense,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['licenses'] }),
  })
}
