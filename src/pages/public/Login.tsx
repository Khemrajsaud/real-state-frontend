import { useState } from 'react'
import { Alert, Button, Card, Container, Form } from 'react-bootstrap'
import { useForm } from 'react-hook-form'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import type { LoginPayload } from '../../api/auth'
import { useAuth } from '../../hooks/useAuth'

type LocationState = {
  from?: {
    pathname?: string
  }
}

export function Login() {
  const { login, isLoading } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const state = location.state as LocationState | null
  const [error, setError] = useState<string | null>(null)
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginPayload>()

  const onSubmit = async (payload: LoginPayload) => {
    setError(null)

    try {
      await login(payload)
      navigate(state?.from?.pathname ?? '/properties', { replace: true })
    } catch (caughtError) {
      setError(caughtError instanceof Error ? caughtError.message : 'Login failed.')
    }
  }

  return (
    <Container className="auth-page py-5">
      <Card className="auth-card mx-auto border-0 shadow-sm">
        <Card.Body className="p-4 p-md-5">
          <p className="eyebrow text-primary">Welcome back</p>
          <h1 className="h2 fw-bold">Login</h1>
          <p className="text-muted">Sign in to save favorite properties.</p>
          {error ? <Alert variant="danger">{error}</Alert> : null}
          <Form onSubmit={handleSubmit(onSubmit)} noValidate>
            <Form.Group className="mb-3" controlId="login-email">
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
            <Form.Group className="mb-4" controlId="login-password">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                autoComplete="current-password"
                isInvalid={Boolean(errors.password)}
                {...register('password', { required: 'Password is required.' })}
              />
              <Form.Control.Feedback type="invalid">
                {errors.password?.message}
              </Form.Control.Feedback>
            </Form.Group>
            <Button type="submit" disabled={isLoading} className="w-100">
              {isLoading ? 'Signing in...' : 'Login'}
            </Button>
            <p className="mt-2 mb-0 text-end">
              <Link to="/forgot-password" className="text-muted" style={{ fontSize: '0.85rem' }}>Forgot password?</Link>
            </p>
          </Form>
          <p className="mt-4 mb-0 text-center">
            New here? <Link to="/signup">Create an account</Link>
          </p>
        </Card.Body>
      </Card>
    </Container>
  )
}
