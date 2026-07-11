import { useState } from 'react'
import { Alert, Button, Card, Container, Form, InputGroup } from 'react-bootstrap'
import { useForm } from 'react-hook-form'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import type { LoginPayload } from '../../api/auth'
import { useAuth } from '../../hooks/useAuth'

type LocationState = { from?: { pathname?: string } }

const EyeIcon = ({ open }: { open: boolean }) =>
  open ? (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
    </svg>
  ) : (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
      <path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
    </svg>
  )

export function Login() {
  const { login, isLoading } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const state = location.state as LocationState | null
  const [error, setError] = useState<string | null>(null)
  const [showPassword, setShowPassword] = useState(false)

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<LoginPayload>()

  const onSubmit = async (payload: LoginPayload) => {
    setError(null)
    try {
      await login(payload)
      navigate(state?.from?.pathname ?? '/properties', { replace: true })
    } catch (e) {
      setError(e instanceof Error ? e.message : 'लगइन असफल भयो।')
    }
  }

  return (
    <Container className="auth-page py-5">
      <Card className="auth-card mx-auto border-0 shadow-sm">
        <Card.Body className="p-4 p-md-5">
          <p className="eyebrow text-primary">स्वागत छ</p>
          <h1 className="h2 fw-bold">लगइन</h1>
          <p className="text-muted mb-4">मनपर्ने सम्पत्तिहरू हेर्न लगइन गर्नुहोस्।</p>

          {error && (
            <Alert variant="danger" dismissible onClose={() => setError(null)}>
              {error}
            </Alert>
          )}

          <Form onSubmit={handleSubmit(onSubmit)} noValidate>

            {/* Email */}
            <Form.Group className="mb-3" controlId="login-email">
              <Form.Label className="fw-medium">
                इमेल <span className="text-danger">*</span>
              </Form.Label>
              <Form.Control
                type="email"
                autoComplete="email"
                placeholder="example@email.com"
                isInvalid={Boolean(errors.email)}
                isValid={Boolean(!errors.email && watch('email'))}
                {...register('email', {
                  required: 'इमेल आवश्यक छ।',
                  pattern: {
                    value: /^\S+@\S+\.\S+$/,
                    message: 'मान्य इमेल ठेगाना राख्नुहोस्।',
                  },
                })}
              />
              <Form.Control.Feedback type="invalid">{errors.email?.message}</Form.Control.Feedback>
            </Form.Group>

            {/* Password with show/hide */}
            <Form.Group className="mb-1" controlId="login-password">
              <div className="d-flex justify-content-between align-items-center mb-1">
                <Form.Label className="fw-medium mb-0">
                  पासवर्ड <span className="text-danger">*</span>
                </Form.Label>
                <Link to="/forgot-password" className="text-muted" style={{ fontSize: '0.82rem' }}>
                  पासवर्ड बिर्सनुभयो?
                </Link>
              </div>
              <InputGroup>
                <Form.Control
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  placeholder="तपाईंको पासवर्ड"
                  isInvalid={Boolean(errors.password)}
                  isValid={Boolean(!errors.password && watch('password'))}
                  {...register('password', {
                    required: 'पासवर्ड आवश्यक छ।',
                    minLength: { value: 1, message: 'पासवर्ड आवश्यक छ।' },
                  })}
                />
                <Button
                  variant="outline-secondary"
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  tabIndex={-1}
                  style={{ borderLeft: 'none', zIndex: 0 }}
                  title={showPassword ? 'Hide password' : 'Show password'}
                >
                  <EyeIcon open={showPassword} />
                </Button>
                <Form.Control.Feedback type="invalid">{errors.password?.message}</Form.Control.Feedback>
              </InputGroup>
            </Form.Group>

            <Button type="submit" disabled={isLoading} className="w-100 py-2 mt-4">
              {isLoading
                ? <><span className="spinner-border spinner-border-sm me-2" />लगइन हुँदैछ...</>
                : 'लगइन गर्नुहोस्'}
            </Button>
          </Form>

          <p className="mt-4 mb-0 text-center">
            नयाँ प्रयोगकर्ता? <Link to="/signup">खाता बनाउनुहोस्</Link>
          </p>
        </Card.Body>
      </Card>
    </Container>
  )
}
