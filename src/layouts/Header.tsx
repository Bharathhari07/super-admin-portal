import { Bell, UserCircle, Menu } from 'lucide-react'

interface HeaderProps {
  onMenuClick: () => void
}

export default function Header({ onMenuClick }: HeaderProps) {
  return (
    <header className="sap-marble flex h-16 items-center justify-between px-4 md:px-6">
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuClick}
          className="rounded-md p-1.5 text-white/80 hover:bg-white/10 hover:text-white md:hidden"
          aria-label="Open menu"
        >
          <Menu size={22} />
        </button>
        <h1 className="text-base font-semibold text-[#FCE300] md:text-lg">Platform Overview</h1>
      </div>
      <div className="flex items-center gap-4">
        <button
          className="rounded-full p-2 text-white/80 hover:bg-white/10 hover:text-white"
          aria-label="Notifications"
        >
          <Bell size={20} />
        </button>
        <div className="hidden items-center gap-2 text-sm sm:flex">
          <UserCircle size={28} className="text-white/80" />
          <span className="font-medium text-white">Super Admin</span>
        </div>
      </div>
    </header>
  )
}