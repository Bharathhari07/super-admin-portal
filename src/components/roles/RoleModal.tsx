import Modal from '../common/Modal'
import RoleForm from './RoleForm'
import type { Role } from '../../types/role'

interface RoleModalProps {
  open: boolean
  role: Role | null
  onClose: () => void
  onSaved: () => void
}

export default function RoleModal({ open, role, onClose, onSaved }: RoleModalProps) {
  return (
    <Modal open={open} title={role ? 'Edit Role' : 'Create New Role'} onClose={onClose} widthClass="max-w-2xl">
      <RoleForm role={role} onSuccess={onSaved} onCancel={onClose} />
    </Modal>
  )
}
