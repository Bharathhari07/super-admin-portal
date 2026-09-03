import { useMutation, useQueryClient } from '@tanstack/react-query'
import { suspendLicense } from '../../api/licenseApi'

export function useSuspendLicense() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: suspendLicense,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['licenses'] }),
  })
}
