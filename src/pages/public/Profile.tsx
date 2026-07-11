import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useEffect, useRef, useState } from 'react'
import { Alert, Button, Card, Col, Container, Form, Modal, Row, Spinner } from 'react-bootstrap'
import { useForm } from 'react-hook-form'
import { getProfile, updateProfileAvatar, updateProfileText, deleteProfile, type ProfileTextPayload } from '../../api/profile'
import { ErrorState } from '../../components/common/ErrorState'
import { Loader } from '../../components/common/Loader'
import { useAuth } from '../../hooks/useAuth'

export function Profile() {
  const { user, logout } = useAuth()
  const userId = user?._id ?? user?.id
  const queryClient = useQueryClient()

  const [statusMsg, setStatusMsg] = useState<{ type: 'success' | 'danger'; text: string } | null>(null)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const { register, handleSubmit, reset, formState: { errors, isDirty } } = useForm<ProfileTextPayload>()

  // ── Fetch profile ──
  const { data: profile, isLoading, isError } = useQuery({
    queryKey: ['profile', userId],
    queryFn: () => getProfile(userId ?? ''),
    enabled: Boolean(userId),
  })

  useEffect(() => {
    if (profile) {
      reset({
        name: String(profile.name ?? ''),
        phone: String(profile.phone ?? ''),
        dob: profile.dob ? String(profile.dob).split('T')[0] : '',
      })
    }
  }, [profile, reset])

  // ── Update text ──
  const textMutation = useMutation({
    mutationFn: (payload: ProfileTextPayload) => updateProfileText(userId ?? '', payload),
    onSuccess: async (updated) => {
      setStatusMsg({ type: 'success', text: 'प्रोफाइल सफलतापूर्वक अपडेट भयो!' })
      await queryClient.invalidateQueries({ queryKey: ['profile', userId] })
      reset({ name: String(updated.name ?? ''), phone: String(updated.phone ?? ''), dob: updated.dob ? String(updated.dob).split('T')[0] : '' })
    },
    onError: (err: Error) => setStatusMsg({ type: 'danger', text: err.message }),
  })

  // ── Upload avatar ──
  const avatarMutation = useMutation({
    mutationFn: (file: File) => updateProfileAvatar(userId ?? '', file),
    onSuccess: async () => {
      setStatusMsg({ type: 'success', text: 'प्रोफाइल फोटो अपडेट भयो!' })
      await queryClient.invalidateQueries({ queryKey: ['profile', userId] })
    },
    onError: (err: Error) => setStatusMsg({ type: 'danger', text: err.message }),
  })

  // ── Delete account ──
  const deleteMutation = useMutation({
    mutationFn: () => deleteProfile(userId ?? ''),
    onSuccess: () => { setShowDeleteModal(false); logout() },
    onError: (err: Error) => setStatusMsg({ type: 'danger', text: err.message }),
  })

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setAvatarPreview(URL.createObjectURL(file))
    avatarMutation.mutate(file)
  }

  const avatarUrl = avatarPreview ?? (profile?.avatar as string) ?? null
  const initials = (profile?.name as string)?.charAt(0)?.toUpperCase() ?? 'U'

  if (isLoading) return <Container className="py-5"><Loader label="प्रोफाइल लोड हुँदैछ..." /></Container>
  if (isError) return <Container className="py-5"><ErrorState title="प्रोफाइल लोड गर्न सकिएन" /></Container>

  return (
    <main>
      <Container className="py-5">
        <p className="eyebrow text-primary">मेरो खाता</p>
        <h1 className="display-6 fw-bold mb-4">प्रोफाइल</h1>

        {statusMsg && (
          <Alert variant={statusMsg.type} dismissible onClose={() => setStatusMsg(null)}>
            {statusMsg.text}
          </Alert>
        )}

        <Row className="g-4">
          {/* ── Left: Avatar Card ── */}
          <Col lg={4}>
            <Card className="border-0 shadow-sm text-center">
              <Card.Body className="p-4">
                {/* Avatar */}
                <div className="position-relative d-inline-block mb-3">
                  {avatarUrl ? (
                    <img
                      src={avatarUrl}
                      alt="Avatar"
                      style={{ width: '100px', height: '100px', borderRadius: '50%', objectFit: 'cover', border: '3px solid #e2e8f0' }}
                    />
                  ) : (
                    <div style={{
                      width: '100px', height: '100px', borderRadius: '50%',
                      background: 'var(--bs-primary)', color: '#fff',
                      fontSize: '2.5rem', fontWeight: 700,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      margin: '0 auto',
                    }}>
                      {initials}
                    </div>
                  )}
                  {/* Camera overlay button */}
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={avatarMutation.isPending}
                    style={{
                      position: 'absolute', bottom: 0, right: 0,
                      width: '32px', height: '32px', borderRadius: '50%',
                      background: 'var(--bs-primary)', border: '2px solid #fff',
                      color: '#fff', cursor: 'pointer',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}
                    title="फोटो बदल्नुहोस्"
                  >
                    {avatarMutation.isPending
                      ? <Spinner size="sm" style={{ width: '14px', height: '14px' }} />
                      : <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                    }
                  </button>
                  <input ref={fileInputRef} type="file" accept="image/*" className="d-none" onChange={handleAvatarChange} />
                </div>

                <h5 className="fw-bold mb-0">{profile?.name as string}</h5>
                <p className="text-muted small mb-3">{profile?.email as string}</p>
                <p className="text-muted small mb-0">📞 {profile?.phone as string}</p>
                {profile?.dob && (
                  <p className="text-muted small mb-0 mt-1">
                    🎂 {new Date(profile.dob as string).toLocaleDateString('ne-NP')}
                  </p>
                )}

                <Button
                  variant="outline-primary"
                  size="sm"
                  className="mt-3 w-100"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={avatarMutation.isPending}
                >
                  {avatarMutation.isPending ? 'अपलोड हुँदैछ...' : '📷 फोटो बदल्नुहोस्'}
                </Button>
              </Card.Body>
            </Card>
          </Col>

          {/* ── Right: Edit Form ── */}
          <Col lg={8}>
            <Card className="border-0 shadow-sm">
              <Card.Header className="bg-white border-bottom py-3">
                <h5 className="mb-0 fw-semibold">व्यक्तिगत जानकारी</h5>
              </Card.Header>
              <Card.Body className="p-4">
                <Form onSubmit={handleSubmit((data) => textMutation.mutate(data))} noValidate>
                  <Row className="g-3">
                    <Col md={6}>
                      <Form.Label className="fw-medium">पूरा नाम <span className="text-danger">*</span></Form.Label>
                      <Form.Control
                        placeholder="तपाईंको नाम"
                        isInvalid={Boolean(errors.name)}
                        {...register('name', {
                          required: 'नाम आवश्यक छ।',
                          minLength: { value: 2, message: 'नाम कम्तिमा २ अक्षर हुनुपर्छ।' },
                        })}
                      />
                      <Form.Control.Feedback type="invalid">{errors.name?.message}</Form.Control.Feedback>
                    </Col>

                    <Col md={6}>
                      <Form.Label className="fw-medium">फोन नम्बर <span className="text-danger">*</span></Form.Label>
                      <Form.Control
                        placeholder="9848XXXXXX"
                        isInvalid={Boolean(errors.phone)}
                        {...register('phone', {
                          required: 'फोन नम्बर आवश्यक छ।',
                          minLength: { value: 10, message: 'फोन नम्बर कम्तिमा १० अंक हुनुपर्छ।' },
                          pattern: { value: /^[\+]?[0-9]{10,15}$/, message: 'मान्य फोन नम्बर राख्नुहोस्।' },
                        })}
                      />
                      <Form.Control.Feedback type="invalid">{errors.phone?.message}</Form.Control.Feedback>
                    </Col>

                    <Col md={6}>
                      <Form.Label className="fw-medium">इमेल</Form.Label>
                      <Form.Control value={profile?.email as string ?? ''} disabled className="bg-light" />
                      <Form.Text className="text-muted">इमेल परिवर्तन गर्न सकिँदैन।</Form.Text>
                    </Col>

                    <Col md={6}>
                      <Form.Label className="fw-medium">जन्म मिति</Form.Label>
                      <Form.Control type="date" {...register('dob')} />
                    </Col>
                  </Row>

                  <div className="mt-4 d-flex gap-2">
                    <Button type="submit" disabled={textMutation.isPending || !isDirty}>
                      {textMutation.isPending
                        ? <><Spinner size="sm" className="me-2" />सेभ हुँदैछ...</>
                        : 'परिवर्तन सेभ गर्नुहोस्'}
                    </Button>
                    {isDirty && (
                      <Button variant="outline-secondary" type="button" onClick={() => reset()}>
                        रद्द गर्नुहोस्
                      </Button>
                    )}
                  </div>
                </Form>
              </Card.Body>
            </Card>

            {/* ── Danger Zone ── */}
            <Card className="border-0 shadow-sm mt-4 border-start border-danger border-4">
              <Card.Body className="p-4">
                <h6 className="fw-bold text-danger mb-2">⚠️ खतरनाक क्षेत्र</h6>
                <p className="text-muted small mb-3">
                  खाता मेटाउनु स्थायी हो। तपाईंका सबै डेटा, मनपर्ने सम्पत्तिहरू र प्रोफाइल जानकारी हटाइनेछ।
                </p>
                <Button variant="outline-danger" size="sm" onClick={() => setShowDeleteModal(true)}>
                  🗑️ खाता मेटाउनुहोस्
                </Button>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* ── Delete Confirmation Modal ── */}
        <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)} centered>
          <Modal.Header closeButton>
            <Modal.Title className="text-danger">खाता मेटाउनुहोस्</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <p>के तपाईं साँच्चै <strong>{profile?.name as string}</strong> को खाता स्थायी रूपमा मेटाउन चाहनुहुन्छ?</p>
            <Alert variant="danger" className="small mb-0">
              यो कार्य पूर्ववत गर्न सकिँदैन। सबै डेटा हमेशाका लागि हटाइनेछ।
            </Alert>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
              रद्द गर्नुहोस्
            </Button>
            <Button
              variant="danger"
              disabled={deleteMutation.isPending}
              onClick={() => deleteMutation.mutate()}
            >
              {deleteMutation.isPending
                ? <><Spinner size="sm" className="me-2" />मेटाउँदैछ...</>
                : 'हो, स्थायी रूपमा मेटाउनुहोस्'}
            </Button>
          </Modal.Footer>
        </Modal>
      </Container>
    </main>
  )
}
