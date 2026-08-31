import Modal from '../common/Modal'
import BusinessUnitForm from './BusinessUnitForm'
import type { BusinessUnit } from '../../types/businessUnit'

interface BusinessUnitModalProps {
  open: boolean
  unit: BusinessUnit | null
  onClose: () => void
  onSaved: () => void
}

export default function BusinessUnitModal({ open, unit, onClose, onSaved }: BusinessUnitModalProps) {
  return (
    <Modal open={open} title={unit ? 'Edit Business Unit' : 'Create New Business Unit'} onClose={onClose} widthClass="max-w-2xl">
      <BusinessUnitForm unit={unit} onSuccess={onSaved} onCancel={onClose} />
    </Modal>
  )
}
