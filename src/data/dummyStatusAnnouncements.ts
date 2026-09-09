import type { StatusAnnouncement } from '../types/statusAnnouncement'

export const dummyStatusAnnouncements: StatusAnnouncement[] = [
  { id: 'ann1', title: 'Scheduled Maintenance: Database Upgrades', message: 'The platform database cluster will undergo scheduled maintenance from 02:00-04:00 UTC. Brief connectivity interruptions may occur.', severity: 'Warning', audienceScope: 'All Tenants', tenantId: null, tenantName: null, status: 'Active', publishedAt: '2026-08-24T18:00:00Z' },
  { id: 'ann2', title: 'API Rate Limit Increase Rolled Out', message: 'Enterprise tier tenants now have doubled API rate limits effective immediately.', severity: 'Info', audienceScope: 'All Tenants', tenantId: null, tenantName: null, status: 'Active', publishedAt: '2026-08-20T09:30:00Z' },
  { id: 'ann3', title: 'Elevated Error Rates - Quantum Labs Workspace', message: 'We are investigating elevated error rates affecting the Quantum Labs workspace. Engineering is engaged.', severity: 'Critical', audienceScope: 'Specific Tenant', tenantId: 't7', tenantName: 'Quantum Labs', status: 'Expired', publishedAt: '2026-08-10T07:45:00Z' },
  { id: 'ann4', title: 'New SSO Provider Support', message: 'Okta and OneLogin SSO integrations are now available for all tenant workspaces under Platform Settings.', severity: 'Info', audienceScope: 'All Tenants', tenantId: null, tenantName: null, status: 'Expired', publishedAt: '2026-08-01T12:00:00Z' },
]
