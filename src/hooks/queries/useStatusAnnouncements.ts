import { useQuery } from '@tanstack/react-query'
import { fetchStatusAnnouncements } from '../../api/statusAnnouncementApi'
import type { StatusAnnouncementQueryParams } from '../../types/statusAnnouncement'

export function useStatusAnnouncements(params: StatusAnnouncementQueryParams) {
  return useQuery({
    queryKey: ['statusAnnouncements', params],
    queryFn: () => fetchStatusAnnouncements(params),
    placeholderData: (previousData) => previousData,
  })
}
