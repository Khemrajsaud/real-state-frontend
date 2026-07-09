import { useState } from 'react'
import { Alert, Button, Card, Col, Container, Form, Row } from 'react-bootstrap'
import { useForm } from 'react-hook-form'
import { submitInquiryRequest, type InquiryPayload } from '../../api/auth'
import { companyInfo } from '../../constants/companyInfo'

export function Contact() {
  const [message, setMessage] = useState<string | null>(null)
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<InquiryPayload>()

  const onSubmit = async (payload: InquiryPayload) => {
    setStatus('idle')
    setMessage(null)

    try {
      const response = await submitInquiryRequest(payload)
      setStatus('success')
      setMessage(response.message ?? 'Your inquiry has been sent.')
      reset()
    } catch (caughtError) {
      setStatus('error')
      setMessage(caughtError instanceof Error ? caughtError.message : 'Inquiry failed.')
    }
  }

  return (
    <main>
      <Container className="py-5">
        <Row className="g-4 align-items-start">
          <Col lg={5}>
            <p className="eyebrow text-primary">Contact</p>
            <h1 className="display-6 fw-bold">हामीलाई सम्पर्क गर्नुहोस्।</h1>
            <p className="text-muted">
              {companyInfo.shortIntroNp}
            </p>
            <div className="contact-details">
              <span>{companyInfo.addressNp}</span>
              <span>WhatsApp: {companyInfo.whatsapp}</span>
              <span>फोन: {companyInfo.phones.join(' / ')}</span>
              <span>Email: {companyInfo.email}</span>
            </div>
          </Col>
          <Col lg={7}>
            <Card className="border-0 shadow-sm">
              <Card.Body className="p-4 p-md-5">
                {message ? (
                  <Alert variant={status === 'success' ? 'success' : 'danger'}>
                    {message}
                  </Alert>
                ) : null}
                <Form onSubmit={handleSubmit(onSubmit)} noValidate>
                  <Row className="g-3">
                    <Col md={6}>
                      <Form.Group controlId="contact-name">
                        <Form.Label>Name</Form.Label>
                        <Form.Control
                          isInvalid={Boolean(errors.name)}
                          {...register('name', { required: 'Name is required.' })}
                        />
                        <Form.Control.Feedback type="invalid">
                          {errors.name?.message}
                        </Form.Control.Feedback>
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group controlId="contact-phone">
                        <Form.Label>Phone</Form.Label>
                        <Form.Control
                          isInvalid={Boolean(errors.phone)}
                          {...register('phone', { required: 'Phone is required.' })}
                        />
                        <Form.Control.Feedback type="invalid">
                          {errors.phone?.message}
                        </Form.Control.Feedback>
                      </Form.Group>
                    </Col>
                    <Col md={12}>
                      <Form.Group controlId="contact-email">
                        <Form.Label>Email</Form.Label>
                        <Form.Control
                          type="email"
                          isInvalid={Boolean(errors.email)}
                          {...register('email', {
                            required: 'Email is required.',
                            pattern: {
                              value: /^\S+@\S+\.\S+$/,
                              message: 'Enter a valid email.',
                            },
                          })}
                        />
                        <Form.Control.Feedback type="invalid">
                          {errors.email?.message}
                        </Form.Control.Feedback>
                      </Form.Group>
                    </Col>
                    <Col md={12}>
                      <Form.Group controlId="contact-message">
                        <Form.Label>Message</Form.Label>
                        <Form.Control
                          as="textarea"
                          rows={5}
                          isInvalid={Boolean(errors.message)}
                          {...register('message', {
                            required: 'Message is required.',
                          })}
                        />
                        <Form.Control.Feedback type="invalid">
                          {errors.message?.message}
                        </Form.Control.Feedback>
                      </Form.Group>
                    </Col>
                  </Row>
                  <Button type="submit" className="mt-4" disabled={isSubmitting}>
                    {isSubmitting ? 'Sending...' : 'Send inquiry'}
                  </Button>
                </Form>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </main>
  )
}
