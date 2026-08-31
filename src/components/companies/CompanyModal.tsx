import Modal from '../common/Modal'
import CompanyForm from './CompanyForm'
import type { Company } from '../../types/company'

interface CompanyModalProps {
  open: boolean
  company: Company | null
  onClose: () => void
  onSaved: () => void
}

export default function CompanyModal({ open, company, onClose, onSaved }: CompanyModalProps) {
  return (
    <Modal open={open} title={company ? 'Edit Company' : 'Create New Company'} onClose={onClose} widthClass="max-w-2xl">
      <CompanyForm company={company} onSuccess={onSaved} onCancel={onClose} />
    </Modal>
  )
}
