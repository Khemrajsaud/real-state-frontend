import { useState } from 'react'
import { Alert, Button, Card, Container, Form } from 'react-bootstrap'
import { useForm } from 'react-hook-form'
import { useLocation, useNavigate } from 'react-router-dom'
import type { AdminLoginPayload } from '../../api/auth'
import { useAuth } from '../../hooks/useAuth'

type LocationState = {
  from?: {
    pathname?: string
  }
}

export function AdminLogin() {
  const { adminLogin, isLoading } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const state = location.state as LocationState | null
  const [error, setError] = useState<string | null>(null)
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AdminLoginPayload>()

  const onSubmit = async (payload: AdminLoginPayload) => {
    setError(null)

    try {
      await adminLogin(payload)
      navigate(state?.from?.pathname ?? '/admin', { replace: true })
    } catch (caughtError) {
      setError(caughtError instanceof Error ? caughtError.message : 'Admin login failed.')
    }
  }

  return (
    <Container className="auth-page py-5">
      <Card className="auth-card mx-auto border-0 shadow-sm">
        <Card.Body className="p-4 p-md-5">
          <p className="eyebrow text-primary">Admin</p>
          <h1 className="h2 fw-bold">Admin login</h1>
          {error ? <Alert variant="danger">{error}</Alert> : null}
          <Form onSubmit={handleSubmit(onSubmit)} noValidate>
            <Form.Group className="mb-3" controlId="admin-username">
              <Form.Label>Username</Form.Label>
              <Form.Control
                isInvalid={Boolean(errors.username)}
                {...register('username', { required: 'Username is required.' })}
              />
              <Form.Control.Feedback type="invalid">
                {errors.username?.message}
              </Form.Control.Feedback>
            </Form.Group>
            <Form.Group className="mb-4" controlId="admin-password">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
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
          </Form>
        </Card.Body>
      </Card>
    </Container>
  )
}
