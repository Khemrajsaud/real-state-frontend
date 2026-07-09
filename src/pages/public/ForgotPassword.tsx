import { useState } from 'react'
import { Alert, Button, Card, Container, Form } from 'react-bootstrap'
import { useForm } from 'react-hook-form'
import { Link, useNavigate } from 'react-router-dom'
import {
  forgotPasswordRequest,
  resetPasswordRequest,
  type ForgotPasswordPayload,
  type ResetPasswordPayload,
} from '../../api/auth'

type Step = 'email' | 'otp' | 'reset' | 'done'

export function ForgotPassword() {
  const navigate = useNavigate()
  const [step, setStep] = useState<Step>('email')
  const [submittedEmail, setSubmittedEmail] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [isPending, setIsPending] = useState(false)

  const emailForm = useForm<ForgotPasswordPayload>()

  const onRequestOTP = async (payload: ForgotPasswordPayload) => {
    setError(null)
    setIsPending(true)
    try {
      await forgotPasswordRequest(payload)
      setSubmittedEmail(payload.email)
      setStep('otp')
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Could not send OTP. Please try again.')
    } finally {
      setIsPending(false)
    }
  }

  type ResetForm = { code: string; newPassword: string; confirmPassword: string }
  const resetForm = useForm<ResetForm>()
  const newPassword = resetForm.watch('newPassword')

  const onResetPassword = async (data: ResetForm) => {
    setError(null)
    setIsPending(true)
    try {
      const payload: ResetPasswordPayload = {
        email: submittedEmail,
        code: data.code,
        newPassword: data.newPassword,
        confirmPassword: data.confirmPassword,
      }
      await resetPasswordRequest(payload)
      setStep('done')
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Could not reset password. Please try again.')
    } finally {
      setIsPending(false)
    }
  }

  const StepIndicator = () => (
    <div className="d-flex gap-2 justify-content-center mb-4">
      {(['email', 'otp', 'reset'] as Step[]).map((s, i) => (
        <div
          key={s}
          style={{
            width: 28,
            height: 28,
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '0.78rem',
            fontWeight: 700,
            background:
              step === s
                ? 'var(--bs-primary)'
                : ['email', 'otp', 'reset'].indexOf(step) > i
                  ? '#198754'
                  : '#dee2e6',
            color:
              step === s || ['email', 'otp', 'reset'].indexOf(step) > i ? '#fff' : '#6c757d',
            transition: 'all 0.3s ease',
          }}
        >
          {['email', 'otp', 'reset'].indexOf(step) > i ? '✓' : i + 1}
        </div>
      ))}
    </div>
  )

  return (
    <Container className="auth-page py-5">
      <Card className="auth-card mx-auto border-0 shadow-sm">
        <Card.Body className="p-4 p-md-5">

          {step === 'done' && (
            <div className="text-center py-3">
              <div style={{ fontSize: '3.5rem' }}>✅</div>
              <h1 className="h3 fw-bold mt-3 mb-2">Password Reset!</h1>
              <p className="text-muted mb-4">
                Your password has been updated successfully. You can now log in with your new password.
              </p>
              <Button className="w-100" onClick={() => navigate('/login')}>
                Go to Login
              </Button>
            </div>
          )}

          {step === 'email' && (
            <>
              <StepIndicator />
              <p className="eyebrow text-primary">Password Recovery</p>
              <h1 className="h2 fw-bold">Forgot Password?</h1>
              <p className="text-muted mb-4">
                Enter your registered email address and we'll send you a 6-digit OTP code.
              </p>
              {error && <Alert variant="danger">{error}</Alert>}
              <Form onSubmit={emailForm.handleSubmit(onRequestOTP)} noValidate>
                <Form.Group className="mb-4" controlId="forgot-email">
                  <Form.Label>Email address</Form.Label>
                  <Form.Control
                    type="email"
                    autoComplete="email"
                    placeholder="you@email.com"
                    isInvalid={Boolean(emailForm.formState.errors.email)}
                    {...emailForm.register('email', {
                      required: 'Email is required.',
                      pattern: { value: /^\S+@\S+\.\S+$/, message: 'Enter a valid email.' },
                    })}
                  />
                  <Form.Control.Feedback type="invalid">
                    {emailForm.formState.errors.email?.message}
                  </Form.Control.Feedback>
                </Form.Group>
                <Button type="submit" className="w-100" disabled={isPending}>
                  {isPending ? 'Sending OTP...' : 'Send OTP Code'}
                </Button>
              </Form>
            </>
          )}

          {(step === 'otp' || step === 'reset') && (
            <>
              <StepIndicator />
              <p className="eyebrow text-primary">Password Recovery</p>
              <h1 className="h2 fw-bold">Reset Password</h1>
              <p className="text-muted mb-4">
                We sent a 6-digit code to <strong>{submittedEmail}</strong>. Enter it below along with your new password.
              </p>
              {error && <Alert variant="danger">{error}</Alert>}
              <Form onSubmit={resetForm.handleSubmit(onResetPassword)} noValidate>
                <Form.Group className="mb-3" controlId="forgot-code">
                  <Form.Label>6-Digit OTP Code</Form.Label>
                  <Form.Control
                    type="text"
                    inputMode="numeric"
                    maxLength={6}
                    placeholder="••••••"
                    isInvalid={Boolean(resetForm.formState.errors.code)}
                    style={{ letterSpacing: '0.3em', fontSize: '1.2rem', textAlign: 'center' }}
                    {...resetForm.register('code', {
                      required: 'OTP code is required.',
                      pattern: { value: /^\d{6}$/, message: 'Must be exactly 6 digits.' },
                    })}
                  />
                  <Form.Control.Feedback type="invalid">
                    {resetForm.formState.errors.code?.message}
                  </Form.Control.Feedback>
                </Form.Group>
                <Form.Group className="mb-3" controlId="forgot-new-password">
                  <Form.Label>New Password</Form.Label>
                  <Form.Control
                    type="password"
                    autoComplete="new-password"
                    isInvalid={Boolean(resetForm.formState.errors.newPassword)}
                    {...resetForm.register('newPassword', {
                      required: 'New password is required.',
                      minLength: { value: 8, message: 'Must be at least 8 characters.' },
                      pattern: {
                        value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>])/,
                        message: 'Must include uppercase, lowercase, number & special character.',
                      },
                    })}
                  />
                  <Form.Control.Feedback type="invalid">
                    {resetForm.formState.errors.newPassword?.message}
                  </Form.Control.Feedback>
                </Form.Group>
                <Form.Group className="mb-4" controlId="forgot-confirm-password">
                  <Form.Label>Confirm New Password</Form.Label>
                  <Form.Control
                    type="password"
                    autoComplete="new-password"
                    isInvalid={Boolean(resetForm.formState.errors.confirmPassword)}
                    {...resetForm.register('confirmPassword', {
                      required: 'Please confirm your password.',
                      validate: (v) => v === newPassword || 'Passwords do not match.',
                    })}
                  />
                  <Form.Control.Feedback type="invalid">
                    {resetForm.formState.errors.confirmPassword?.message}
                  </Form.Control.Feedback>
                </Form.Group>
                <Button type="submit" className="w-100" disabled={isPending}>
                  {isPending ? 'Resetting...' : 'Reset Password'}
                </Button>
              </Form>
              <p className="mt-3 mb-0 text-center text-muted" style={{ fontSize: '0.85rem' }}>
                Didn't receive the code?{' '}
                <button
                  type="button"
                  className="btn btn-link p-0 text-primary"
                  style={{ fontSize: '0.85rem' }}
                  onClick={() => { setStep('email'); setError(null) }}
                >
                  Try again
                </button>
              </p>
            </>
          )}

          {step !== 'done' && (
            <p className="mt-4 mb-0 text-center">
              <Link to="/login">← Back to Login</Link>
            </p>
          )}
        </Card.Body>
      </Card>
    </Container>
  )
}
