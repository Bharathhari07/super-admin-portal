import { useQuery } from '@tanstack/react-query'
import { fetchTenantById } from '../../api/tenantApi'

// Fetches a single tenant by id, used by the Tenant Details view.
export function useTenant(id: string | null) {
  return useQuery({
    queryKey: ['tenant', id],
    queryFn: () => fetchTenantById(id as string),
    enabled: id !== null, // don't fire until a tenant is actually selected
  })
}