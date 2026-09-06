import { ChevronLeft, ChevronRight } from 'lucide-react'
import Button from './Button'

interface PaginationProps {
  page: number
  pageSize: number
  total: number
  onPageChange: (page: number) => void
  itemLabel?: string
}

export default function Pagination({ page, pageSize, total, onPageChange, itemLabel = 'items' }: PaginationProps) {
  const totalPages = Math.max(1, Math.ceil(total / pageSize))
  const start = total === 0 ? 0 : (page - 1) * pageSize + 1
  const end = Math.min(page * pageSize, total)

  return (
    <div className="flex flex-col items-center justify-between gap-3 border-t border-sap-border px-3 py-3 sm:flex-row sm:px-4 text-center sm:text-left">
      <p className="text-xs sm:text-sm text-sap-text-muted">
        Showing <span className="font-medium text-sap-text">{start}</span>-
        <span className="font-medium text-sap-text">{end}</span> of{' '}
        <span className="font-medium text-sap-text">{total}</span> {itemLabel}
      </p>
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(page - 1)}
          disabled={page <= 1}
          className="h-8 px-2.5 text-xs sm:text-sm"
        >
          <ChevronLeft size={16} /> Prev
        </Button>
        <span className="px-1 text-xs sm:text-sm text-sap-text-muted">
          Page {page} of {totalPages}
        </span>
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(page + 1)}
          disabled={page >= totalPages}
          className="h-8 px-2.5 text-xs sm:text-sm"
        >
          Next <ChevronRight size={16} />
        </Button>
      </div>
    </div>
  )
}
