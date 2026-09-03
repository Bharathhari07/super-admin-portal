import Modal from '../common/Modal'
import FeatureForm from './FeatureForm'
import type { Feature } from '../../types/feature'

interface FeatureModalProps {
  open: boolean
  feature: Feature | null
  onClose: () => void
  onSaved: () => void
}

export default function FeatureModal({ open, feature, onClose, onSaved }: FeatureModalProps) {
  return (
    <Modal open={open} title={feature ? 'Edit Feature' : 'Create Feature'} onClose={onClose} widthClass="max-w-2xl">
      <FeatureForm feature={feature} onSuccess={onSaved} onCancel={onClose} />
    </Modal>
  )
}
