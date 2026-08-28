import type { ReactNode } from 'react'

type Tone = 'success' | 'danger' | 'warning' | 'info' | 'neutral'

const toneClasses: Record<Tone, string> = {
  success: 'bg-sap-success-bg text-sap-success',
  danger: 'bg-sap-danger-bg text-sap-danger',
  warning: 'bg-sap-warning-bg text-sap-warning',
  info: 'bg-sap-info-bg text-sap-info',
  neutral: 'bg-sap-bg text-sap-text-muted',
}

interface BadgeProps {
  tone?: Tone
  children: ReactNode
  dot?: boolean
}

export default function Badge({ tone = 'neutral', children, dot = false }: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium ${toneClasses[tone]}`}
    >
      {dot && <span className="h-1.5 w-1.5 rounded-full bg-current" />}
      {children}
    </span>
  )
}