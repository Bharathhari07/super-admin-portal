import { useMutation, useQueryClient } from '@tanstack/react-query'
import { deactivateDepartment } from '../../api/departmentApi'

export function useDeactivateDepartment() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: deactivateDepartment,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['departments'] }),
  })
}
