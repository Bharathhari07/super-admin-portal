import type { SelectHTMLAttributes } from 'react'

interface Option {
  label: string
  value: string
}

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string
  options: Option[]
}

export default function Select({ label, options, id, className = '', ...rest }: SelectProps) {
  return (
    <div className="flex flex-col gap-1">
      {label && (
        <label htmlFor={id} className="text-sm font-medium text-sap-text">
          {label}
        </label>
      )}
      <select
        id={id}
        className={`rounded-lg border border-sap-border bg-sap-surface px-3 py-2 text-sm text-sap-text outline-none transition-colors focus:border-sap-primary focus:ring-2 focus:ring-sap-primary/20 ${className}`}
        {...rest}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  )
}