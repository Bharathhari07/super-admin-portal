import { useMutation, useQueryClient } from '@tanstack/react-query'
import { activateDepartment } from '../../api/departmentApi'

export function useActivateDepartment() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: activateDepartment,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['departments'] }),
  })
}
