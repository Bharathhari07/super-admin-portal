import { useMutation, useQueryClient } from '@tanstack/react-query'
import { activateCompany } from '../../api/companyApi'

export function useActivateCompany() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: activateCompany,
    onSuccess: (updated) => {
      queryClient.invalidateQueries({ queryKey: ['companies'] })
      queryClient.invalidateQueries({ queryKey: ['company', updated.id] })
    },
  })
}
