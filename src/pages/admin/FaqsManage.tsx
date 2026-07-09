import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useEffect, useState } from 'react'
import { Alert, Button, Card, Col, Form, Row, Table } from 'react-bootstrap'
import { useForm } from 'react-hook-form'
import {
  createFaq,
  deleteFaq,
  getFaqs,
  updateFaq,
  type Faq,
  type FaqFormPayload,
} from '../../api/faqs'
import { Loader } from '../../components/common/Loader'

const emptyFaqForm: FaqFormPayload = {
  question: '',
  answer: '',
  category: '',
}

export function FaqsManage() {
  const queryClient = useQueryClient()
  const [editingFaq, setEditingFaq] = useState<Faq | null>(null)
  const [message, setMessage] = useState<string | null>(null)
  const { data = [], isLoading } = useQuery({ queryKey: ['faqs'], queryFn: getFaqs })
  const { register, handleSubmit, reset } = useForm<FaqFormPayload>({
    defaultValues: emptyFaqForm,
  })

  useEffect(() => {
    reset(
      editingFaq
        ? {
            question: editingFaq.question ?? '',
            answer: editingFaq.answer ?? '',
            category: editingFaq.category ?? '',
          }
        : emptyFaqForm,
    )
  }, [editingFaq, reset])

  const saveMutation = useMutation({
    mutationFn: (payload: FaqFormPayload) => {
      const faqId = editingFaq?._id ?? editingFaq?.id
      return faqId ? updateFaq(faqId, payload) : createFaq(payload)
    },
    onSuccess: async () => {
      setMessage('FAQ saved.')
      setEditingFaq(null)
      await queryClient.invalidateQueries({ queryKey: ['faqs'] })
    },
  })
  const deleteMutation = useMutation({
    mutationFn: deleteFaq,
    onSuccess: async () => {
      setMessage('FAQ deleted.')
      await queryClient.invalidateQueries({ queryKey: ['faqs'] })
    },
  })

  return (
    <section>
      <p className="eyebrow text-primary">Admin</p>
      <h1 className="h2 fw-bold mb-4">Manage FAQs</h1>
      {message ? <Alert variant="success">{message}</Alert> : null}
      {saveMutation.isError ? <Alert variant="danger">FAQ save failed.</Alert> : null}
      <Card className="border-0 shadow-sm mb-4">
        <Card.Body>
          <Form onSubmit={handleSubmit((payload) => saveMutation.mutate(payload))}>
            <Row className="g-3">
              <Col md={6}>
                <Form.Label>Question</Form.Label>
                <Form.Control {...register('question', { required: true })} />
              </Col>
              <Col md={6}>
                <Form.Label>Category</Form.Label>
                <Form.Control {...register('category', { required: true })} />
              </Col>
              <Col md={12}>
                <Form.Label>Answer</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  {...register('answer', { required: true })}
                />
              </Col>
            </Row>
            <div className="mt-3 d-flex gap-2">
              <Button type="submit" disabled={saveMutation.isPending}>
                {editingFaq ? 'Update FAQ' : 'Create FAQ'}
              </Button>
              {editingFaq ? (
                <Button variant="outline-secondary" onClick={() => setEditingFaq(null)}>
                  Cancel
                </Button>
              ) : null}
            </div>
          </Form>
        </Card.Body>
      </Card>
      {isLoading ? <Loader /> : null}
      <Table responsive hover className="admin-table bg-white">
        <thead>
          <tr>
            <th>Question</th>
            <th>Category</th>
            <th />
          </tr>
        </thead>
        <tbody>
          {data.map((faq) => {
            const faqId = faq._id ?? faq.id
            return (
              <tr key={String(faqId ?? faq.question)}>
                <td>{faq.question}</td>
                <td>{faq.category}</td>
                <td className="text-end">
                  <Button size="sm" variant="outline-primary" onClick={() => setEditingFaq(faq)}>
                    Edit
                  </Button>{' '}
                  <Button
                    size="sm"
                    variant="outline-danger"
                    disabled={!faqId || deleteMutation.isPending}
                    onClick={() => faqId && deleteMutation.mutate(faqId)}
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
