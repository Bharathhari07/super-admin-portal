import type { BusinessUnit } from '../types/businessUnit'

export const dummyBusinessUnits: BusinessUnit[] = [
  { id: 'bu1', name: 'Acme Engineering', code: 'BU001', companyId: 'c1', companyName: 'Acme Corp', head: 'Rahul Mehta', parentBusinessUnit: null, description: 'Product engineering and platform division', status: 'Active', createdAt: '2026-07-05' },
  { id: 'bu2', name: 'TechNova Cloud Services', code: 'BU002', companyId: 'c2', companyName: 'TechNova', head: 'David Lee', parentBusinessUnit: null, description: 'Cloud infrastructure and hosting services', status: 'Active', createdAt: '2026-06-18' },
  { id: 'bu3', name: 'Fusion Diagnostics', code: 'BU003', companyId: 'c3', companyName: 'Fusion Health', head: 'Ananya Sharma', parentBusinessUnit: null, description: 'Diagnostic services division', status: 'Inactive', createdAt: '2026-05-25' },
  { id: 'bu4', name: 'Bright Product Division', code: 'BU004', companyId: 'c4', companyName: 'Bright Systems', head: 'Priya Nair', parentBusinessUnit: null, description: 'Consumer product design and development', status: 'Active', createdAt: '2026-07-25' },
  { id: 'bu5', name: 'Nimbus Infrastructure', code: 'BU005', companyId: 'c5', companyName: 'Nimbus Cloud', head: 'Arjun Reddy', parentBusinessUnit: null, description: 'Network and datacenter operations', status: 'Active', createdAt: '2026-07-18' },
  { id: 'bu6', name: 'Vertex Merchandising', code: 'BU006', companyId: 'c6', companyName: 'Vertex Retail', head: 'Meera Iyer', parentBusinessUnit: null, description: 'Retail merchandising and planning', status: 'Inactive', createdAt: '2026-07-02' },
  { id: 'bu7', name: 'Quantum Research', code: 'BU007', companyId: 'c7', companyName: 'Quantum Labs', head: 'Karthik Rao', parentBusinessUnit: null, description: 'Applied research and prototyping', status: 'Active', createdAt: '2026-06-21' },
  { id: 'bu8', name: 'Orbit Wealth Management', code: 'BU008', companyId: 'c8', companyName: 'Orbit Finance', head: 'Divya Menon', parentBusinessUnit: null, description: 'Investment and advisory services', status: 'Active', createdAt: '2026-06-05' },
  { id: 'bu9', name: 'Skyline Freight Operations', code: 'BU009', companyId: 'c9', companyName: 'Skyline Logistics', head: 'Rohan Gupta', parentBusinessUnit: null, description: 'Freight scheduling and fleet management', status: 'Inactive', createdAt: '2026-05-30' },
  { id: 'bu10', name: 'Pinnacle Broadcasting', code: 'BU010', companyId: 'c10', companyName: 'Pinnacle Media', head: 'Vikram Singh', parentBusinessUnit: null, description: 'Content production and broadcasting', status: 'Active', createdAt: '2026-05-06' },
  { id: 'bu11', name: 'Cedar Data Science', code: 'BU011', companyId: 'c11', companyName: 'Cedar Analytics', head: 'Neha Kapoor', parentBusinessUnit: null, description: 'Data engineering and analytics platform', status: 'Inactive', createdAt: '2026-04-24' },
  { id: 'bu12', name: 'Alpha Manufacturing Division', code: 'BU012', companyId: 'c12', companyName: 'Alpha Ltd', head: 'Sarah Khan', parentBusinessUnit: null, description: 'Production and quality operations', status: 'Inactive', createdAt: '2026-08-12' },
]
