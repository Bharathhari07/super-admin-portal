import { useMutation } from '@tanstack/react-query'
import { resetUserPassword } from '../../api/userApi'

export function useResetUserPassword() {
  return useMutation({
    mutationFn: resetUserPassword,
  })
}
