import { useMutation, useQueryClient } from '@tanstack/react-query'
import { deactivateCompany } from '../../api/companyApi'

export function useDeactivateCompany() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: deactivateCompany,
    onSuccess: (updated) => {
      queryClient.invalidateQueries({ queryKey: ['companies'] })
      queryClient.invalidateQueries({ queryKey: ['company', updated.id] })
    },
  })
}
