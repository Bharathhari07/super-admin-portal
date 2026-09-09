import { useMutation, useQueryClient } from '@tanstack/react-query'
import { expireAnnouncement } from '../../api/statusAnnouncementApi'

export function useExpireAnnouncement() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: expireAnnouncement,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['statusAnnouncements'] }),
  })
}
