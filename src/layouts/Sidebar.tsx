import { NavLink } from 'react-router-dom'
import { LayoutDashboard, Building2, Building, ShieldCheck, X } from 'lucide-react'

const navItems = [
  { to: '/dashboard', label: 'Global Dashboard', icon: LayoutDashboard },
  { to: '/tenants', label: 'Tenant Management', icon: Building2 },
  { to: '/organizations/companies', label: 'Company Setup', icon: Building },
]

interface SidebarProps {
  onNavigate?: () => void
  onClose?: () => void
}

export default function Sidebar({ onNavigate, onClose }: SidebarProps) {
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
      <nav className="flex-1 space-y-1 px-3">
        {navItems.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            onClick={onNavigate}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                isActive ? 'bg-sap-primary text-sap-navy font-semibold' : 'text-slate-300 hover:bg-sap-navy-light hover:text-white'
              }`
            }
          >
            <Icon size={18} />
            {label}
          </NavLink>
        ))}
      </nav>
      <div className="px-5 py-4 text-xs text-slate-400">Super Admin Portal v1.0</div>
    </aside>
  )
}