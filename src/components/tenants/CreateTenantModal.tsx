import Modal from '../common/Modal'
import CreateTenantForm from './CreateTenantForm'

interface CreateTenantModalProps {
  open: boolean
  onClose: () => void
  onCreated: () => void
}

export default function CreateTenantModal({ open, onClose, onCreated }: CreateTenantModalProps) {
  return (
    <Modal open={open} title="Create New Tenant" onClose={onClose}>
      <CreateTenantForm onSuccess={onCreated} onCancel={onClose} />
    </Modal>
  )
}