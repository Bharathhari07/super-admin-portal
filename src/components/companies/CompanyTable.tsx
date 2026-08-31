import { Pencil, Power, PowerOff } from 'lucide-react'
import type { Company } from '../../types/company'
import Badge from '../common/Badge'
import Button from '../common/Button'
import Spinner from '../common/Spinner'
import EmptyState from '../common/EmptyState'

interface CompanyTableProps {
  companies: Company[]
  isLoading: boolean
  isError: boolean
  onEdit: (company: Company) => void
  onToggleStatus: (company: Company) => void
  togglingCompanyId: string | null
}

const columns = ['Company', 'Code', 'Type', 'Industry', 'Location', 'Status', 'Created', 'Actions']

export default function CompanyTable({
  companies,
  isLoading,
  isError,
  onEdit,
  onToggleStatus,
  togglingCompanyId,
}: CompanyTableProps) {
  return (
    <div className="overflow-x-auto sap-scroll">
      <table className="w-full min-w-[760px] border-collapse">
        <thead>
          <tr className="border-b border-sap-border bg-sap-bg/60 text-left">
            {columns.map((col) => (
              <th key={col} className="whitespace-nowrap px-4 py-3 text-xs font-semibold uppercase tracking-wide text-sap-text-muted">
                {col}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {isLoading && (
            <tr>
              <td colSpan={columns.length} className="py-10">
                <div className="flex justify-center">
                  <Spinner />
                </div>
              </td>
            </tr>
          )}
          {isError && !isLoading && (
            <tr>
              <td colSpan={columns.length} className="py-10 text-center text-sm text-sap-danger">
                Couldn't load companies. Please try again.
              </td>
            </tr>
          )}
          {!isLoading && !isError && companies.length === 0 && (
            <tr>
              <td colSpan={columns.length}>
                <EmptyState title="No companies found" description="Try adjusting your search or filters." />
              </td>
            </tr>
          )}
          {!isLoading &&
            !isError &&
            companies.map((company) => (
              <tr key={company.id} className="border-b border-sap-border last:border-0 hover:bg-sap-bg/60">
                <td className="whitespace-nowrap px-4 py-3 text-sm font-medium text-sap-text">{company.companyName}</td>
                <td className="whitespace-nowrap px-4 py-3 text-sm text-sap-text-muted">{company.companyCode}</td>
                <td className="whitespace-nowrap px-4 py-3 text-sm text-sap-text-muted">{company.businessType}</td>
                <td className="whitespace-nowrap px-4 py-3 text-sm text-sap-text-muted">{company.industry}</td>
                <td className="whitespace-nowrap px-4 py-3 text-sm text-sap-text-muted">{company.city}, {company.country}</td>
                <td className="whitespace-nowrap px-4 py-3 text-sm">
                  <Badge tone={company.status === 'Active' ? 'success' : 'danger'} dot>
                    {company.status}
                  </Badge>
                </td>
                <td className="whitespace-nowrap px-4 py-3 text-sm text-sap-text-muted">{company.createdAt}</td>
                <td className="whitespace-nowrap px-4 py-3 text-sm">
                  <div className="flex items-center gap-1">
                    <Button variant="ghost" size="sm" onClick={() => onEdit(company)} aria-label="Edit company">
                      <Pencil size={16} />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onToggleStatus(company)}
                      isLoading={togglingCompanyId === company.id}
                      aria-label={company.status === 'Active' ? 'Deactivate company' : 'Activate company'}
                      className={company.status === 'Active' ? 'text-sap-danger' : 'text-sap-success'}
                    >
                      {company.status === 'Active' ? <PowerOff size={16} /> : <Power size={16} />}
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  )
}
