import { Routes, Route, Navigate } from 'react-router-dom'
import SuperAdminLayout from '../layouts/SuperAdminLayout'
import ProtectedRoute from './ProtectedRoute'
import LoginPage from '../pages/LoginPage'
import DashboardPage from '../pages/DashboardPage'
import TenantManagementPage from '../pages/TenantManagementPage'
import UserManagementPage from '../pages/UserManagementPage'
import BulkOnboardingPage from '../pages/BulkOnboardingPage'
import DisasterRecoveryPage from '../pages/DisasterRecoveryPage'
import StatusIncidentsPage from '../pages/StatusIncidentsPage'
import TenantUsageBillingPage from '../pages/TenantUsageBillingPage'
import OrganizationOverviewPage from '../pages/OrganizationOverviewPage'
import CompanySetupPage from '../pages/CompanySetupPage'
import BusinessUnitsPage from '../pages/BusinessUnitsPage'
import DepartmentsPage from '../pages/DepartmentsPage'
import BranchesPage from '../pages/BranchesPage'
import CostCentersPage from '../pages/CostCentersPage'
import LocationsPage from '../pages/LocationsPage'
import RolesPage from '../pages/RolesPage'
import PermissionsPage from '../pages/PermissionsPage'
import RoleAssignmentsPage from '../pages/RoleAssignmentsPage'
import DataPermissionsPage from '../pages/DataPermissionsPage'
import PlatformConfigurationPage from '../pages/PlatformConfigurationPage'
import FeatureManagementPage from '../pages/FeatureManagementPage'
import LicenseManagementPage from '../pages/LicenseManagementPage'
import SecurityPage from '../pages/SecurityPage'
import AuditLogsPage from '../pages/AuditLogsPage'
import NotificationsPage from '../pages/NotificationsPage'

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />

      {/* Every route below requires an active session; ProtectedRoute
          sends anyone not logged in back to /login. */}
      <Route element={<ProtectedRoute />}>
        <Route element={<SuperAdminLayout />}>
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<DashboardPage />} />
          <Route path="tenants" element={<TenantManagementPage />} />
          <Route path="users" element={<UserManagementPage />} />

          <Route path="bulk-onboarding" element={<BulkOnboardingPage />} />
          <Route path="disaster-recovery" element={<DisasterRecoveryPage />} />
          <Route path="status-incidents" element={<StatusIncidentsPage />} />
          <Route path="tenant-billing" element={<TenantUsageBillingPage />} />

          <Route path="organizations" element={<OrganizationOverviewPage />} />
          <Route path="organizations/companies" element={<CompanySetupPage />} />
          <Route path="organizations/business-units" element={<BusinessUnitsPage />} />
          <Route path="organizations/departments" element={<DepartmentsPage />} />
          <Route path="organizations/branches" element={<BranchesPage />} />
          <Route path="organizations/cost-centers" element={<CostCentersPage />} />
          <Route path="organizations/locations" element={<LocationsPage />} />

          <Route path="roles" element={<RolesPage />} />
          <Route path="permissions" element={<PermissionsPage />} />
          <Route path="role-assignments" element={<RoleAssignmentsPage />} />
          <Route path="data-permissions" element={<DataPermissionsPage />} />

          <Route path="platform-configuration" element={<PlatformConfigurationPage />} />
          <Route path="feature-management" element={<FeatureManagementPage />} />
          <Route path="license-management" element={<LicenseManagementPage />} />
          <Route path="security" element={<SecurityPage />} />

          <Route path="audit-logs" element={<AuditLogsPage />} />
          <Route path="notifications" element={<NotificationsPage />} />
        </Route>
      </Route>

      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  )
}
