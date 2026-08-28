import type { ReactNode } from 'react'
import { X } from 'lucide-react'

interface ModalProps {
  open: boolean
  title: string
  onClose: () => void
  children: ReactNode
  widthClass?: string
}

export default function Modal({ open, title, onClose, children, widthClass = 'max-w-lg' }: ModalProps) {
  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className={`w-full ${widthClass} rounded-xl bg-sap-surface shadow-xl`}>
        <div className="flex items-center justify-between border-b border-sap-border px-5 py-4">
          <h2 className="text-base font-semibold text-sap-text">{title}</h2>
          <button
            onClick={onClose}
            className="rounded-md p-1 text-sap-text-muted hover:bg-sap-bg hover:text-sap-text"
            aria-label="Close"
          >
            <X size={18} />
          </button>
        </div>
        <div className="max-h-[75vh] overflow-y-auto sap-scroll px-5 py-4">{children}</div>
      </div>
    </div>
  )
}