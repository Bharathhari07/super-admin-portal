import Badge from '../common/Badge'
import Spinner from '../common/Spinner'
import EmptyState from '../common/EmptyState'
import { useOrgOverview } from '../../hooks/queries/useOrgOverview'

const columns = ['Company', 'Business Units', 'Departments', 'Branches', 'Status']

export default function CompanySummaryTable() {
  const { data, isLoading, isError } = useOrgOverview()

  return (
    <div className="rounded-xl border border-sap-border bg-sap-surface p-5 shadow-sm">
      <h3 className="mb-4 text-sm font-semibold text-sap-text">Company Breakdown</h3>

      {isLoading && (
        <div className="flex justify-center py-8">
          <Spinner />
        </div>
      )}

      {isError && <p className="text-sm text-sap-danger">Couldn&apos;t load company breakdown.</p>}

      {data && data.companySummaries.length === 0 && <EmptyState title="No companies found" />}

      {data && data.companySummaries.length > 0 && (
        <div className="overflow-x-auto sap-scroll">
          <table className="w-full min-w-[560px] border-collapse">
            <thead>
              <tr className="border-b border-sap-border text-left">
                {columns.map((col) => (
                  <th key={col} className="whitespace-nowrap px-3 py-2 text-xs font-semibold uppercase tracking-wide text-sap-text-muted">
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.companySummaries.map((summary) => (
                <tr key={summary.companyId} className="border-b border-sap-border last:border-0">
                  <td className="whitespace-nowrap px-3 py-2 text-sm font-medium text-sap-text">{summary.companyName}</td>
                  <td className="whitespace-nowrap px-3 py-2 text-sm text-sap-text-muted">{summary.businessUnitCount}</td>
                  <td className="whitespace-nowrap px-3 py-2 text-sm text-sap-text-muted">{summary.departmentCount}</td>
                  <td className="whitespace-nowrap px-3 py-2 text-sm text-sap-text-muted">{summary.branchCount}</td>
                  <td className="whitespace-nowrap px-3 py-2 text-sm">
                    <Badge tone={summary.status === 'Active' ? 'success' : 'danger'} dot>
                      {summary.status}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
