import type { ButtonHTMLAttributes, ReactNode } from 'react'

type Variant = 'primary' | 'outline' | 'danger' | 'ghost'
type Size = 'sm' | 'md'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant
  size?: Size
  children: ReactNode
  isLoading?: boolean
}

const variantClasses: Record<Variant, string> = {
  primary: 'bg-sap-primary text-sap-primary-text font-semibold hover:bg-sap-primary-dark',
  outline: 'bg-sap-surface text-sap-text border border-sap-border hover:bg-sap-navy-light/20',
  danger: 'bg-sap-danger text-white hover:opacity-90',
  ghost: 'bg-transparent text-sap-text hover:bg-sap-navy-light/20',
}

const sizeClasses: Record<Size, string> = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-4 py-2 text-sm',
}

export default function Button({
  variant = 'primary',
  size = 'md',
  isLoading = false,
  disabled,
  children,
  className = '',
  ...rest
}: ButtonProps) {
  return (
    <button
      disabled={disabled || isLoading}
      className={`inline-flex items-center justify-center gap-1.5 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
      {...rest}
    >
      {isLoading && (
        <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-current border-t-transparent" />
      )}
      {children}
    </button>
  )
}