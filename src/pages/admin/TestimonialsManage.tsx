import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Alert, Button, Card, Col, Form, Row, Table } from 'react-bootstrap'
import { useForm } from 'react-hook-form'
import {
  createTestimonial,
  deleteTestimonial,
  getTestimonialAvatar,
  getTestimonials,
  type TestimonialFormPayload,
} from '../../api/testimonials'
import { Loader } from '../../components/common/Loader'

export function TestimonialsManage() {
  const queryClient = useQueryClient()
  const { data = [], isLoading } = useQuery({
    queryKey: ['testimonials'],
    queryFn: getTestimonials,
  })
  const { register, handleSubmit, reset } = useForm<TestimonialFormPayload>()
  const saveMutation = useMutation({
    mutationFn: createTestimonial,
    onSuccess: async () => {
      reset()
      await queryClient.invalidateQueries({ queryKey: ['testimonials'] })
    },
  })
  const deleteMutation = useMutation({
    mutationFn: deleteTestimonial,
    onSuccess: async () => queryClient.invalidateQueries({ queryKey: ['testimonials'] }),
  })

  return (
    <section>
      <p className="eyebrow text-primary">Admin</p>
      <h1 className="h2 fw-bold mb-4">Manage testimonials</h1>
      {saveMutation.isSuccess ? <Alert variant="success">Testimonial saved.</Alert> : null}
      {saveMutation.isError ? <Alert variant="danger">Testimonial save failed.</Alert> : null}
      <Card className="border-0 shadow-sm mb-4">
        <Card.Body>
          <Form onSubmit={handleSubmit((payload) => saveMutation.mutate(payload))}>
            <Row className="g-3">
              <Col md={4}>
                <Form.Label>Client name</Form.Label>
                <Form.Control {...register('clientName', { required: true })} />
              </Col>
              <Col md={4}>
                <Form.Label>Role</Form.Label>
                <Form.Control {...register('role', { required: true })} />
              </Col>
              <Col md={4}>
                <Form.Label>Company</Form.Label>
                <Form.Control {...register('company', { required: true })} />
              </Col>
              <Col md={3}>
                <Form.Label>Rating</Form.Label>
                <Form.Control type="number" min="1" max="5" {...register('rating', { required: true })} />
              </Col>
              <Col md={9}>
                <Form.Label>Avatar</Form.Label>
                <Form.Control type="file" accept="image/*" {...register('avatar')} />
              </Col>
              <Col md={12}>
                <Form.Label>Message</Form.Label>
                <Form.Control as="textarea" rows={3} {...register('message', { required: true })} />
              </Col>
            </Row>
            <Button type="submit" className="mt-3" disabled={saveMutation.isPending}>
              {saveMutation.isPending ? 'Saving...' : 'Create testimonial'}
            </Button>
          </Form>
        </Card.Body>
      </Card>
      {isLoading ? <Loader /> : null}
      <Table responsive hover className="admin-table bg-white">
        <thead>
          <tr>
            <th>Client</th>
            <th>Message</th>
            <th />
          </tr>
        </thead>
        <tbody>
          {data.map((testimonial) => {
            const testimonialId = testimonial._id ?? testimonial.id
            const avatar = getTestimonialAvatar(testimonial)
            return (
              <tr key={String(testimonialId ?? testimonial.clientName)}>
                <td>
                  <div className="d-flex align-items-center gap-2">
                    {avatar ? <img className="admin-avatar" src={avatar} alt="" /> : null}
                    <span>{testimonial.clientName}</span>
                  </div>
                </td>
                <td>{testimonial.message}</td>
                <td className="text-end">
                  <Button
                    size="sm"
                    variant="outline-danger"
                    disabled={!testimonialId || deleteMutation.isPending}
                    onClick={() => testimonialId && deleteMutation.mutate(testimonialId)}
                  >
                    Delete
                  </Button>
                </td>
              </tr>
            )
          })}
        </tbody>
      </Table>
    </section>
  )
}
