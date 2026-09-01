import { useMutation, useQueryClient } from '@tanstack/react-query'
import { updateDepartment } from '../../api/departmentApi'
import type { UpdateDepartmentInput } from '../../types/department'

export function useUpdateDepartment() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: UpdateDepartmentInput }) => updateDepartment(id, input),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['departments'] }),
  })
}
