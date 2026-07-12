import { useState } from 'react'
import { Alert, Button, Card, Container, Form, InputGroup } from 'react-bootstrap'
import { useForm } from 'react-hook-form'
import { Link, useNavigate } from 'react-router-dom'
import type { SignupPayload } from '../../api/auth'
import { useAuth } from '../../hooks/useAuth'
import { useLanguage } from '../../context/LanguageContext'

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

export function Signup() {
  const { signup, isLoading } = useAuth()
  const { t, language } = useLanguage()
  const isNp = language === 'np'
  const navigate = useNavigate()
  const [error, setError] = useState<string | null>(null)
  const [showPassword, setShowPassword] = useState(false)

  const { register, handleSubmit, watch, formState: { errors } } = useForm<SignupPayload>()
  const passwordValue = watch('password', '')

  const strength = {
    length: passwordValue.length >= 6,
    upper: /[A-Z]/.test(passwordValue),
    lower: /[a-z]/.test(passwordValue),
    number: /[0-9]/.test(passwordValue),
  }
  const strengthScore = Object.values(strength).filter(Boolean).length
  const strengthLabels = isNp
    ? ['', 'कमजोर', 'ठीकै', 'राम्रो', 'बलियो']
    : ['', 'Weak', 'Fair', 'Good', 'Strong']
  const strengthColor = ['', '#ef4444', '#f97316', '#eab308', '#22c55e'][strengthScore]

  const onSubmit = async (payload: SignupPayload) => {
    setError(null)
    try {
      await signup(payload)
      navigate('/login', { replace: true })
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Signup failed.')
    }
  }

  return (
    <Container className="auth-page py-5">
      <Card className="auth-card mx-auto border-0 shadow-sm">
        <Card.Body className="p-4 p-md-5">
          <p className="eyebrow text-primary">{t('signupEyebrow')}</p>
          <h1 className="h2 fw-bold">{t('signupTitle')}</h1>
          <p className="text-muted mb-4">{t('signupSubtitle')}</p>

          {error && <Alert variant="danger" dismissible onClose={() => setError(null)}>{error}</Alert>}

          <Form onSubmit={handleSubmit(onSubmit)} noValidate>
            <Form.Group className="mb-3" controlId="signup-name">
              <Form.Label className="fw-medium">
                {t('signupName')} <span className="text-danger">*</span>
              </Form.Label>
              <Form.Control
                autoComplete="name"
                placeholder={isNp ? 'तपाईंको पूरा नाम' : 'Your full name'}
                isInvalid={Boolean(errors.name)}
                isValid={Boolean(!errors.name && watch('name'))}
                {...register('name', {
                  required: isNp ? 'नाम आवश्यक छ।' : 'Name is required.',
                  minLength: { value: 2, message: isNp ? 'नाम कम्तिमा २ अक्षर हुनुपर्छ।' : 'Name must be at least 2 characters.' },
                  maxLength: { value: 60, message: isNp ? 'नाम ६० अक्षरभन्दा बढी हुन सक्दैन।' : 'Name too long.' },
                })}
              />
              <Form.Control.Feedback type="invalid">{errors.name?.message}</Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3" controlId="signup-email">
              <Form.Label className="fw-medium">
                {t('signupEmail')} <span className="text-danger">*</span>
              </Form.Label>
              <Form.Control
                type="email"
                autoComplete="email"
                placeholder="example@email.com"
                isInvalid={Boolean(errors.email)}
                isValid={Boolean(!errors.email && watch('email'))}
                {...register('email', {
                  required: isNp ? 'इमेल आवश्यक छ।' : 'Email is required.',
                  pattern: { value: /^\S+@\S+\.\S+$/, message: isNp ? 'मान्य इमेल राख्नुहोस्।' : 'Enter a valid email.' },
                })}
              />
              <Form.Control.Feedback type="invalid">{errors.email?.message}</Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3" controlId="signup-phone">
              <Form.Label className="fw-medium">
                {t('signupPhone')} <span className="text-danger">*</span>
              </Form.Label>
              <Form.Control
                autoComplete="tel"
                placeholder="9848123456"
                isInvalid={Boolean(errors.phone)}
                isValid={Boolean(!errors.phone && watch('phone'))}
                {...register('phone', {
                  required: isNp ? 'फोन नम्बर आवश्यक छ।' : 'Phone is required.',
                  minLength: { value: 10, message: isNp ? 'फोन नम्बर कम्तिमा १० अंक हुनुपर्छ।' : 'Phone must be at least 10 digits.' },
                  maxLength: { value: 15, message: isNp ? 'फोन नम्बर धेरै लामो छ।' : 'Phone too long.' },
                  pattern: { value: /^[\+]?[0-9]{10,15}$/, message: isNp ? 'मान्य फोन नम्बर राख्नुहोस्।' : 'Enter a valid phone number.' },
                })}
              />
              <Form.Control.Feedback type="invalid">{errors.phone?.message}</Form.Control.Feedback>
              <Form.Text className="text-muted">{isNp ? 'नेपाली मोबाइल नम्बर: 98XXXXXXXX' : 'e.g. 9848123456'}</Form.Text>
            </Form.Group>

            <Form.Group className="mb-2" controlId="signup-password">
              <Form.Label className="fw-medium">
                {t('signupPassword')} <span className="text-danger">*</span>
              </Form.Label>
              <InputGroup>
                <Form.Control
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  placeholder={isNp ? 'कम्तिमा ६ अक्षर' : 'At least 6 characters'}
                  isInvalid={Boolean(errors.password)}
                  isValid={Boolean(!errors.password && passwordValue.length >= 6)}
                  {...register('password', {
                    required: isNp ? 'पासवर्ड आवश्यक छ।' : 'Password is required.',
                    minLength: { value: 6, message: isNp ? 'पासवर्ड कम्तिमा ६ अक्षर हुनुपर्छ।' : 'Password must be at least 6 characters.' },
                    maxLength: { value: 32, message: isNp ? 'पासवर्ड ३२ अक्षरभन्दा बढी हुन सक्दैन।' : 'Password too long.' },
                  })}
                />
                <Button
                  variant="outline-secondary"
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  tabIndex={-1}
                  style={{ borderLeft: 'none', zIndex: 0 }}
                >
                  <EyeIcon open={showPassword} />
                </Button>
                <Form.Control.Feedback type="invalid">{errors.password?.message}</Form.Control.Feedback>
              </InputGroup>
            </Form.Group>

            {passwordValue.length > 0 && (
              <div className="mb-3">
                <div className="d-flex gap-1 mb-1">
                  {[1, 2, 3, 4].map((i) => (
                    <div
                      key={i}
                      style={{
                        height: '4px', flex: 1, borderRadius: '2px',
                        background: i <= strengthScore ? strengthColor : '#e2e8f0',
                        transition: 'background 0.3s',
                      }}
                    />
                  ))}
                </div>
                <div className="d-flex justify-content-between">
                  <div className="d-flex gap-3 flex-wrap">
                    <small style={{ color: strength.length ? '#22c55e' : '#94a3b8' }}>
                      {strength.length ? '✓' : '○'} {isNp ? '६+ अक्षर' : '6+ chars'}
                    </small>
                    <small style={{ color: strength.upper ? '#22c55e' : '#94a3b8' }}>
                      {strength.upper ? '✓' : '○'} A-Z
                    </small>
                    <small style={{ color: strength.lower ? '#22c55e' : '#94a3b8' }}>
                      {strength.lower ? '✓' : '○'} a-z
                    </small>
                    <small style={{ color: strength.number ? '#22c55e' : '#94a3b8' }}>
                      {strength.number ? '✓' : '○'} 0-9
                    </small>
                  </div>
                  {strengthLabels[strengthScore] && (
                    <small style={{ color: strengthColor, fontWeight: 600 }}>{strengthLabels[strengthScore]}</small>
                  )}
                </div>
              </div>
            )}

            <Button type="submit" disabled={isLoading} className="w-100 py-2 mt-1">
              {isLoading
                ? <><span className="spinner-border spinner-border-sm me-2" />{t('signupLoading')}</>
                : t('signupBtn')}
            </Button>
          </Form>

          <p className="mt-4 mb-0 text-center">
            {t('signupHasAccount')} <Link to="/login">{t('signupLoginLink')}</Link>
          </p>
        </Card.Body>
      </Card>
    </Container>
  )
}
