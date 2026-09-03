import Modal from '../common/Modal'
import RoleAssignmentForm from './RoleAssignmentForm'
import type { RoleAssignment } from '../../types/roleAssignment'

interface RoleAssignmentModalProps {
  open: boolean
  assignment: RoleAssignment | null
  onClose: () => void
  onSaved: () => void
}

export default function RoleAssignmentModal({ open, assignment, onClose, onSaved }: RoleAssignmentModalProps) {
  return (
    <Modal open={open} title={assignment ? 'Edit Role Assignment' : 'Assign Permission to Role'} onClose={onClose}>
      <RoleAssignmentForm assignment={assignment} onSuccess={onSaved} onCancel={onClose} />
    </Modal>
  )
}
