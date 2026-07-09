import { useState } from 'react'
import { Alert, Button, Form, InputGroup } from 'react-bootstrap'
import { useForm } from 'react-hook-form'
import { subscribeRequest, type SubscribePayload } from '../../api/subscribers'

export function NewsletterForm() {
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [message, setMessage] = useState<string | null>(null)
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<SubscribePayload>()

  const onSubmit = async (payload: SubscribePayload) => {
    setStatus('idle')
    setMessage(null)

    try {
      const response = await subscribeRequest(payload)
      setStatus('success')
      setMessage(response.message ?? 'Thanks for subscribing.')
      reset()
    } catch (caughtError) {
      setStatus('error')
      setMessage(
        caughtError instanceof Error ? caughtError.message : 'Subscription failed.',
      )
    }
  }

  return (
    <Form onSubmit={handleSubmit(onSubmit)} noValidate>
      {message ? (
        <Alert variant={status === 'success' ? 'success' : 'danger'}>{message}</Alert>
      ) : null}
      <InputGroup>
        <Form.Control
          type="email"
          placeholder="Your email"
          aria-label="Email address"
          isInvalid={Boolean(errors.email)}
          {...register('email', {
            required: 'Email is required.',
            pattern: {
              value: /^\S+@\S+\.\S+$/,
              message: 'Enter a valid email.',
            },
          })}
        />
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Subscribing...' : 'Subscribe'}
        </Button>
        <Form.Control.Feedback type="invalid">
          {errors.email?.message}
        </Form.Control.Feedback>
      </InputGroup>
    </Form>
  )
}
