import { useQuery } from '@tanstack/react-query'
import { Badge, Card, Table } from 'react-bootstrap'
import { getAdminInquiries } from '../../api/auth'
import { Loader } from '../../components/common/Loader'
import { ErrorState } from '../../components/common/ErrorState'

type InquiryRow = {
  id?: number
  name?: string
  email?: string
  phone?: string
  message?: string
  createdAt?: string
  [key: string]: unknown
}

const extractPropertyName = (message?: string): string | null => {
  if (!message) return null
  const match = message.match(/^\[(.+?)\]/)
  return match ? match[1] : null
}

const stripPropertyPrefix = (message?: string): string => {
  if (!message) return '—'
  return message.replace(/^\[.+?\]\s*/, '')
}

const formatDate = (dateStr?: string) => {
  if (!dateStr) return '—'
  return new Date(dateStr).toLocaleString('en-NP', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export function Inquiries() {
  const { data = [], isLoading, isError } = useQuery<InquiryRow[]>({
    queryKey: ['admin', 'inquiries'],
    queryFn: getAdminInquiries as () => Promise<InquiryRow[]>,
  })

  return (
    <section>
      <p className="eyebrow text-primary">Admin</p>
      <h1 className="h2 fw-bold mb-4">Inquiries</h1>

      <Card className="border-0 shadow-sm">
        <Card.Header className="bg-white border-bottom py-3 d-flex align-items-center justify-content-between">
          <h5 className="mb-0 fw-semibold">All Inquiries</h5>
          <Badge bg="secondary">{data.length} total</Badge>
        </Card.Header>
        <Card.Body className="p-0">
          {isLoading && <div className="p-4"><Loader label="Loading inquiries..." /></div>}
          {isError && <div className="p-4"><ErrorState title="Could not load inquiries" /></div>}
          {!isLoading && !isError && data.length === 0 && (
            <div className="p-4 text-center text-muted">No inquiries yet.</div>
          )}
          {!isLoading && !isError && data.length > 0 && (
            <Table responsive hover className="admin-table bg-white mb-0">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Property</th>
                  <th>Message</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {data.map((item, index) => {
                  const propertyName = extractPropertyName(item.message)
                  const cleanMessage = stripPropertyPrefix(item.message)
                  return (
                    <tr key={item.id ?? index}>
                      <td className="text-muted small">{index + 1}</td>
                      <td className="fw-medium">{item.name ?? '—'}</td>
                      <td>
                        <a href={`mailto:${item.email}`} className="text-decoration-none small">
                          {item.email ?? '—'}
                        </a>
                      </td>
                      <td>
                        <a href={`tel:${item.phone}`} className="text-decoration-none small">
                          {item.phone ?? '—'}
                        </a>
                      </td>
                      <td>
                        {propertyName
                          ? <Badge bg="primary" className="fw-normal">{propertyName}</Badge>
                          : <span className="text-muted small">—</span>}
                      </td>
                      <td className="small" style={{ maxWidth: '280px' }}>
                        <span title={cleanMessage} className="d-block text-truncate" style={{ maxWidth: '260px' }}>
                          {cleanMessage}
                        </span>
                      </td>
                      <td className="text-muted small text-nowrap">{formatDate(item.createdAt)}</td>
                    </tr>
                  )
                })}
              </tbody>
            </Table>
          )}
        </Card.Body>
      </Card>
    </section>
  )
}
