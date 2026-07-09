import { getAdminInquiries } from '../../api/auth'
import { ReadOnlyTable } from './ReadOnlyTable'

type InquiryRow = {
  name?: string
  email?: string
  phone?: string
  message?: string
  [key: string]: unknown
}

export function Inquiries() {
  return (
    <ReadOnlyTable<InquiryRow>
      title="Inquiries"
      queryKey={['admin', 'inquiries']}
      queryFn={getAdminInquiries}
      columns={[
        { label: 'Name', render: (item) => item.name },
        { label: 'Email', render: (item) => item.email },
        { label: 'Phone', render: (item) => item.phone },
        { label: 'Message', render: (item) => item.message },
      ]}
    />
  )
}
