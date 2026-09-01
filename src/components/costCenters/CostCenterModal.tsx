import Modal from '../common/Modal'
import CostCenterForm from './CostCenterForm'
import type { CostCenter } from '../../types/costCenter'

interface CostCenterModalProps {
  open: boolean
  center: CostCenter | null
  onClose: () => void
  onSaved: () => void
}

export default function CostCenterModal({ open, center, onClose, onSaved }: CostCenterModalProps) {
  return (
    <Modal open={open} title={center ? 'Edit Cost Center' : 'Create New Cost Center'} onClose={onClose} widthClass="max-w-2xl">
      <CostCenterForm center={center} onSuccess={onSaved} onCancel={onClose} />
    </Modal>
  )
}
