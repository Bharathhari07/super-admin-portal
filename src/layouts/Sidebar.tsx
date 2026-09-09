import { useState } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import {
  LayoutDashboard,
  Building2,
  Users,
  ShieldCheck as RolesIcon,
  KeyRound,
  Link2,
  Lock,
  ToggleLeft,
  BadgeCheck,
  ShieldAlert,
  LayoutGrid,
  Building,
  Boxes,
  Network,
  MapPin,
  Wallet,
  Globe,
  ShieldCheck,
  ChevronDown,
  ChevronRight,
  FileText,
  Bell,
  Sliders,
  Radio,
  CreditCard,
  UploadCloud,
  History,
} from 'lucide-react'

const coreItems = [
  { to: '/dashboard', label: 'Global Dashboard', icon: LayoutDashboard },
  { to: '/tenants', label: 'Tenant Management', icon: Building2 },
  { to: '/users', label: 'User Management', icon: Users },
]

const tenantOperationsItems = [
  { to: '/bulk-onboarding', label: 'Batch Tenant Provisioning', icon: UploadCloud },
  { to: '/disaster-recovery', label: 'Data Isolation & Recovery', icon: History },
  { to: '/status-incidents', label: 'Platform Health & Alerts', icon: Radio },
  { to: '/tenant-billing', label: 'Tenant Quotas & Billing', icon: CreditCard },
]

const orgSubItems = [
  { to: '/organizations', label: 'Overview', icon: LayoutGrid, end: true },
  { to: '/organizations/companies', label: 'Company Setup', icon: Building, end: false },
  { to: '/organizations/business-units', label: 'Business Units', icon: Boxes, end: false },
  { to: '/organizations/departments', label: 'Departments', icon: Network, end: false },
  { to: '/organizations/branches', label: 'Branches', icon: MapPin, end: false },
  { to: '/organizations/cost-centers', label: 'Cost Centers', icon: Wallet, end: false },
  { to: '/organizations/locations', label: 'Locations', icon: Globe, end: false },
]

const accessControlItems = [
  { to: '/roles', label: 'Roles', icon: RolesIcon },
  { to: '/permissions', label: 'Permissions', icon: KeyRound },
  { to: '/role-assignments', label: 'Role Assignments', icon: Link2 },
  { to: '/data-permissions', label: 'Data Permissions', icon: Lock },
]

const platformSettingsItems = [
  { to: '/platform-configuration', label: 'Platform Configuration', icon: Sliders },
  { to: '/feature-management', label: 'Feature Management', icon: ToggleLeft },
  { to: '/license-management', label: 'Subscription & License', icon: BadgeCheck },
  { to: '/security', label: 'Security Settings', icon: ShieldAlert },
]

const monitoringItems = [
  { to: '/audit-logs', label: 'Audit Logs', icon: FileText },
  { to: '/notifications', label: 'Notifications', icon: Bell },
]

interface SidebarProps {
  onNavigate?: () => void
  onClose?: () => void
}

export default function Sidebar({ onNavigate }: SidebarProps) {
  const location = useLocation()
  const currentPath = location.pathname

  const isOrgActive = currentPath.startsWith('/organizations')
  const isAccessControlActive = accessControlItems.some((i) => currentPath.startsWith(i.to))
  const isSettingsActive = platformSettingsItems.some((i) => currentPath.startsWith(i.to))
  const isTenantOperationsActive = tenantOperationsItems.some((i) => currentPath.startsWith(i.to))
  const isMonitoringActive = monitoringItems.some((i) => currentPath.startsWith(i.to))

  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    org: isOrgActive,
    access: isAccessControlActive,
    settings: isSettingsActive,
    tenantOperations: true,
    monitoring: isMonitoringActive,
  })

  function toggleSection(sectionKey: string) {
    setOpenSections((prev) => ({
      ...prev,
      [sectionKey]: !prev[sectionKey],
    }))
  }

  const linkClasses = (isActive: boolean) =>
    `flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
      isActive
        ? 'bg-sap-primary text-sap-navy font-bold shadow-sm'
        : 'text-slate-300 hover:bg-sap-navy-light hover:text-white'
    }`

  const subLinkClasses = (isActive: boolean) =>
    `flex items-center justify-between gap-2.5 rounded-lg px-2.5 py-1.5 text-xs font-medium transition-colors ${
      isActive
        ? 'bg-sap-primary text-sap-navy font-bold'
        : 'text-slate-300 hover:bg-sap-navy-light hover:text-white'
    }`

  return (
    <aside className="flex h-full w-64 flex-col bg-sap-navy text-white border-r border-sap-border">
      <div className="flex items-center justify-between border-b border-sap-border px-5 py-4">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-sap-primary text-sap-navy shadow-sm">
            <ShieldCheck size={20} />
          </div>
          <div>
            <span className="text-base font-bold leading-none text-white">Super Admin</span>
            <div className="text-[10px] uppercase tracking-wider text-sap-primary/80">Enterprise Portal</div>
          </div>
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-4 sap-scroll">
        <div className="space-y-1">
          <p className="px-3 text-[10px] font-bold uppercase tracking-wider text-sap-text-muted">Core Administration</p>
          {coreItems.map(({ to, label, icon: Icon }) => (
            <NavLink key={to} to={to} onClick={onNavigate} className={({ isActive }) => linkClasses(isActive)}>
              <Icon size={18} />
              <span>{label}</span>
            </NavLink>
          ))}
        </div>

        <div className="space-y-1">
          <button
            onClick={() => toggleSection('tenantOperations')}
            className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
              isTenantOperationsActive ? 'text-white' : 'text-slate-300 hover:bg-sap-navy-light hover:text-white'
            }`}
          >
            <div className="flex items-center gap-3">
              <UploadCloud size={18} className="text-sap-primary" />
              <span>Tenant Operations</span>
            </div>
            {openSections.tenantOperations ? <ChevronDown size={15} /> : <ChevronRight size={15} />}
          </button>
          {openSections.tenantOperations && (
            <div className="ml-3.5 space-y-1 border-l border-sap-navy-light pl-2.5 pt-1">
              {tenantOperationsItems.map(({ to, label, icon: Icon }) => (
                <NavLink key={to} to={to} onClick={onNavigate} className={({ isActive }) => subLinkClasses(isActive)}>
                  <div className="flex items-center gap-2">
                    <Icon size={14} />
                    <span>{label}</span>
                  </div>
                </NavLink>
              ))}
            </div>
          )}
        </div>

        <div className="space-y-1">
          <button
            onClick={() => toggleSection('org')}
            className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
              isOrgActive ? 'text-white' : 'text-slate-300 hover:bg-sap-navy-light hover:text-white'
            }`}
          >
            <div className="flex items-center gap-3">
              <Network size={18} className="text-sap-primary" />
              <span>Organizations</span>
            </div>
            {openSections.org ? <ChevronDown size={15} /> : <ChevronRight size={15} />}
          </button>
          {openSections.org && (
            <div className="ml-3.5 space-y-1 border-l border-sap-navy-light pl-2.5 pt-1">
              {orgSubItems.map(({ to, label, icon: Icon }) => (
                <NavLink key={to} to={to} onClick={onNavigate} className={({ isActive }) => subLinkClasses(isActive)}>
                  <div className="flex items-center gap-2">
                    <Icon size={14} />
                    <span>{label}</span>
                  </div>
                </NavLink>
              ))}
            </div>
          )}
        </div>

        <div className="space-y-1">
          <button
            onClick={() => toggleSection('access')}
            className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
              isAccessControlActive ? 'text-white' : 'text-slate-300 hover:bg-sap-navy-light hover:text-white'
            }`}
          >
            <div className="flex items-center gap-3">
              <RolesIcon size={18} className="text-sap-primary" />
              <span>Access Control</span>
            </div>
            {openSections.access ? <ChevronDown size={15} /> : <ChevronRight size={15} />}
          </button>
          {openSections.access && (
            <div className="ml-3.5 space-y-1 border-l border-sap-navy-light pl-2.5 pt-1">
              {accessControlItems.map(({ to, label, icon: Icon }) => (
                <NavLink key={to} to={to} onClick={onNavigate} className={({ isActive }) => subLinkClasses(isActive)}>
                  <div className="flex items-center gap-2">
                    <Icon size={14} />
                    <span>{label}</span>
                  </div>
                </NavLink>
              ))}
            </div>
          )}
        </div>

        <div className="space-y-1">
          <button
            onClick={() => toggleSection('settings')}
            className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
              isSettingsActive ? 'text-white' : 'text-slate-300 hover:bg-sap-navy-light hover:text-white'
            }`}
          >
            <div className="flex items-center gap-3">
              <Sliders size={18} className="text-sap-primary" />
              <span>Platform Settings</span>
            </div>
            {openSections.settings ? <ChevronDown size={15} /> : <ChevronRight size={15} />}
          </button>
          {openSections.settings && (
            <div className="ml-3.5 space-y-1 border-l border-sap-navy-light pl-2.5 pt-1">
              {platformSettingsItems.map(({ to, label, icon: Icon }) => (
                <NavLink key={to} to={to} onClick={onNavigate} className={({ isActive }) => subLinkClasses(isActive)}>
                  <div className="flex items-center gap-2">
                    <Icon size={14} />
                    <span>{label}</span>
                  </div>
                </NavLink>
              ))}
            </div>
          )}
        </div>

        <div className="space-y-1">
          <button
            onClick={() => toggleSection('monitoring')}
            className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
              isMonitoringActive ? 'text-white' : 'text-slate-300 hover:bg-sap-navy-light hover:text-white'
            }`}
          >
            <div className="flex items-center gap-3">
              <FileText size={18} className="text-sap-primary" />
              <span>Compliance & Logs</span>
            </div>
            {openSections.monitoring ? <ChevronDown size={15} /> : <ChevronRight size={15} />}
          </button>
          {openSections.monitoring && (
            <div className="ml-3.5 space-y-1 border-l border-sap-navy-light pl-2.5 pt-1">
              {monitoringItems.map(({ to, label, icon: Icon }) => (
                <NavLink key={to} to={to} onClick={onNavigate} className={({ isActive }) => subLinkClasses(isActive)}>
                  <div className="flex items-center gap-2">
                    <Icon size={14} />
                    <span>{label}</span>
                  </div>
                </NavLink>
              ))}
            </div>
          )}
        </div>
      </nav>

      <div className="border-t border-sap-navy-light p-4 text-[11px] text-sap-text-muted">
        Super Admin Portal <span className="text-sap-primary font-bold">v1.2</span>
      </div>
    </aside>
  )
}
