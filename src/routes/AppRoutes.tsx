import { Routes, Route, Navigate } from 'react-router-dom'
import SuperAdminLayout from '../layouts/SuperAdminLayout'
import DashboardPage from '../pages/DashboardPage'
import TenantManagementPage from '../pages/TenantManagementPage'
import CompanySetupPage from '../pages/CompanySetupPage'

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<SuperAdminLayout />}>
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route path="dashboard" element={<DashboardPage />} />
        <Route path="tenants" element={<TenantManagementPage />} />
        <Route path="organizations/companies" element={<CompanySetupPage />} />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Route>
    </Routes>
  )
}