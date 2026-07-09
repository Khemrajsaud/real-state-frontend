import { getSubscribers } from '../../api/subscribers'
import { ReadOnlyTable } from './ReadOnlyTable'

type SubscriberRow = {
  email?: string
  isActive?: boolean
  [key: string]: unknown
}

export function Subscribers() {
  return (
    <ReadOnlyTable<SubscriberRow>
      title="Subscribers"
      queryKey={['admin', 'subscribers']}
      queryFn={getSubscribers}
      columns={[
        { label: 'Email', render: (item) => item.email },
        { label: 'Status', render: (item) => (item.isActive === false ? 'Inactive' : 'Active') },
      ]}
    />
  )
}
