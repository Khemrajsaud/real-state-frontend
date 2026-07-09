import { useState } from 'react'
import { Alert, Button, Card, Container, Form } from 'react-bootstrap'
import { useForm } from 'react-hook-form'
import { Link, useNavigate } from 'react-router-dom'
import type { SignupPayload } from '../../api/auth'
import { useAuth } from '../../hooks/useAuth'

export function Signup() {
  const { signup, isLoading } = useAuth()
  const navigate = useNavigate()
  const [error, setError] = useState<string | null>(null)
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupPayload>()

  const onSubmit = async (payload: SignupPayload) => {
    setError(null)

    try {
      await signup(payload)
      navigate('/properties', { replace: true })
    } catch (caughtError) {
      setError(caughtError instanceof Error ? caughtError.message : 'Signup failed.')
    }
  }

  return (
    <Container className="auth-page py-5">
      <Card className="auth-card mx-auto border-0 shadow-sm">
        <Card.Body className="p-4 p-md-5">
          <p className="eyebrow text-primary">Create account</p>
          <h1 className="h2 fw-bold">Signup</h1>
          <p className="text-muted">Save properties and come back to them later.</p>
          {error ? <Alert variant="danger">{error}</Alert> : null}
          <Form onSubmit={handleSubmit(onSubmit)} noValidate>
            <Form.Group className="mb-3" controlId="signup-name">
              <Form.Label>Name</Form.Label>
              <Form.Control
                autoComplete="name"
                isInvalid={Boolean(errors.name)}
                {...register('name', { required: 'Name is required.' })}
              />
              <Form.Control.Feedback type="invalid">
                {errors.name?.message}
              </Form.Control.Feedback>
            </Form.Group>
            <Form.Group className="mb-3" controlId="signup-email">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                autoComplete="email"
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
            <Form.Group className="mb-3" controlId="signup-phone">
              <Form.Label>Phone</Form.Label>
              <Form.Control
                autoComplete="tel"
                isInvalid={Boolean(errors.phone)}
                {...register('phone', { required: 'Phone is required.' })}
              />
              <Form.Control.Feedback type="invalid">
                {errors.phone?.message}
              </Form.Control.Feedback>
            </Form.Group>
            <Form.Group className="mb-4" controlId="signup-password">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                autoComplete="new-password"
                isInvalid={Boolean(errors.password)}
                {...register('password', { required: 'Password is required.' })}
              />
              <Form.Control.Feedback type="invalid">
                {errors.password?.message}
              </Form.Control.Feedback>
            </Form.Group>
            <Button type="submit" disabled={isLoading} className="w-100">
              {isLoading ? 'Creating account...' : 'Signup'}
            </Button>
          </Form>
          <p className="mt-4 mb-0 text-center">
            Already have an account? <Link to="/login">Login</Link>
          </p>
        </Card.Body>
      </Card>
    </Container>
  )
}
