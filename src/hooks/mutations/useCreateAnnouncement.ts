import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createAnnouncement } from '../../api/statusAnnouncementApi'

export function useCreateAnnouncement() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: createAnnouncement,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['statusAnnouncements'] }),
  })
}
