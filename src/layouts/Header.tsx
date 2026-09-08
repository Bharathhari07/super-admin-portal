import { useState, useRef, useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Bell, UserCircle, Menu, ExternalLink, X, LogOut } from 'lucide-react'
import { useNotifications } from '../hooks/queries/useNotifications'
import { useAuth } from '../context/AuthContext'

interface HeaderProps {
  onMenuClick: () => void
}

const pageTitles: Record<string, string> = {
  '/dashboard': 'Global Dashboard',
  '/tenants': 'Tenant Management',
  '/users': 'User Management',
  '/organizations': 'Organization Overview',
  '/organizations/companies': 'Company Setup',
  '/organizations/business-units': 'Business Units',
  '/organizations/departments': 'Departments',
  '/organizations/branches': 'Branches',
  '/organizations/cost-centers': 'Cost Centers',
  '/organizations/locations': 'Locations',
  '/roles': 'Roles Management',
  '/permissions': 'Permissions Repository',
  '/role-assignments': 'Role Assignments',
  '/data-permissions': 'Data Permissions',
  '/platform-configuration': 'Platform Configuration',
  '/feature-management': 'Feature Management',
  '/license-management': 'Subscription & License',
  '/security': 'Security & Compliance Settings',
  '/audit-logs': 'System Audit Logs',
  '/notifications': 'Notifications & Alerts',
}

export default function Header({ onMenuClick }: HeaderProps) {
  const location = useLocation()
  const navigate = useNavigate()
  const { logout } = useAuth()
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  const { data } = useNotifications({ pageSize: 4, sortBy: 'createdAt', sortDir: 'desc' })

  const notifications = data?.data ?? []
  const unreadCount = data?.unreadCount ?? 0

  const currentTitle = pageTitles[location.pathname] || 'Super Admin Portal'

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false)
      }
    }
    if (dropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [dropdownOpen])

  const handleLogout = () => {
    logout()
    navigate('/login', { replace: true })
  }

  return (
    <header className="sap-marble relative z-30 flex h-16 w-full items-center justify-between px-3 sm:px-4 md:px-6">
      <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
        <button
          onClick={onMenuClick}
          className="flex h-10 w-10 items-center justify-center rounded-lg text-white/80 hover:bg-white/10 hover:text-white lg:hidden shrink-0 transition-colors"
          aria-label="Open navigation menu"
        >
          <Menu size={22} />
        </button>
        <h1 className="truncate text-sm sm:text-base md:text-lg font-semibold text-[#FCE300]">
          {currentTitle}
        </h1>
      </div>

      <div className="flex items-center gap-2 sm:gap-4 shrink-0">
        {/* Notifications Bell with flyout */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setDropdownOpen((prev) => !prev)}
            className="relative flex h-10 w-10 items-center justify-center rounded-full text-white/80 transition-colors hover:bg-white/10 hover:text-white"
            aria-label="Notifications"
          >
            <Bell size={20} />
            {unreadCount > 0 && (
              <span className="absolute right-1.5 top-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-sap-primary px-1 text-[10px] font-bold text-sap-navy shadow-xs">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </button>

          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-[calc(100vw-1.5rem)] max-w-sm rounded-xl border border-sap-border bg-sap-surface p-3 shadow-2xl sm:w-96 z-50">
              <div className="flex items-center justify-between border-b border-sap-border pb-2.5">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-sap-text">Recent Alerts</span>
                  {unreadCount > 0 && (
                    <span className="rounded-full bg-sap-warning-bg px-2 py-0.5 text-xs font-semibold text-sap-warning">
                      {unreadCount} unread
                    </span>
                  )}
                </div>
                <button
                  onClick={() => setDropdownOpen(false)}
                  className="flex h-7 w-7 items-center justify-center rounded-md text-sap-text-muted hover:bg-sap-bg hover:text-white"
                >
                  <X size={16} />
                </button>
              </div>

              <div className="divide-y divide-sap-border/40 py-1 max-h-[60vh] overflow-y-auto sap-scroll">
                {notifications.length === 0 ? (
                  <div className="py-6 text-center text-xs text-sap-text-muted">No notifications right now.</div>
                ) : (
                  notifications.map((n) => (
                    <div
                      key={n.id}
                      className={`p-2.5 transition-colors hover:bg-sap-bg/50 ${
                        n.status === 'Unread' ? 'bg-sap-bg/30' : ''
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-1.5 min-w-0">
                          {n.status === 'Unread' && (
                            <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-sap-primary" />
                          )}
                          <span className="truncate text-xs font-medium text-sap-text">{n.title}</span>
                        </div>
                        <span className="shrink-0 whitespace-nowrap text-[10px] text-sap-text-muted">
                          {new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                      <p className="mt-1 line-clamp-2 text-[11px] leading-relaxed text-sap-text-muted">{n.message}</p>
                    </div>
                  ))
                )}
              </div>

              <div className="border-t border-sap-border pt-2 text-center">
                <Link
                  to="/notifications"
                  onClick={() => setDropdownOpen(false)}
                  className="inline-flex items-center gap-1 text-xs font-semibold text-sap-primary hover:underline"
                >
                  <span>View All Notifications & Alerts</span>
                  <ExternalLink size={12} />
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* User profile & Logout */}
        <div className="flex items-center gap-3">
          <div className="hidden items-center gap-2 text-sm sm:flex">
            <UserCircle size={28} className="text-white/80" />
            <span className="font-medium text-white">Super Admin</span>
          </div>

          <button
            onClick={handleLogout}
            className="inline-flex items-center gap-1.5 rounded-lg border border-sap-border bg-sap-surface/80 px-2.5 py-1.5 text-xs font-medium text-slate-300 hover:bg-sap-navy-light hover:text-white transition-colors"
            title="Sign out of portal"
          >
            <LogOut size={14} />
            <span className="hidden sm:inline">Sign Out</span>
          </button>
        </div>
      </div>
    </header>
  )
}
