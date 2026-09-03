import Modal from '../common/Modal'
import DataPermissionForm from './DataPermissionForm'
import type { DataPermission } from '../../types/dataPermission'

interface DataPermissionModalProps {
  open: boolean
  permission: DataPermission | null
  onClose: () => void
  onSaved: () => void
}

export default function DataPermissionModal({ open, permission, onClose, onSaved }: DataPermissionModalProps) {
  return (
    <Modal open={open} title={permission ? 'Edit Data Permission' : 'Create Data Permission'} onClose={onClose} widthClass="max-w-2xl">
      <DataPermissionForm permission={permission} onSuccess={onSaved} onCancel={onClose} />
    </Modal>
  )
}
