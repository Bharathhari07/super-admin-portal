import type { SelectHTMLAttributes } from 'react'

interface Option {
  label: string
  value: string
}

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string
  options: Option[]
  containerClassName?: string
}

export default function Select({
  label,
  options,
  id,
  className = '',
  containerClassName = '',
  ...rest
}: SelectProps) {
  const colSpanClasses = className
    .split(' ')
    .filter((c) => c.includes('col-span-'))
    .join(' ')

  return (
    <div className={`flex flex-col gap-1 w-full sm:w-auto min-w-0 ${colSpanClasses} ${containerClassName}`}>
      {label && (
        <label htmlFor={id} className="text-xs sm:text-sm font-medium text-sap-text truncate">
          {label}
        </label>
      )}
      <select
        id={id}
        className={`w-full rounded-lg border border-sap-border bg-sap-surface px-2.5 py-1.5 sm:px-3 sm:py-2 text-xs sm:text-sm text-sap-text outline-none transition-colors focus:border-sap-primary focus:ring-2 focus:ring-sap-primary/20 ${className}`}
        {...rest}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value} className="bg-sap-surface text-sap-text">
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  )
}
