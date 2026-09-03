import Modal from '../common/Modal'
import PermissionForm from './PermissionForm'
import type { Permission } from '../../types/permission'

interface PermissionModalProps {
  open: boolean
  permission: Permission | null
  onClose: () => void
  onSaved: () => void
}

export default function PermissionModal({ open, permission, onClose, onSaved }: PermissionModalProps) {
  return (
    <Modal open={open} title={permission ? 'Edit Permission' : 'Create New Permission'} onClose={onClose} widthClass="max-w-2xl">
      <PermissionForm permission={permission} onSuccess={onSaved} onCancel={onClose} />
    </Modal>
  )
}
