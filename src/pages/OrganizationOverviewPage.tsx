import OrgStatCardGrid from '../components/orgOverview/OrgStatCardGrid'
import LocationsSummaryCard from '../components/orgOverview/LocationsSummaryCard'
import CompanySummaryTable from '../components/orgOverview/CompanySummaryTable'

export default function OrganizationOverviewPage() {
  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-xl font-semibold text-sap-text">Organization Management</h2>
        <p className="text-sm text-sap-text-muted">Platform-wide overview across companies, business units, departments, branches, cost centers, and locations.</p>
      </div>

      <OrgStatCardGrid />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        <LocationsSummaryCard />
      </div>

      <CompanySummaryTable />
    </div>
  )
}
