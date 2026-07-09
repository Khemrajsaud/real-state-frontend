import { useQueries } from '@tanstack/react-query'
import { Card, Col, Row } from 'react-bootstrap'
import { getAdminInquiries, getAdminUsers } from '../../api/auth'
import { getProperties } from '../../api/properties'
import { getSubscribers } from '../../api/subscribers'

export function Dashboard() {
  const [propertiesQuery, inquiriesQuery, subscribersQuery, usersQuery] = useQueries({
    queries: [
      { queryKey: ['admin', 'properties'], queryFn: getProperties },
      { queryKey: ['admin', 'inquiries'], queryFn: getAdminInquiries },
      { queryKey: ['admin', 'subscribers'], queryFn: getSubscribers },
      { queryKey: ['admin', 'users'], queryFn: getAdminUsers },
    ],
  })

  const cards = [
    { label: 'Properties', value: propertiesQuery.data?.length ?? 0 },
    { label: 'Inquiries', value: inquiriesQuery.data?.length ?? 0 },
    { label: 'Subscribers', value: subscribersQuery.data?.length ?? 0 },
    { label: 'Users', value: usersQuery.data?.length ?? 0 },
  ]

  return (
    <section>
      <p className="eyebrow text-primary">Admin</p>
      <h1 className="h2 fw-bold mb-4">Dashboard</h1>
      <Row xs={1} md={2} xl={4} className="g-4 mt-2">
        {cards.map((card) => (
          <Col key={card.label}>
            <Card className="admin-card border-0 shadow-sm h-100 rounded-4" style={{ background: 'linear-gradient(145deg, #ffffff, #f8fafc)' }}>
              <Card.Body className="p-4 d-flex flex-column justify-content-center align-items-center text-center">
                <p className="mb-2 text-muted fw-bold text-uppercase" style={{ letterSpacing: '0.05em', fontSize: '0.85rem' }}>{card.label}</p>
                <strong className="text-primary display-5 fw-bold">{card.value}</strong>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </section>
  )
}
