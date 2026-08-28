import Modal from '../common/Modal'
import EditTenantForm from './EditTenantForm'
import type { Tenant } from '../../types/tenant'

interface EditTenantModalProps {
  tenant: Tenant | null
  onClose: () => void
  onUpdated: () => void
}

export default function EditTenantModal({ tenant, onClose, onUpdated }: EditTenantModalProps) {
  return (
    <Modal open={tenant !== null} title="Edit Tenant" onClose={onClose}>
      {tenant && <EditTenantForm tenant={tenant} onSuccess={onUpdated} onCancel={onClose} />}
    </Modal>
  )
}