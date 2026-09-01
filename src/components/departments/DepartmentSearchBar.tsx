import { Search } from 'lucide-react'

interface DepartmentSearchBarProps {
  value: string
  onChange: (value: string) => void
}

export default function DepartmentSearchBar({ value, onChange }: DepartmentSearchBarProps) {
  return (
    <div className="relative w-full sm:max-w-xs">
      <Search size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sap-text-muted" />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Search by name or code..."
        className="w-full rounded-lg border border-sap-border bg-sap-surface py-2 pl-9 pr-3 text-sm text-sap-text placeholder:text-sap-text-muted outline-none transition-colors focus:border-sap-primary focus:ring-2 focus:ring-sap-primary/20"
      />
    </div>
  )
}
