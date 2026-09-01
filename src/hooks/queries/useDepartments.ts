import { useQuery } from '@tanstack/react-query'
import { fetchDepartments } from '../../api/departmentApi'
import type { DepartmentQueryParams } from '../../types/department'

export function useDepartments(params: DepartmentQueryParams) {
  return useQuery({
    queryKey: ['departments', params],
    queryFn: () => fetchDepartments(params),
    placeholderData: (previousData) => previousData,
  })
}
