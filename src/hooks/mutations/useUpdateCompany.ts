import { useMutation, useQueryClient } from '@tanstack/react-query'
import { updateCompany } from '../../api/companyApi'
import type { UpdateCompanyInput } from '../../types/company'

export function useUpdateCompany() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: UpdateCompanyInput }) => updateCompany(id, input),
    onSuccess: (updated) => {
      queryClient.invalidateQueries({ queryKey: ['companies'] })
      queryClient.invalidateQueries({ queryKey: ['company', updated.id] })
    },
  })
}
