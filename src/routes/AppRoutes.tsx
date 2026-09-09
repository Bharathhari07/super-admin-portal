import { Routes, Route, Navigate } from "react-router-dom";
import SuperAdminLayout from "../layouts/SuperAdminLayout";
import DashboardPage from "../pages/DashboardPage";
import TenantManagementPage from "../pages/TenantManagementPage";
import UserManagementPage from "../pages/UserManagementPage";
import OrganizationOverviewPage from "../pages/OrganizationOverviewPage";
import CompanySetupPage from "../pages/CompanySetupPage";
import BranchesPage from "../pages/BranchesPage";
import CostCentersPage from "../pages/CostCentersPage";
import RolesPage from "../pages/RolesPage";
import RoleAssignmentsPage from "../pages/RoleAssignmentsPage";
import DataPermissionsPage from "../pages/DataPermissionsPage";
import FeatureManagementPage from "../pages/FeatureManagementPage";
import PlatformConfigurationPage from "../pages/PlatformConfigurationPage";
import SecurityPage from "../pages/SecurityPage";
import AuditLogsPage from "../pages/AuditLogsPage";
import NotificationsPage from "../pages/NotificationsPage";
import LoginPage from "../pages/LoginPage";
import BulkOnboardingPage from "../pages/BulkOnboardingPage";
import DisasterRecoveryPage from "../pages/DisasterRecoveryPage";
import StatusIncidentsPage from "../pages/StatusIncidentsPage";
import TenantUsageBillingPage from "../pages/TenantUsageBillingPage";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route element={<SuperAdminLayout />}>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/tenants" element={<TenantManagementPage />} />
        <Route path="/users" element={<UserManagementPage />} />

        {/* Tenant Operations */}
        <Route path="/bulk-onboarding" element={<BulkOnboardingPage />} />
        <Route path="/disaster-recovery" element={<DisasterRecoveryPage />} />
        <Route path="/status-incidents" element={<StatusIncidentsPage />} />
        <Route path="/tenant-billing" element={<TenantUsageBillingPage />} />

        {/* Organizations */}
        <Route path="/organizations/overview" element={<OrganizationOverviewPage />} />
        <Route path="/organizations/hierarchy" element={<CompanySetupPage />} />
        <Route path="/organizations/branches" element={<BranchesPage />} />
        <Route path="/organizations/cost-centers" element={<CostCentersPage />} />

        {/* Access Control */}
        <Route path="/roles" element={<RolesPage />} />
        <Route path="/user-role-assignment" element={<RoleAssignmentsPage />} />
        <Route path="/data-permissions" element={<DataPermissionsPage />} />

        {/* Platform Settings */}
        <Route path="/features" element={<FeatureManagementPage />} />
        <Route path="/configurations" element={<PlatformConfigurationPage />} />
        <Route path="/security" element={<SecurityPage />} />

        {/* Monitoring */}
        <Route path="/audit-logs" element={<AuditLogsPage />} />
        <Route path="/notifications" element={<NotificationsPage />} />
      </Route>
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}
