import Modal from '../common/Modal'
import UserForm from './UserForm'
import type { PlatformUser } from '../../types/user'

interface UserModalProps {
  open: boolean
  user: PlatformUser | null
  onClose: () => void
  onSaved: () => void
}

export default function UserModal({ open, user, onClose, onSaved }: UserModalProps) {
  return (
    <Modal open={open} title={user ? 'Edit User' : 'Register New User'} onClose={onClose} widthClass="max-w-2xl">
      {/* key forces React to fully remount the form (fresh internal state)
          whenever the target user changes, or when switching between
          editing an existing user and registering a brand new one */}
      <UserForm key={user?.id ?? 'new'} user={user} onSuccess={onSaved} onCancel={onClose} />
    </Modal>
  )
}