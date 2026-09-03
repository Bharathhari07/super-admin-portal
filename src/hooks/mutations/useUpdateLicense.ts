import { useMutation, useQueryClient } from '@tanstack/react-query'
import { updateLicense } from '../../api/licenseApi'
import type { UpdateLicenseInput } from '../../types/license'

export function useUpdateLicense() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: UpdateLicenseInput }) => updateLicense(id, input),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['licenses'] }),
  })
}
