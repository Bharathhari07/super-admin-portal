import Spinner from '../components/common/Spinner'
import SecuritySettingsForm from '../components/security/SecuritySettingsForm'
import { useSecuritySettings } from '../hooks/queries/useSecuritySettings'

export default function SecurityPage() {
  const { data, isLoading, isError, refetch } = useSecuritySettings()

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-xl font-semibold text-sap-text">Security</h2>
        <p className="text-sm text-sap-text-muted">Password policy, account lockout, MFA enforcement, and session limits.</p>
      </div>

      {isLoading && (
        <div className="flex justify-center rounded-xl border border-sap-border bg-sap-surface py-16">
          <Spinner />
        </div>
      )}

      {isError && (
        <div className="rounded-xl border border-sap-border bg-sap-surface p-4 text-sm text-sap-danger">
          Couldn&apos;t load security settings.
        </div>
      )}

      {data && <SecuritySettingsForm settings={data} onSaved={() => refetch()} />}
    </div>
  )
}
