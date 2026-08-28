import { Inbox } from 'lucide-react'

interface EmptyStateProps {
  title: string
  description?: string
}

export default function EmptyState({ title, description }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-2 py-14 text-center">
      <Inbox size={32} className="text-sap-text-muted" />
      <p className="font-medium text-sap-text">{title}</p>
      {description && <p className="text-sm text-sap-text-muted">{description}</p>}
    </div>
  )
}