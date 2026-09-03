import Spinner from '../components/common/Spinner'
import PlatformConfigForm from '../components/platformConfig/PlatformConfigForm'
import { usePlatformConfiguration } from '../hooks/queries/usePlatformConfiguration'

export default function PlatformConfigurationPage() {
  const { data, isLoading, isError, refetch } = usePlatformConfiguration()

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-xl font-semibold text-sap-text">Platform Configuration</h2>
        <p className="text-sm text-sap-text-muted">Global settings, session policies, and platform branding.</p>
      </div>

      {isLoading && (
        <div className="flex justify-center rounded-xl border border-sap-border bg-sap-surface py-16">
          <Spinner />
        </div>
      )}

      {isError && (
        <div className="rounded-xl border border-sap-border bg-sap-surface p-4 text-sm text-sap-danger">
          Couldn&apos;t load platform configuration.
        </div>
      )}

      {data && <PlatformConfigForm config={data} onSaved={() => refetch()} />}
    </div>
  )
}
