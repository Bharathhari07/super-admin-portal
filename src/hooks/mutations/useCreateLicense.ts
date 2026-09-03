import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createLicense } from '../../api/licenseApi'

export function useCreateLicense() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: createLicense,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['licenses'] }),
  })
}
