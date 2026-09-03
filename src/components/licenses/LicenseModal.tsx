import Modal from '../common/Modal'
import LicenseForm from './LicenseForm'
import type { License } from '../../types/license'

interface LicenseModalProps {
  open: boolean
  license: License | null
  onClose: () => void
  onSaved: () => void
}

export default function LicenseModal({ open, license, onClose, onSaved }: LicenseModalProps) {
  return (
    <Modal open={open} title={license ? 'Edit License' : 'Create License'} onClose={onClose} widthClass="max-w-2xl">
      <LicenseForm license={license} onSuccess={onSaved} onCancel={onClose} />
    </Modal>
  )
}
