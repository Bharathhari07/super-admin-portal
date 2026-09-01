import { useMutation, useQueryClient } from '@tanstack/react-query'
import { updateCostCenter } from '../../api/costCenterApi'
import type { UpdateCostCenterInput } from '../../types/costCenter'

export function useUpdateCostCenter() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: UpdateCostCenterInput }) => updateCostCenter(id, input),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['costCenters'] }),
  })
}
