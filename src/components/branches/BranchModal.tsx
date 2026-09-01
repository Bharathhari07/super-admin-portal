import Modal from '../common/Modal'
import BranchForm from './BranchForm'
import type { Branch } from '../../types/branch'

interface BranchModalProps {
  open: boolean
  branch: Branch | null
  onClose: () => void
  onSaved: () => void
}

export default function BranchModal({ open, branch, onClose, onSaved }: BranchModalProps) {
  return (
    <Modal open={open} title={branch ? 'Edit Branch' : 'Create New Branch'} onClose={onClose} widthClass="max-w-2xl">
      <BranchForm branch={branch} onSuccess={onSaved} onCancel={onClose} />
    </Modal>
  )
}
