import type { BusinessUnit } from '../types/businessUnit'

export const dummyBusinessUnits: BusinessUnit[] = [
  { id: 'bu1', name: 'Acme Engineering', code: 'BU001', companyId: 'c1', companyName: 'Acme Corp', head: 'Rahul Mehta', parentBusinessUnit: null, description: 'Product engineering and platform division', status: 'Active', createdAt: '2026-07-05' },
  { id: 'bu2', name: 'Acme Sales & Marketing', code: 'BU002', companyId: 'c1', companyName: 'Acme Corp', head: 'Divya Menon', parentBusinessUnit: null, description: 'Sales, marketing, and customer success', status: 'Active', createdAt: '2026-07-08' },
  { id: 'bu3', name: 'TechNova Cloud Services', code: 'BU003', companyId: 'c2', companyName: 'TechNova', head: 'David Lee', parentBusinessUnit: null, description: 'Cloud infrastructure and hosting services', status: 'Active', createdAt: '2026-06-18' },
  { id: 'bu4', name: 'Fusion Diagnostics', code: 'BU004', companyId: 'c3', companyName: 'Fusion Health', head: 'Ananya Sharma', parentBusinessUnit: null, description: 'Diagnostic services division', status: 'Inactive', createdAt: '2026-05-25' },
]
