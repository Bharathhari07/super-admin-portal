import { dummyAuditLogs } from '../data/dummyAuditLogs'
import type { AuditLog, AuditLogQueryParams, AuditLogListResponse } from '../types/auditLog'

export const auditLogStore: AuditLog[] = [...dummyAuditLogs]

export async function fetchAuditLogs(params: AuditLogQueryParams): Promise<AuditLogListResponse> {
  let filtered = [...auditLogStore]
  if (params.action && params.action !== 'All') filtered = filtered.filter((l) => l.action === params.action)
  if (params.module && params.module !== 'All') filtered = filtered.filter((l) => l.module === params.module)
  if (params.status && params.status !== 'All') filtered = filtered.filter((l) => l.status === params.status)
  if (params.search && params.search.trim()) {
    const q = params.search.toLowerCase().trim()
    filtered = filtered.filter((l) =>
      l.description.toLowerCase().includes(q) ||
      l.actorName.toLowerCase().includes(q) ||
      l.actorEmail.toLowerCase().includes(q)
    )
  }

  const sortBy = params.sortBy ?? 'timestamp'
  const sortDir = params.sortDir ?? 'desc'
  filtered.sort((a, b) => {
    const diff = sortBy === 'actorName'
      ? a.actorName.localeCompare(b.actorName)
      : new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
    return sortDir === 'asc' ? diff : -diff
  })

  const page = params.page ?? 1
  const pageSize = params.pageSize ?? 8
  const start = (page - 1) * pageSize

  return {
    data: filtered.slice(start, start + pageSize),
    total: filtered.length,
    page,
    pageSize,
  }
}

export async function exportAuditLogs(_params: AuditLogQueryParams): Promise<string> {
  const headers = 'ID,Timestamp,Actor,Email,Role,Action,Module,Status,IP,Description\n'
  const rows = auditLogStore.map((l) =>
    `"${l.id}","${l.timestamp}","${l.actorName}","${l.actorEmail}","${l.actorRole}","${l.action}","${l.module}","${l.status}","${l.ipAddress}","${l.description}"`
  ).join('\n')
  return headers + rows
}
