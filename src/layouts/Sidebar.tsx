import { useState, useEffect } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import {
  LayoutDashboard,
  Building2,
  Users,
  ShieldCheck as RolesIcon,
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
} from 'lucide-react'

const topLevelItems = [
  { to: '/dashboard', label: 'Global Dashboard', icon: LayoutDashboard },
  { to: '/tenants', label: 'Tenant Management', icon: Building2 },
  { to: '/users', label: 'User Management', icon: Users },
  { to: '/roles', label: 'Roles', icon: RolesIcon },
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

interface SidebarProps {
  onNavigate?: () => void
  onClose?: () => void
}

export default function Sidebar({ onNavigate, onClose }: SidebarProps) {
  const location = useLocation()
  const isInsideOrg = location.pathname.startsWith('/organizations')
  const [orgExpanded, setOrgExpanded] = useState(isInsideOrg)

  useEffect(() => {
    setOrgExpanded(isInsideOrg)
  }, [isInsideOrg])

  const linkClasses = (isActive: boolean) =>
    `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
      isActive ? 'bg-sap-primary text-sap-navy font-semibold' : 'text-slate-300 hover:bg-sap-navy-light hover:text-white'
    }`

  return (
    <aside className="flex h-full w-64 flex-col bg-sap-navy text-white">
      <div className="flex items-center justify-between px-5 py-5">
        <div className="flex items-center gap-2">
          <ShieldCheck size={22} className="text-sap-primary" />
          <span className="text-lg font-semibold">Super Admin</span>
        </div>
        {onClose && (
          <button onClick={onClose} className="text-slate-300 hover:text-white md:hidden" aria-label="Close menu">
            <X size={20} />
          </button>
        )}
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto sap-scroll px-3">
        {topLevelItems.map(({ to, label, icon: Icon }) => (
          <NavLink key={to} to={to} onClick={onNavigate} className={({ isActive }) => linkClasses(isActive)}>
            <Icon size={18} />
            {label}
          </NavLink>
        ))}

        <button
          onClick={() => setOrgExpanded((prev) => !prev)}
          className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
            isInsideOrg ? 'text-white' : 'text-slate-300 hover:bg-sap-navy-light hover:text-white'
          }`}
          aria-expanded={orgExpanded}
        >
          <LayoutGrid size={18} />
          <span className="flex-1 text-left">Organization Management</span>
          {orgExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
        </button>

        {orgExpanded && (
          <div className="ml-4 space-y-1 border-l border-sap-navy-light pl-3">
            {orgSubItems.map(({ to, label, icon: Icon, end }) => (
              <NavLink key={to} to={to} end={end} onClick={onNavigate} className={({ isActive }) => linkClasses(isActive)}>
                <Icon size={16} />
                <span className="text-sm">{label}</span>
              </NavLink>
            ))}
          </div>
        )}
      </nav>

      <div className="px-5 py-4 text-xs text-slate-400">Super Admin Portal v1.0</div>
    </aside>
  )
}
