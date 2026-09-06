import { useQuery } from '@tanstack/react-query'
import { fetchAuditLogs } from '../../api/auditLogApi'
import type { AuditLogQueryParams, AuditLogListResponse } from '../../types/auditLog'

export function useAuditLogs(params: AuditLogQueryParams) {
  return useQuery<AuditLogListResponse>({
    queryKey: ['auditLogs', params],
    queryFn: () => fetchAuditLogs(params),
  })
}
