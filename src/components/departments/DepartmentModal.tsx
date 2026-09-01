import Modal from '../common/Modal'
import DepartmentForm from './DepartmentForm'
import type { Department } from '../../types/department'

interface DepartmentModalProps {
  open: boolean
  department: Department | null
  onClose: () => void
  onSaved: () => void
}

export default function DepartmentModal({ open, department, onClose, onSaved }: DepartmentModalProps) {
  return (
    <Modal open={open} title={department ? 'Edit Department' : 'Create New Department'} onClose={onClose} widthClass="max-w-2xl">
      <DepartmentForm department={department} onSuccess={onSaved} onCancel={onClose} />
    </Modal>
  )
}
