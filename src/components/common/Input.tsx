import type { InputHTMLAttributes } from 'react'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  containerClassName?: string
}

export default function Input({
  label,
  error,
  id,
  className = '',
  containerClassName = '',
  ...rest
}: InputProps) {
  const colSpanClasses = className
    .split(' ')
    .filter((c) => c.includes('col-span-'))
    .join(' ')

  return (
    <div className={`flex flex-col gap-1 w-full min-w-0 ${colSpanClasses} ${containerClassName}`}>
      {label && (
        <label htmlFor={id} className="text-sm font-medium text-sap-text">
          {label}
        </label>
      )}
      <input
        id={id}
        className={`w-full rounded-lg border bg-sap-surface px-3 py-2 text-sm text-sap-text placeholder:text-sap-text-muted outline-none transition-colors focus:border-sap-primary focus:ring-2 focus:ring-sap-primary/20 ${
          error ? 'border-sap-danger' : 'border-sap-border'
        } ${className}`}
        {...rest}
      />
      {error && <span className="text-xs text-sap-danger">{error}</span>}
    </div>
  )
}
