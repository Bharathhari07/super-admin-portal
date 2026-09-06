import { useEffect, type ReactNode } from 'react'
import { X } from 'lucide-react'

interface ModalProps {
  open: boolean
  title: string
  onClose: () => void
  children: ReactNode
  widthClass?: string
}

export default function Modal({ open, title, onClose, children, widthClass = 'max-w-lg' }: ModalProps) {
  useEffect(() => {
    if (!open) return

    const originalOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        onClose()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => {
      document.body.style.overflow = originalOverflow
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [open, onClose])

  if (!open) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xs p-3 sm:p-4 animate-in fade-in duration-200"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div
        className={`w-full max-w-[calc(100vw-1.5rem)] ${widthClass} max-h-[92vh] flex flex-col rounded-xl border border-sap-border bg-sap-surface shadow-2xl transition-all`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-sap-border px-3.5 py-3 sm:px-5 sm:py-4">
          <h2 className="text-sm font-semibold text-sap-text sm:text-base truncate pr-2">{title}</h2>
          <button
            onClick={onClose}
            className="flex h-8 w-8 sm:h-9 sm:w-9 shrink-0 items-center justify-center rounded-lg text-sap-text-muted hover:bg-sap-bg hover:text-sap-text transition-colors"
            aria-label="Close"
          >
            <X size={18} />
          </button>
        </div>
        <div className="overflow-y-auto sap-scroll p-3.5 sm:p-5">{children}</div>
      </div>
    </div>
  )
}
