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
  Settings,
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
  X,
  FileText,
  Bell,
  Sliders,
  Shield,
  Activity,
} from 'lucide-react'
import { useNotifications } from '../hooks/queries/useNotifications'

const coreItems = [
  { to: '/dashboard', label: 'Global Dashboard', icon: LayoutDashboard },
  { to: '/tenants', label: 'Tenant Management', icon: Building2 },
  { to: '/users', label: 'User Management', icon: Users },
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

export default function Sidebar({ onNavigate, onClose }: SidebarProps) {
  const location = useLocation()
  const currentPath = location.pathname

  const isOrgActive = currentPath.startsWith('/organizations')
  const isAccessControlActive = accessControlItems.some((i) => currentPath.startsWith(i.to))
  const isSettingsActive = platformSettingsItems.some((i) => currentPath.startsWith(i.to))
  const isMonitoringActive = monitoringItems.some((i) => currentPath.startsWith(i.to))

  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    org: isOrgActive,
    access: isAccessControlActive,
    settings: isSettingsActive,
    monitoring: isMonitoringActive,
  })

  const [lastPath, setLastPath] = useState(currentPath)
  if (lastPath !== currentPath) {
    setLastPath(currentPath)
    setOpenSections((prev) => ({
      ...prev,
      org: isOrgActive ? true : prev.org,
      access: isAccessControlActive ? true : prev.access,
      settings: isSettingsActive ? true : prev.settings,
      monitoring: isMonitoringActive ? true : prev.monitoring,
    }))
  }

  const { data: notifData } = useNotifications({ pageSize: 1 })
  const unreadCount = notifData?.unreadCount ?? 0

  function toggleSection(sectionKey: string) {
    setOpenSections((prev) => ({
      ...prev,
      [sectionKey]: !prev[sectionKey],
    }))
  }

  const linkClasses = (isActive: boolean) =>
    `flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
      isActive
        ? 'bg-sap-primary text-sap-navy font-semibold shadow-sm'
        : 'text-slate-300 hover:bg-sap-navy-light hover:text-white'
    }`

  const subLinkClasses = (isActive: boolean) =>
    `flex items-center justify-between gap-2.5 rounded-lg px-2.5 py-1.5 text-xs font-medium transition-colors ${
      isActive
        ? 'bg-sap-primary text-sap-navy font-semibold'
        : 'text-slate-300 hover:bg-sap-navy-light hover:text-white'
    }`

  return (
    <aside className="flex h-full w-full lg:w-64 flex-col bg-sap-navy text-white">
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
        {onClose && (
          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-md p-1 text-slate-300 hover:bg-sap-navy-light hover:text-white"
            aria-label="Close menu"
          >
            <X size={20} />
          </button>
        )}
      </div>

      <nav className="flex-1 space-y-4 overflow-y-auto sap-scroll p-3">
        <div className="space-y-1">
          <div className="px-2 pb-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">
            Core Administration
          </div>
          {coreItems.map(({ to, label, icon: Icon }) => (
            <NavLink key={to} to={to} onClick={onNavigate} className={({ isActive }) => linkClasses(isActive)}>
              <Icon size={17} />
              <span>{label}</span>
            </NavLink>
          ))}
        </div>

        <div className="space-y-1">
          <button
            onClick={() => toggleSection('org')}
            className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
              isOrgActive ? 'text-white' : 'text-slate-300 hover:bg-sap-navy-light hover:text-white'
            }`}
            aria-expanded={openSections.org}
          >
            <div className="flex items-center gap-3">
              <LayoutGrid size={17} className={isOrgActive ? 'text-sap-primary' : ''} />
              <span className="text-left font-medium">Organizations</span>
            </div>
            {openSections.org ? <ChevronDown size={15} /> : <ChevronRight size={15} />}
          </button>

          {openSections.org && (
            <div className="ml-3.5 space-y-1 border-l border-sap-navy-light pl-2.5 pt-1">
              {orgSubItems.map(({ to, label, icon: Icon, end }) => (
                <NavLink key={to} to={to} end={end} onClick={onNavigate} className={({ isActive }) => subLinkClasses(isActive)}>
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
            aria-expanded={openSections.access}
          >
            <div className="flex items-center gap-3">
              <Shield size={17} className={isAccessControlActive ? 'text-sap-primary' : ''} />
              <span className="text-left font-medium">Access Control</span>
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
            aria-expanded={openSections.settings}
          >
            <div className="flex items-center gap-3">
              <Settings size={17} className={isSettingsActive ? 'text-sap-primary' : ''} />
              <span className="text-left font-medium">Platform Settings</span>
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
            aria-expanded={openSections.monitoring}
          >
            <div className="flex items-center gap-3">
              <Activity size={17} className={isMonitoringActive ? 'text-sap-primary' : ''} />
              <span className="text-left font-medium">Compliance & Logs</span>
            </div>
            <div className="flex items-center gap-1.5">
              {unreadCount > 0 && (
                <span className="rounded-full bg-sap-primary px-1.5 py-0.5 text-[10px] font-bold text-sap-navy">
                  {unreadCount}
                </span>
              )}
              {openSections.monitoring ? <ChevronDown size={15} /> : <ChevronRight size={15} />}
            </div>
          </button>

          {openSections.monitoring && (
            <div className="ml-3.5 space-y-1 border-l border-sap-navy-light pl-2.5 pt-1">
              {monitoringItems.map(({ to, label, icon: Icon }) => (
                <NavLink key={to} to={to} onClick={onNavigate} className={({ isActive }) => subLinkClasses(isActive)}>
                  <div className="flex items-center gap-2">
                    <Icon size={14} />
                    <span>{label}</span>
                  </div>
                  {to === '/notifications' && unreadCount > 0 && (
                    <span className="rounded-full bg-sap-primary/20 px-1.5 py-0.2 text-[10px] font-bold text-sap-primary">
                      {unreadCount}
                    </span>
                  )}
                </NavLink>
              ))}
            </div>
          )}
        </div>
      </nav>

      <div className="border-t border-sap-border px-5 py-3 text-[11px] text-slate-400">
        <div className="flex items-center justify-between">
          <span>Super Admin Portal</span>
          <span className="font-mono text-sap-primary">v1.0</span>
        </div>
      </div>
    </aside>
  )
}
