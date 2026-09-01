import Modal from '../common/Modal'
import LocationForm from './LocationForm'
import type { Location } from '../../types/location'

interface LocationModalProps {
  open: boolean
  location: Location | null
  onClose: () => void
  onSaved: () => void
}

export default function LocationModal({ open, location, onClose, onSaved }: LocationModalProps) {
  return (
    <Modal open={open} title={location ? 'Edit Location' : 'Create New Location'} onClose={onClose} widthClass="max-w-2xl">
      <LocationForm location={location} onSuccess={onSaved} onCancel={onClose} />
    </Modal>
  )
}
