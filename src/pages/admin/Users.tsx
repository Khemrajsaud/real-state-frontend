import { getAdminUsers } from '../../api/auth'
import { ReadOnlyTable } from './ReadOnlyTable'

type UserRow = {
  name?: string
  email?: string
  phone?: string
  [key: string]: unknown
}

export function Users() {
  return (
    <ReadOnlyTable<UserRow>
      title="Users"
      queryKey={['admin', 'users']}
      queryFn={getAdminUsers}
      columns={[
        { label: 'Name', render: (item) => item.name },
        { label: 'Email', render: (item) => item.email },
        { label: 'Phone', render: (item) => item.phone },
      ]}
    />
  )
}
