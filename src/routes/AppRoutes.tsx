import { Routes, Route, Navigate } from 'react-router-dom'
import SuperAdminLayout from '../layouts/SuperAdminLayout'
import DashboardPage from '../pages/DashboardPage'
import TenantManagementPage from '../pages/TenantManagementPage'
import OrganizationOverviewPage from '../pages/OrganizationOverviewPage'
import CompanySetupPage from '../pages/CompanySetupPage'
import BusinessUnitsPage from '../pages/BusinessUnitsPage'
import DepartmentsPage from '../pages/DepartmentsPage'
import BranchesPage from '../pages/BranchesPage'
import CostCentersPage from '../pages/CostCentersPage'
import LocationsPage from '../pages/LocationsPage'

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<SuperAdminLayout />}>
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route path="dashboard" element={<DashboardPage />} />
        <Route path="tenants" element={<TenantManagementPage />} />
        <Route path="organizations" element={<OrganizationOverviewPage />} />
        <Route path="organizations/companies" element={<CompanySetupPage />} />
        <Route path="organizations/business-units" element={<BusinessUnitsPage />} />
        <Route path="organizations/departments" element={<DepartmentsPage />} />
        <Route path="organizations/branches" element={<BranchesPage />} />
        <Route path="organizations/cost-centers" element={<CostCentersPage />} />
        <Route path="organizations/locations" element={<LocationsPage />} />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Route>
    </Routes>
  )
}
