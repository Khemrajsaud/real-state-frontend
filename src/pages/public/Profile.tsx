import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useEffect, useRef, useState } from 'react'
import { Alert, Button, Col, Container, Form, Modal, Row, Spinner } from 'react-bootstrap'
import { getProfile, updateProfileAvatar, updateProfileText, deleteProfile, type ProfileTextPayload } from '../../api/profile'
import { ErrorState } from '../../components/common/ErrorState'
import { Loader } from '../../components/common/Loader'
import { useAuth } from '../../hooks/useAuth'
import { useLanguage } from '../../context/LanguageContext'

export function Profile() {
  const { user, logout } = useAuth()
  const { t, language } = useLanguage()
  const isNp = language === 'np'
  const userId = user?.id ?? user?._id
  const queryClient = useQueryClient()

  const [statusMsg, setStatusMsg] = useState<{ type: 'success' | 'danger'; text: string } | null>(null)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null)
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [dob, setDob] = useState('')
  const fileInputRef = useRef<HTMLInputElement>(null)

  const { data: profile, isLoading, isError } = useQuery({
    queryKey: ['profile', userId],
    queryFn: () => getProfile(userId!),
    enabled: Boolean(userId),
    retry: 1,
  })

  const displayProfile = profile ?? user

  useEffect(() => {
    if (displayProfile) {
      setName(String(displayProfile.name ?? ''))
      setPhone(String(displayProfile.phone ?? ''))
      setDob(displayProfile.dob ? String(displayProfile.dob).split('T')[0] : '')
    }
  }, [displayProfile])

  // ── Update profile text ──
  const textMutation = useMutation({
    mutationFn: () => updateProfileText(userId ?? '', {
      name,
      phone,
      ...(dob ? { dob } : {}),
    } as ProfileTextPayload),
    onSuccess: async () => {
      setStatusMsg({ type: 'success', text: isNp ? 'प्रोफाइल अपडेट भयो!' : 'Profile updated successfully!' })
      await queryClient.invalidateQueries({ queryKey: ['profile', userId] })
    },
    onError: (err: Error) => setStatusMsg({ type: 'danger', text: err.message }),
  })

  // ── Upload avatar ──
  const avatarMutation = useMutation({
    mutationFn: (file: File) => updateProfileAvatar(userId ?? '', file),
    onSuccess: async () => {
      setStatusMsg({ type: 'success', text: t('profilePhotoSaved') })
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

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    const file = e.dataTransfer.files?.[0]
    if (!file) return
    setAvatarPreview(URL.createObjectURL(file))
    avatarMutation.mutate(file)
  }

  const avatarUrl = avatarPreview ?? (displayProfile?.avatar as string) ?? null
  const role = (displayProfile?.role as string) ?? 'Normal Users'

  if (!userId) return <Container className="py-5"><ErrorState title={t('profileLoginRequired')} /></Container>
  if (isLoading) return <Container className="py-5"><Loader label={isNp ? 'प्रोफाइल लोड हुँदैछ...' : 'Loading profile...'} /></Container>
  if (isError && !displayProfile) return <Container className="py-5"><ErrorState title={t('profileLoadError')} /></Container>

  return (
    <main>
      <Container className="py-5">
        <h1 className="h3 fw-bold mb-4">{isNp ? 'मेरो प्रोफाइल' : 'My Profile'}</h1>

        {statusMsg && (
          <Alert variant={statusMsg.type} dismissible onClose={() => setStatusMsg(null)}>
            {statusMsg.text}
          </Alert>
        )}

        <Row className="g-4">

          {/* ── Left: Form ── */}
          <Col lg={7}>
            <div className="bg-white rounded shadow-sm p-4">

              {/* Full Name */}
              <Form.Group className="mb-4">
                <Form.Label style={{ color: '#2563eb', fontWeight: 500, fontSize: '0.9rem' }}>
                  {isNp ? 'पूरा नाम' : 'Full Name'}
                </Form.Label>
                <Form.Control
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder={isNp ? 'तपाईंको पूरा नाम' : 'Your full name'}
                  style={{ borderTop: 'none', borderLeft: 'none', borderRight: 'none', borderRadius: 0, boxShadow: 'none', paddingLeft: 0 }}
                />
              </Form.Group>

              {/* Email */}
              <Form.Group className="mb-4">
                <Form.Label style={{ color: '#2563eb', fontWeight: 500, fontSize: '0.9rem' }}>
                  {isNp ? 'इमेल ठेगाना' : 'Email Address'}
                </Form.Label>
                <Form.Control
                  value={displayProfile?.email as string ?? ''}
                  disabled
                  placeholder={isNp ? 'इमेल' : 'Email'}
                  style={{ borderTop: 'none', borderLeft: 'none', borderRight: 'none', borderRadius: 0, boxShadow: 'none', paddingLeft: 0, background: 'transparent' }}
                />
                <Form.Text style={{ color: '#2563eb', fontStyle: 'italic', fontSize: '0.78rem' }}>
                  {isNp ? 'इमेल परिवर्तन गर्न सकिँदैन' : 'Email cannot be changed'}
                </Form.Text>
              </Form.Group>

              {/* Mobile */}
              <Form.Group className="mb-4">
                <Form.Label style={{ color: '#2563eb', fontWeight: 500, fontSize: '0.9rem' }}>
                  {isNp ? 'मोबाइल नम्बर' : 'Mobile Number'}
                </Form.Label>
                <Form.Control
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder={isNp ? 'मोबाइल नम्बर राख्नुहोस्' : 'Enter your mobile number'}
                  style={{ borderTop: 'none', borderLeft: 'none', borderRight: 'none', borderRadius: 0, boxShadow: 'none', paddingLeft: 0 }}
                />
              </Form.Group>

              {/* Date of Birth */}
              <Form.Group className="mb-4">
                <Form.Label style={{ color: '#2563eb', fontWeight: 500, fontSize: '0.9rem' }}>
                  {isNp ? 'जन्म मिति' : 'Date of Birth'}
                </Form.Label>
                <Form.Control
                  type="date"
                  value={dob}
                  onChange={(e) => setDob(e.target.value)}
                  style={{ borderTop: 'none', borderLeft: 'none', borderRight: 'none', borderRadius: 0, boxShadow: 'none', paddingLeft: 0, width: 'auto' }}
                />
              </Form.Group>

              {/* Role */}
              <Form.Group className="mb-4">
                <Form.Label style={{ color: '#2563eb', fontWeight: 500, fontSize: '0.9rem' }}>
                  {isNp ? 'तपाईंको भूमिका' : 'Your Roles'}
                </Form.Label>
                <div>
                  <span className="badge bg-primary px-3 py-2" style={{ fontSize: '0.85rem', borderRadius: '20px' }}>
                    {role === 'admin' ? 'Admin' : (isNp ? 'सामान्य प्रयोगकर्ता' : 'Normal Users')}
                  </span>
                </div>
              </Form.Group>

              {/* Buttons */}
              <Row className="g-3 mt-2">
                <Col xs={6}>
                  <Button
                    className="w-100 py-2"
                    onClick={() => textMutation.mutate()}
                    disabled={textMutation.isPending}
                  >
                    {textMutation.isPending
                      ? <><Spinner size="sm" className="me-2" />{t('profileSaving')}</>
                      : (isNp ? 'प्रोफाइल अपडेट गर्नुहोस्' : 'Update Profile')}
                  </Button>
                </Col>
                <Col xs={6}>
                  <Button
                    variant="outline-danger"
                    className="w-100 py-2"
                    onClick={() => setShowDeleteModal(true)}
                  >
                    {isNp ? 'प्रोफाइल मेटाउनुहोस्' : 'Delete Profile'}
                  </Button>
                </Col>
              </Row>
            </div>
          </Col>

          {/* ── Right: Profile Picture ── */}
          <Col lg={5}>
            <div className="bg-white rounded shadow-sm p-4">
              <p className="fw-medium mb-3" style={{ fontSize: '0.9rem' }}>
                {isNp ? 'प्रोफाइल तस्वीर' : 'Profile Picture'}
              </p>

              {/* Upload area */}
              <div
                onClick={() => fileInputRef.current?.click()}
                onDrop={handleDrop}
                onDragOver={(e) => e.preventDefault()}
                style={{
                  border: '2px dashed #d1d5db',
                  borderRadius: '8px',
                  minHeight: '260px',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  background: '#fafafa',
                  transition: 'border-color 0.2s',
                  overflow: 'hidden',
                }}
              >
                {avatarMutation.isPending ? (
                  <div className="text-center">
                    <Spinner variant="primary" />
                    <p className="text-muted small mt-2">{t('profileUploading')}</p>
                  </div>
                ) : avatarUrl ? (
                  <img
                    src={avatarUrl}
                    alt="Profile"
                    style={{ width: '100%', height: '260px', objectFit: 'cover' }}
                  />
                ) : (
                  <div className="text-center px-3">
                    {/* Camera crossed icon */}
                    <svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" fill="none" viewBox="0 0 24 24" stroke="#1a1a1a" strokeWidth="1.2" style={{ opacity: 0.85 }}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 3l18 18M9.88 9.88a3 3 0 104.24 4.24M10.73 5H13a2 2 0 011.664.89l.812 1.22A2 2 0 0017.07 8H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2v-9a2 2 0 012-2h.93" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 8h.01" />
                    </svg>
                    <p className="mt-3 mb-1 fw-medium" style={{ fontSize: '0.9rem' }}>
                      {isNp ? 'अपलोड गर्न क्लिक गर्नुहोस् वा ड्र्याग गर्नुहोस्' : 'Click to upload or drag and drop'}
                    </p>
                    <p className="text-muted" style={{ fontSize: '0.78rem' }}>PNG, JPG, GIF up to 10MB</p>
                  </div>
                )}
              </div>
              <input ref={fileInputRef} type="file" accept="image/*" className="d-none" onChange={handleAvatarChange} />

              {avatarUrl && (
                <Button
                  variant="outline-secondary"
                  size="sm"
                  className="w-100 mt-2"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={avatarMutation.isPending}
                >
                  📷 {t('profileChangePhoto')}
                </Button>
              )}
            </div>
          </Col>
        </Row>

        {/* Delete Modal */}
        <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)} centered>
          <Modal.Header closeButton>
            <Modal.Title className="text-danger">{t('profileDeleteTitle')}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <p>
              {isNp ? 'के तपाईं साँच्चै ' : 'Are you sure you want to delete '}
              <strong>{displayProfile?.name as string}</strong>
              {isNp ? ' को खाता स्थायी रूपमा मेटाउन चाहनुहुन्छ?' : ' permanently?'}
            </p>
            <Alert variant="danger" className="small mb-0">
              {t('profileDeleteWarning')}
            </Alert>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
              {t('profileCancel')}
            </Button>
            <Button
              variant="danger"
              disabled={deleteMutation.isPending}
              onClick={() => deleteMutation.mutate()}
            >
              {deleteMutation.isPending
                ? <><Spinner size="sm" className="me-2" />{t('profileDeleting')}</>
                : t('profileDeleteConfirmBtn')}
            </Button>
          </Modal.Footer>
        </Modal>
      </Container>
    </main>
  )
}
