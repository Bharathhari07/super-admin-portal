import { useMutation, useQueryClient } from '@tanstack/react-query'
import { updateBusinessUnit } from '../../api/businessUnitApi'
import type { UpdateBusinessUnitInput } from '../../types/businessUnit'

export function useUpdateBusinessUnit() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: UpdateBusinessUnitInput }) => updateBusinessUnit(id, input),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['businessUnits'] }),
  })
}
